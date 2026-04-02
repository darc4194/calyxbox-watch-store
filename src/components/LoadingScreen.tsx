import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        {/* Animated Loader */}
        <div className="flex space-x-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 bg-brand rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
