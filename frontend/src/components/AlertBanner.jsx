import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation.js';

const toneStyles = {
  error: { icon: AlertTriangle, iconBg: 'bg-red-500' },
  success: { icon: CheckCircle2, iconBg: 'bg-emerald-500' },
};

function AlertBanner({ tone = 'error', message, onDismiss }) {
  const { t } = useTranslation();
  const config = toneStyles[tone] || toneStyles.error;
  const Icon = config.icon;

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
            className="flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3 shadow-lg shadow-black/5"
          >
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
              <Icon className="h-4 w-4 text-white" strokeWidth={2.25} />
            </span>
            <p className="flex-1 text-sm font-semibold leading-snug text-ink">{message}</p>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label={t('common.dismiss')}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AlertBanner;
