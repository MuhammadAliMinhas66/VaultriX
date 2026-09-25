import { motion } from 'framer-motion';

function PageLoader({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-ink" />
      {label && <p className="text-sm text-muted">{label}</p>}
    </motion.div>
  );
}

export default PageLoader;
