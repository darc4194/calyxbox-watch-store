import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 glass rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-brand p-4 text-white">
              <h4 className="font-bold">Chat with us</h4>
              <p className="text-xs opacity-80">We typically reply in minutes</p>
            </div>
            <div className="h-64 p-4 bg-white/50 overflow-y-auto flex flex-col space-y-4">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-sm self-start max-w-[80%]">
                Hi there! How can we help you today?
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 text-sm bg-gray-50 border-none rounded-full px-4 py-2 focus:ring-1 focus:ring-brand"
              />
              <button className="bg-brand text-white p-2 rounded-full">
                <MessageCircle size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-xl shadow-brand/30"
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
}
