import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import AuthVisual from './AuthVisual.jsx';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="hidden flex-1 flex-col bg-ink px-12 pb-10 pt-10 text-white lg:flex xl:px-16">
        <span
          className="text-6xl font-semibold leading-none tracking-tight xl:text-7xl"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Vaultrix
        </span>

        <AuthVisual />

        <div className="flex items-start gap-3.5 border-t border-white/10 pt-6">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
            <Lock className="h-4 w-4 text-white/80" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-white/90">Encrypted at rest and in transit</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-white/50">
              Only you and the people you invite can see your records.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
