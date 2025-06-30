"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function ModelCards() {
  // State to track whether we're showing the expanded or collapsed view
  const [active, setActive] = useState(false);

  // Spring physics configuration for smooth, natural-feeling transitions
  // - stiffness: controls the "springiness" (higher = more rigid)
  // - damping: controls oscillation (higher = less bounce)
  // - mass: simulates weight (higher = more momentum)
  const transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  };

  return (
    <div className="model-cards relative flex w-96 items-center justify-center min-h-[384px]">
      {/* 
        AnimatePresence handles components entering/exiting the DOM
        mode="wait" ensures the exiting component finishes animating before the entering component starts
      */}
      <AnimatePresence mode="wait">
        {active ? (
          <>
            {/* 
              Overlay backdrop that fades in/out
              - Fixed positioning covers the entire screen
              - z-10 places it above regular content but below the card
              - onClick handler allows clicking outside to close
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-10"
              onClick={() => setActive(false)}
            />
            {/* Container for the expanded card with higher z-index */}
            <div className="card-content-container open pointer-events-auto z-20">
              {/* 
                Main card container that morphs between states
                - layoutId="card-container" connects this element with its counterpart in the collapsed state
                - Framer Motion tracks this ID and smoothly animates between the two states
              */}
              <motion.div
                className="relative rounded-2xl bg-[#02C389]"
                layoutId="card-container"
                transition={transition}
                initial={{ filter: "blur(10px)" }}
                animate={{ filter: "blur(0px)" }}
                exit={{ filter: "blur(10px)" }}
                style={{
                  boxShadow: "0 0 0 2px #00D998, 0 0 0 2.5px #565656", // Adj
                }}
              >
                {/* 
                  Content area that changes size between states
                  - layoutId="card-content" ensures this element morphs with its counterpart
                  - The h-72 w-72 dimensions are larger than the collapsed state
                */}
                <motion.div className="flex flex-col overflow-hidden p-6 text-white">
                  {/* 
                    Text element that persists between states
                    - layoutId="card-title" ensures the text smoothly transitions
                  */}
                  <div className="flex items-start">
                    <motion.div layoutId="card-logo" className="mb-1">
                      {/* Use external SVG file */}
                      <img
                        src="/openai-one-model-cards.svg"
                        alt="OpenAI Logo"
                        className="mr-2 h-10 w-10"
                      />
                    </motion.div>
                    <div className="flex flex-col items-start">
                      <motion.div
                        className="font-medium text-sm text-white"
                        layoutId="card-title"
                        style={{ color: "white" }}
                      >
                        OpenAI
                      </motion.div>
                      <motion.div
                        className="text-sm text-white"
                        layoutId="description-one"
                        style={{ color: "rgba(255, 255, 255, 0.5)" }}
                      >
                        GPT-4o
                      </motion.div>
                    </div>
                  </div>

                  {/* MODEL CONTENTS */}
                  <div className="flex flex-col items-start overflow-y-auto">
                    <motion.div
                      className="mt-4 mb-2 text-sm text-white "
                      style={{
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        color: "white",
                      }}
                    >
                      As smart as GPT-4 Turbo but faster, more efficient, and at
                      half the cost, making it an ideal choice for developers
                      seeking high performance and cost-effectiveness.
                    </motion.div>
                    <motion.div
                      className="mt-3 w-full border-b-[0.5px] pb-3 text-sm"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white",
                        borderBottomColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Input Price
                      </span>
                      <span className="font-medium">$2.500/1M tokens</span>
                    </motion.div>

                    <motion.div
                      className="mt-3 mb-3 w-full border-b-[0.5px] pb-3 text-sm"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white",
                        borderBottomColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Output Price
                      </span>
                      <span className="font-medium">$10.000/1M tokens</span>
                    </motion.div>

                    <motion.div
                      className="w-full text-sm text-white"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Context Window
                      </span>
                      <span className="font-medium">128K tokens</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        ) : (
          // Container for the collapsed card state
          <motion.div
            className="card-content-container z-20"
            onClick={() => setActive(true)}
          >
            {/* 
              Collapsed card container
              - Same layoutId="card-container" connects it to the expanded state
              - Framer Motion handles the morphing animation between states
            */}
            <motion.div
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-[#02C389] px-6 py-3 text-white"
              layoutId="card-container"
              transition={transition}
              style={{
                boxShadow: "0 0 0 2px #00D998, 0 0 0 2.5px #565656", // Adjusted colors and thickness
              }}
            >
              <motion.div
                layoutId="card-logo"
                className="mb-1 rounded-full "
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                {/* Use external SVG file */}
                <img
                  src="/openai-one-model-cards.svg"
                  alt="OpenAI Logo"
                  className="mr-2 h-10 w-10"
                />
              </motion.div>
              <div className="flex flex-col items-start justify-start pr-2 text-white">
                {/* Ensure text elements are stacked vertically */}
                <motion.div className="flex flex-col items-start">
                  <motion.div
                    className="font-medium text-sm"
                    layoutId="card-title"
                    style={{ color: "white" }}
                  >
                    OpenAI
                  </motion.div>
                  <motion.div
                    className="text-sm"
                    layoutId="description-one"
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  >
                    GPT-4o
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
