import React from "react";
import { motion } from "framer-motion";

const CircularLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        aria-label="Loading"
        role="status"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default CircularLoader;
