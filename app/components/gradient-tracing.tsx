"use client";

import { motion } from "framer-motion";

export function GradientTracing() {
  // dimensions for grid container
  const containerWidth = 595;
  const containerHeight = 384;

  // calc positions for evenly spaced lines
  // for 6 lines, we need 5 equal spaces
  const horizontalGap = containerHeight / 9;
  const verticalGap = containerWidth / 9;

  // arr with just 4 horizontal and 4 vertical lines in the middle area of the container
  const horizontalPositions = [
    Math.round(2 * horizontalGap),
    Math.round(3 * horizontalGap),
    Math.round(4 * horizontalGap),
    Math.round(5 * horizontalGap),
  ];

  const verticalPositions = [
    Math.round(2 * verticalGap),
    Math.round(3 * verticalGap),
    Math.round(4 * verticalGap),
    Math.round(5 * verticalGap),
    Math.round(6 * verticalGap),
  ];

  // useEffect(() => {
  //   // 595, 384
  //   console.log(containerWidth, containerHeight);
  // }, []);

  return (
    <div className="relative  w-full max-w-[300px] h-[300px] my-20 overflow-hidden rounded-xl border border-border pb-[100px]">
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 transform"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
        }}
      >
        {/* Horizontal Lines - Fixed at specific positions */}
        {horizontalPositions.map((position) => (
          <svg
            key={`horizontal-line-${position}`}
            xmlns="http://www.w3.org/2000/svg"
            width={containerWidth}
            height={1}
            viewBox={`0 0 ${containerWidth} 1`}
            fill="none"
            style={{
              position: "absolute",
              top: `${position}px`,
              left: 0,
            }}
          >
            <path
              d={`M${containerWidth} 0.5L0 0.5`}
              stroke="#333333"
              strokeWidth="0.75"
            />
          </svg>
        ))}

        {/* Vertical Lines - Fixed at specific positions */}
        {verticalPositions.map((position) => (
          <svg
            key={`vertical-line-${position}`}
            xmlns="http://www.w3.org/2000/svg"
            width={1}
            height={containerHeight}
            viewBox={`0 0 1 ${containerHeight}`}
            fill="none"
            style={{
              position: "absolute",
              left: `${position}px`,
              top: 0,
            }}
          >
            <path
              d={`M0.5 0V${containerHeight}`}
              stroke="#333333"
              strokeWidth="0.75"
            />
          </svg>
        ))}

        {/* ANIMATION 1 - MIDDLE RIGHT */}

        <div className="absolute right-[270px] bottom-[65.5px] z-[99]">
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: 0,
            }}
          >
            {(() => {
              const path =
                "M5 185.5V14.5H27C30.3137 14.5 33 11.8137 33 8.5V0.5";

              return (
                <svg
                  width="41"
                  height="190"
                  viewBox={"0 0 38 190"}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={path} stroke="#333333" strokeOpacity="0.2" />
                  <motion.path
                    d={path}
                    stroke="url(#pulse-1)"
                    strokeLinecap="round"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      times: [0, 0.3, 0.8, 1],
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      // We animate the gradient coordinates to create a flowing effect along the path.
                      // The animation moves the gradient from the start to the end of the path,
                      // creating an illuminated section that travels along the line.
                      //
                      // This creates a visual effect of energy or data flowing through the path,
                      // similar to how signals might move through circuits or networks.
                      animate={{
                        x1: [0, 100], // This moves the start point of our glowy line from left to right
                        x2: [0, 30], // This controls how wide our glowy part is - like a flashlight beam
                        y1: [0, 92], // This moves the start point up and down
                        y2: [368, 92], // This moves the end point to create a flowing light effect - like water in a hose
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      id="pulse-1"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BDD3FF" stopOpacity="0" />
                      <stop
                        offset="0.2"
                        stopColor="#BDD3FF"
                        stopOpacity="0.8"
                      />
                      <stop offset="0.5" stopColor="#BDD3FF" />
                      <stop offset="0.7" stopColor="#BDD3FF" />
                      <stop offset="1" stopColor="#BDD3FF" stopOpacity="0" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              );
            })()}
          </div>
        </div>

        {/* ANIMATION 2 - TOP */}

        <div className="-top-[70px] absolute left-[264px] z-[99]">
          <div
            className="absolute"
            style={{
              top: 0,
              left: 0,
              WebkitMaskImage:
                "linear-gradient(to right, black 80%, transparent)",
              maskImage: "linear-gradient(to right, black 80%, transparent)",
            }}
          >
            {(() => {
              const path = "M66.5 183H0.5V0";

              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="67"
                  height="184"
                  viewBox="0 0 67 184"
                  fill="none"
                >
                  <path d={path} stroke="#333333" strokeOpacity="0.2" />
                  <motion.path
                    d={path}
                    stroke="url(#pulse-2)"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    initial={{ pathLength: 1, opacity: 0 }}
                    animate={{
                      pathLength: 0,
                      opacity: [0, 0.8, 0.8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      times: [0, 0.2, 0.7, 1],
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      animate={{
                        x1: [0, 67 * 2],
                        x2: [0, 67],
                        y1: [0, 184 * 2],
                        y2: [0, 184],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      id="pulse-2"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BDD3FF" stopOpacity="0" />
                      <stop
                        offset="0.15"
                        stopColor="#BDD3FF"
                        stopOpacity="0.3"
                      />
                      <stop offset="0.35" stopColor="#BDD3FF" />
                      <stop offset="0.55" stopColor="#BDD3FF" />
                      <stop
                        offset="0.75"
                        stopColor="#BDD3FF"
                        stopOpacity="0.2"
                      />
                      <stop offset="1" stopColor="#BDD3FF" stopOpacity="0" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              );
            })()}
          </div>
        </div>

        {/* ANIMATION 3 - MIDDLE LEFT */}
        <div className="absolute bottom-[60px] left-[230px] z-[99]">
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: 0,
            }}
          >
            {(() => {
              const path = "M33 185.5V14.5H11C7.68629 14.5 5 11.8137 5 8.5V0.5";

              return (
                <svg
                  width="42"
                  height="195"
                  viewBox="0 0 40 198"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={path} stroke="#333333" strokeOpacity="0.2" />
                  <motion.path
                    d={path}
                    stroke="url(#pulse-3)"
                    strokeLinecap="round"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 0.5,
                      times: [0, 0.3, 0.8, 1],
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      animate={{
                        x1: [200, 0], // Start from right side and move left
                        x2: [0, 150], // Control width of glow effect
                        y1: [0, 198], // Start from bottom and move to top
                        y2: [-200, 200], // End point moves from bottom-middle to top-left
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      id="pulse-3"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BDD3FF" stopOpacity="0" />
                      <stop
                        offset="0.2"
                        stopColor="#BDD3FF"
                        stopOpacity="0.8"
                      />
                      <stop offset="0.5" stopColor="#BDD3FF" />
                      <stop offset="0.7" stopColor="#BDD3FF" />
                      <stop offset="1" stopColor="#BDD3FF" stopOpacity="0" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              );
            })()}
          </div>
        </div>

        {/* ANIMATION 4 - RIGHT SIDE */}
        <div className="absolute top-[113px] right-[49px] z-[99]">
          <div
            className="absolute"
            style={{
              top: 0,
              right: 0,
            }}
          >
            {(() => {
              const path =
                "M391 25H71.5V8.5C71.5 4.08172 67.9183 0.5 63.5 0.5H0.5";

              return (
                <svg
                  width="286"
                  height="16"
                  viewBox="0 0 286 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={path} stroke="#333333" strokeOpacity="0.2" />
                  <motion.path
                    d={path}
                    stroke="url(#pulse-4)"
                    strokeLinecap="round"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 1,
                      times: [0, 0.3, 0.8, 1],
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      animate={{
                        x1: [300, 0], // Start from right side and move left
                        x2: [0, 300], // Control width of glow effect
                        y1: [0, 300], // Start from bottom and move to top
                        y2: [-200, 200], // End point moves from bottom-middle to top-left
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      id="pulse-4"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BDD3FF" stopOpacity="0" />
                      <stop
                        offset="0.2"
                        stopColor="#BDD3FF"
                        stopOpacity="0.8"
                      />
                      <stop offset="0.5" stopColor="#BDD3FF" />
                      <stop offset="0.7" stopColor="#BDD3FF" />
                      <stop offset="1" stopColor="#BDD3FF" stopOpacity="0" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              );
            })()}
          </div>
        </div>

        {/* ANIMATION 5 - LEFT SIDE */}
        <div className="absolute right-[279px] bottom-[255px] z-[99]">
          <div
            className="absolute"
            style={{
              bottom: 0,
              right: 0,
            }}
          >
            {(() => {
              const path =
                "M0 0.5H166H240V17.5C240 20.8137 242.686 23.5 246 23.5H285.5";

              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="286"
                  height="15.5"
                  viewBox="0 0 286 24"
                  fill="none"
                  style={{ transform: "scaleY(-1)" }}
                >
                  <path d={path} stroke="#333333" strokeOpacity="0.2" />
                  <motion.path
                    d={path}
                    stroke="url(#pulse-5)"
                    strokeLinecap="round"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 0.75,
                      times: [0, 0.3, 0.8, 1],
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      animate={{
                        x1: [200, 0], // Start from left side and move right
                        x2: [0, 150], // Control width of glow effect
                        y1: [0, 198], // Start from top and move to bottom
                        y2: [-200, 200], // End point moves from top-right to bottom-middle
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      id="pulse-5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BDD3FF" stopOpacity="0" />
                      <stop
                        offset="0.2"
                        stopColor="#BDD3FF"
                        stopOpacity="0.8"
                      />
                      <stop offset="0.5" stopColor="#BDD3FF" />
                      <stop offset="0.7" stopColor="#BDD3FF" />
                      <stop offset="1" stopColor="#BDD3FF" stopOpacity="0" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              );
            })()}
          </div>
        </div>

        {/* Button in the center */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-[128px] left-1/2 transform rounded-[8px]">
          <motion.button
            className="h-full w-full rounded-lg px-2 py-2 text-white"
            style={{
              borderRadius: "6px",
              position: "relative",
              overflow: "hidden",
              background: "#0A0A0A",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#333333",
            }}
          >
            <span className="relative z-10 flex items-center justify-center px-2 font-light text-xs">
              npm install willphan
            </span>
          </motion.button>
        </div>
      </div>

      {/* Text box below the grid */}
      <div className="absolute right-0 bottom-0 left-0 w-full border-[#333333] border-t-[0.75px] bg-[#0A0A0A] p-6">
        <h3 className="px-1 pt-1 font-normal text-[#FFFFFF] text-xl">
          Gradient Tracing
        </h3>
        <p className="mt-1 px-1 pb-1 font-light text-[#888888] text-sm">
          Animated SVG paths with flowing gradients that create a visual
          connection between elements.
        </p>
      </div>
    </div>
  );
}
