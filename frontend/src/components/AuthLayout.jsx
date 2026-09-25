import { motion } from 'framer-motion';
import AuthVisual from './AuthVisual.jsx';
import Logo from './Logo.jsx';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="hidden flex-1 flex-col bg-ink px-12 pb-10 pt-10 text-white lg:flex xl:px-16">
        <Logo size="lg" dark />

        <AuthVisual />

        <p className="border-t border-white/10 pt-6 text-sm font-semibold text-white/85">
          &copy; {new Date().getFullYear()} VaultriX. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
