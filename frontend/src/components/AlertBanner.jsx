import { AnimatePresence, motion } from 'framer-motion';

const tones = {
  error: 'border-red-500 bg-red-50 text-red-700',
  success: 'border-emerald-500 bg-emerald-50 text-emerald-700',
};

function AlertBanner({ tone = 'error', message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            role="alert"
            className={`rounded-lg border-l-4 px-4 py-3 text-sm font-medium leading-snug break-words ${tones[tone]}`}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AlertBanner;
