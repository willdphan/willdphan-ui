"use client";

import type { MotionValue } from "framer-motion";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  title: string;
  level?: number;
  ref?: React.RefObject<HTMLElement>;
}

// display scroll percentage
function ScrollPercentage({ progress }: { progress: MotionValue<number> }) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Update percentage when scroll progress changes
    const unsubscribe = progress.onChange((latest) => {
      setPercentage(Math.round(latest * 100));
    });

    // clean up
    return () => unsubscribe();
  }, [progress]);

  return <>{percentage}%</>;
}

// generate sections dynamically instead of hardcoding them
// global style for hiding scrollbars and gooey effect
const NoScrollbarStyles = () => (
  <style jsx global>{`
    /* Hide scrollbar for Chrome, Safari and Opera */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .no-scrollbar {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }

    /* Apply gooey effect */
    .gooey-container {
      filter: url(#goo-effect);
      will-change: filter;
      pointer-events: none;
    }

    .gooey-item {
      pointer-events: auto;
    }
  `}</style>
);

// SVG filter for gooey effect
const GooeyFilter = () => {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <filter id="goo-effect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

function DynamicScrollIndicator({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  // Track scroll progress
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // State for the table of contents toggle
  const [isOpen, setIsOpen] = useState(false);

  // Hover handlers
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  // Track which section is currently active
  const [activeSection, setActiveSection] = useState(0);
  // Track if a section was manually selected
  const [isManualSelection, setIsManualSelection] = useState(false);

  // State to store dynamically generated sections
  const [sections, setSections] = useState<Section[]>([]);

  // Function to scroll to a specific section
  const scrollToSection = (index: number) => {
    if (!scrollRef.current) return;

    // Get the section from our sections array
    const section = sections[index];
    if (!section) return;

    // Set active section immediately and mark as manual selection
    setActiveSection(index);
    setIsManualSelection(true);

    // Find the corresponding heading element
    const sectionElements = scrollRef.current.querySelectorAll("h1, h2, h3");
    let targetElement = null;

    for (let i = 0; i < sectionElements.length; i++) {
      if (sectionElements[i].textContent === section.title) {
        targetElement = sectionElements[i];
        break;
      }
    }

    if (targetElement) {
      // Use scrollIntoView with options for smooth scrolling
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      // reset manual selection after scroll animation completes
      setTimeout(() => {
        setIsManualSelection(false);
      }, 1000); // Wait for scroll animation to complete
    }
  };

  //  GENERATE H1 SECTIONS
  // generate sections from h1 elements
  useEffect(() => {
    if (!scrollRef.current) return;

    const sectionElements = scrollRef.current.querySelectorAll("h1, h2, h3");
    const generatedSections: Section[] = [];

    sectionElements.forEach((section, index) => {
      // Get the section title
      const title = section.textContent || `Section ${index + 1}`;

      // Create a consistent ID based on the section title
      // This ensures the ID matches the title for better debugging and consistency
      const id = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

      generatedSections.push({
        id: id,
        title: title,
        level: 1, // Set all headers to the same level (1)
      });
    });

    setSections(generatedSections);
  }, [scrollRef]);

  // SCROLL BEHAVIOR
  // Set up Intersection Observer to track which section is in view
  // responds to manual clicking in toc
  useEffect(() => {
    if (!scrollRef.current || sections.length === 0) return;

    //map to quickly find section index by title
    const sectionTitleToIndex = new Map();
    sections.forEach((section, index) => {
      if (section.level !== 0) {
        sectionTitleToIndex.set(section.title, index);
      }
    });

    //check if we're at the bottom of the scroll container
    const checkIfAtBottom = () => {
      if (!scrollRef.current) return false;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      return scrollHeight - scrollTop - clientHeight < 20;
    };

    // Debounce function to limit how often the active section updates
    let debounceTimer: NodeJS.Timeout | null = null;

    const debouncedSetActiveSection = (index: number) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Only update if not manually selected
        if (!isManualSelection) {
          setActiveSection(index);
        }
      }, 50);
    };

    // use Intersection Observer API
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if a section was manually selected
        if (isManualSelection) return;

        // If we're not at the bottom, check which sections are visible
        for (const entry of entries) {
          // entry.isIntersecting is true when the section is visible in the viewport
          if (entry.isIntersecting) {
            // Get the text content of the section heading (e.g., "Section 1", "Section 2")
            const title = entry.target.textContent;

            // Look up the index of this section in our sections array using the title
            const index = sectionTitleToIndex.get(title);

            // If we found a matching section index
            if (index !== undefined) {
              // Update the active section in the Table of Contents
              // This will highlight the corresponding section in the TOC
              debouncedSetActiveSection(index);
            }
          }
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "-10% 0px -80% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all section headings
    const headings = scrollRef.current.querySelectorAll("h1, h2, h3");
    for (const heading of headings) {
      observer.observe(heading);
    }

    // Add scroll event listener for bottom detection
    // responds to user's natural scroll
    const handleScroll = () => {
      // Skip if a section was manually selected
      if (isManualSelection) return;

      if (checkIfAtBottom()) {
        const lastSectionIndex = sections.length - 1;
        if (lastSectionIndex !== -1) {
          debouncedSetActiveSection(lastSectionIndex);
        }
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    // clean up
    return () => {
      for (const heading of headings) {
        observer.unobserve(heading);
      }
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [scrollRef, sections, isManualSelection]);

  // SECTION HEIGHT
  // for each title and line height
  const sectionHeight = 21; // Base height per section

  // calc dimensions based on content
  const [dimensions, setDimensions] = useState({ width: 115, height: 0 });

  // CREATE CONTAINER SIZING
  useEffect(() => {
    // Create a temporary container to measure content
    const container = document.createElement("div");
    container.style.visibility = "hidden";
    container.style.position = "absolute";
    container.style.fontSize = "12px"; // text-xs equivalent
    container.style.whiteSpace = "nowrap";
    document.body.appendChild(container);

    // Find the longest title width and total height
    let maxWidth = 0;
    for (const section of sections) {
      const span = document.createElement("span");
      span.textContent = section.title;
      container.appendChild(span);
      const width = span.getBoundingClientRect().width;
      maxWidth = Math.max(maxWidth, width);
      container.removeChild(span);
    }

    // Remove the temporary container
    document.body.removeChild(container);

    // Calculate dimensions:
    // Width: content width + padding
    // Height: number of sections * section height + padding
    setDimensions({
      width: Math.ceil(maxWidth) + 50,
      height: sections.length * sectionHeight + 0, // Add some padding to total height
    });
  }, [sections]);

  // Create a spring animation for the gooey blob based on scroll position
  const scrollThresholdStart = 0.05; // 5% scroll threshold start
  const scrollThresholdEnd = 0.1; // 10% scroll threshold end
  const [percentage, setPercentage] = useState(0);

  // Update percentage when scroll progress changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setPercentage(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate gooey effect strength based on scroll position
  // Effect appears between 5% and 10% threshold
  const gooeyEffectStrength = useTransform(
    scrollYProgress,
    [scrollThresholdStart - 0.03, scrollThresholdStart, scrollThresholdEnd],
    [0, 1, 0]
  );

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 ">
      {/* SVG filter for gooey effect */}
      <GooeyFilter />

      {/* Main container with independent positioning for each element */}
      <div className="relative flex h-full items-center ">
        {/* Gooey container that wraps both elements */}
        <div
          className={`absolute top-0 right-0 ${
            percentage >= scrollThresholdStart - 0.01 &&
            percentage <= scrollThresholdEnd + 0.01
              ? "gooey-container"
              : ""
          }`}
        >
          {/* Scroll percentage indicator - positioned independently */}
          <div
            className="gooey-item absolute top-[150px] right-9"
            style={{ zIndex: 2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 1, y: -60 }}
              animate={{
                opacity: percentage >= scrollThresholdStart ? 1 : 0,
                scale: percentage >= scrollThresholdStart ? 1.1 : 1,
                y: percentage >= scrollThresholdStart ? -60 : 0,
              }}
              transition={{
                type: "spring",
                bounce: 0.3,
                scale: { type: "spring", stiffness: 300, damping: 15 },
                opacity: { duration: 0.3, ease: "easeInOut" },
              }}
              className="flex h-10 w-10 items-center justify-center bg-black text-white shadow-lg"
              style={{
                backgroundColor: "#000000 !important",
                borderRadius: 9999,
                scale: 1.1,
              }}
            >
              <div className="text-center">
                <div
                  className="font-normal text-[10px] text-white"
                  style={{ color: "#FFFFFF" }}
                >
                  {/* Use scrollYProgress to display percentage */}
                  <ScrollPercentage progress={scrollYProgress} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator UI - positioned independently */}
          <div
            className="gooey-item absolute top-[145px] right-8"
            style={{ zIndex: 1 }}
          >
            {/* Table of contents container */}
            <motion.div
              className="relative flex flex-row items-center justify-center overflow-hidden shadow-lg"
              style={{ backgroundColor: "#000000" }}
              initial={{
                width: 10,
                height: dimensions.height,
                scale: 1.1,
              }}
              animate={{
                width: isOpen ? dimensions.width : 40,
                borderRadius: isOpen ? 24 : 50,
                height: dimensions.height,
                scale:
                  percentage >= scrollThresholdStart - 0.03 &&
                  percentage <= scrollThresholdEnd + 0.01
                    ? 1.1
                    : 1,
              }}
              transition={{
                type: "spring",
                bounce: 0.3,
                scale: { type: "spring", stiffness: 300, damping: 15 },
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Two separate layers to prevent jerking */}
              {/* Layer 1: Indicator lines (always visible, fixed position) */}
              <div className="pointer-events-none absolute inset-0 flex w-full flex-col justify-center px-4 text-xs">
                {sections.map((section, index) => {
                  return (
                    <div
                      key={`indicator-${section.id}`}
                      className={"flex h-5 items-center justify-end"}
                    >
                      <div
                        style={{ borderRadius: 50 }}
                        className={`h-[1px] transition-colors duration-300 ${
                          section.level !== 0
                            ? index === activeSection
                              ? "w-5 bg-[#A7D0FF]"
                              : index === activeSection - 1 ||
                                index === activeSection + 1
                              ? "w-4 bg-[#E9E9E9]"
                              : index === activeSection - 2 ||
                                index === activeSection + 2
                              ? "w-4 bg-[#8f8f8f]"
                              : index === activeSection - 3 ||
                                index === activeSection + 3
                              ? "w-4 bg-[#555555]"
                              : index < activeSection
                              ? "w-4 bg-[#555555]"
                              : "w-4 bg-[#555555]"
                            : "w-4 bg-[#555555]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Layer 2: Section titles (only visible when open) */}
              {isOpen && (
                <div className="absolute inset-0 flex w-full flex-col justify-center pl-[16px] text-xs">
                  {sections.map((section, index) => {
                    return (
                      <div
                        key={`title-${section.id}`}
                        className={"mt-0.1 flex h-5"}
                      >
                        {section.level !== 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`cursor-pointer ${
                              index === activeSection
                                ? "text-[#A7D0FF]"
                                : index < activeSection
                                ? "text-[#555555]"
                                : "text-[#555555]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();

                              scrollToSection(index);
                            }}
                          >
                            {section.title || <span>&nbsp;</span>}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DynamicScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full w-full overflow-hidden ">
      {/* Global styles for hiding scrollbars */}
      <NoScrollbarStyles />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="no-scrollbar h-full w-full overflow-y-auto py-6 pt-10 pr-28 pl-8"
        style={{
          scrollBehavior: "smooth",
          maxHeight: "100%",
        }}
      >
        <div className="pb-8">
          <h1 className="mb-4 font-500">Not Just a Meme</h1>

          <p className="mb-4 text-[#646464]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget
            aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae. Phasellus ac dolor eget felis imperdiet
            finibus. Aenean ultricies mi vitae est. Mauris placerat eleifend
            leo.
          </p>

          <h1 className=" mt-6 mb-2 font-500">Costco</h1>
          <p className="mb-4 text-[#646464]">
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
            Integer nec odio. Praesent libero. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit
            fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit
            fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae.
          </p>

          <h2 className=" mt-6 mb-2 font-500">Big Justice</h2>
          <p className="mb-4 text-[#646464]">
            Praesent viverra, mauris in ultricies lacinia, urna velit tincidunt
            tortor, vel tincidunt tortor velit vel velit. Donec euismod, nunc
            eget aliquam tincidunt, nunc nunc aliquam nunc, eget aliquam nunc
            nunc eget nunc. Donec euismod, nunc eget aliquam tincidunt, nunc
            nunc aliquam nunc, eget aliquam nunc nunc eget nunc. Nam quam nunc,
            blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio
            et ante tincidunt tempus. Suspendisse potenti.
          </p>

          <h1 className="mt-6 mb-2 font-500">1 Big Boom</h1>
          <p className="mb-4 text-[#646464] ">
            Donec euismod, nunc eget aliquam tincidunt, nunc nunc aliquam nunc,
            eget aliquam nunc nunc eget nunc. Donec euismod, nunc eget aliquam
            tincidunt, nunc nunc aliquam nunc, eget aliquam nunc nunc eget nunc.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae. Cras ultricies mi eu turpis hendrerit
            fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae. In ac dui quis mi consectetuer
            lacinia.
          </p>

          <h2 className="mt-6 mb-2 font-500 text-black">Virality</h2>
          <p className="mb-4 text-[#646464]">
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Nullam accumsan lorem in dui. Cras
            ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Nullam accumsan lorem in dui. Cras
            ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae.
          </p>

          <h1 className="mt-6 mb-2 font-500">5 Big Booms</h1>
          <p className="mb-4 text-[#646464]">
            Fusce consequat, ex eget aliquet tincidunt, ex ex tincidunt ex, eget
            tincidunt ex ex eget ex. Fusce consequat, ex eget aliquet tincidunt,
            ex ex tincidunt ex, eget tincidunt ex ex eget ex. Fusce consequat,
            ex eget aliquet tincidunt, ex ex tincidunt ex, eget tincidunt ex ex
            eget ex. Aenean massa. Cum sociis natoque penatibus et magnis dis
            parturient montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.
          </p>

          <h2 className=" mt-6 mb-2 font-500">The End</h2>
          <p className="mb-4 text-[#646464]">
            Etiam et risus vitae augue aliquam aliquam. Etiam et risus vitae
            augue aliquam aliquam. Etiam et risus vitae augue aliquam aliquam.
            Etiam et risus vitae augue aliquam aliquam. Etiam et risus vitae
            augue aliquam aliquam. Nulla consequat massa quis enim. Donec pede
            justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim
            justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Sed euismod,
            nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam
            nunc nisl eget nisl. Sed euismod, nisl eget ultricies tincidunt,
            nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Sed
            euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget
            aliquam nunc nisl eget nisl. Nullam accumsan lorem in dui. Cras
            ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Nullam accumsan lorem in dui. Cras
            ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae.
          </p>

          <h2 className=" mt-6 mb-2 font-500">Moving Forward</h2>
          <p className="mb-4 text-[#646464]">
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Sed euismod, nisl eget ultricies
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
            Sed euismod, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
            eget aliquam nunc nisl eget nisl. Nullam quis ante. Etiam sit amet
            orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris
            sit amet nibh. Donec sodales sagittis magna.
          </p>
        </div>
      </div>

      {/* Custom scrollbar indicator */}
      <DynamicScrollIndicator scrollRef={scrollRef} />
    </div>
  );
}
