import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import AuthVisual from './AuthVisual.jsx';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <div className="hidden flex-1 flex-col justify-between bg-ink px-12 py-10 text-white md:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5" />
          Vaultrix
        </div>

        <AuthVisual />

        <div className="max-w-sm">
          <p className="text-2xl font-medium leading-snug">
            One place for everything you owe, everything owed to you, and everything you earn.
          </p>
          <p className="mt-4 text-sm text-white/60">
            Accounts, bills, rent, loans and committees, tracked correctly, down to the last unit
            of currency.
          </p>
        </div>
        <p className="text-xs text-white/40">Built for people who actually track their money.</p>
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
