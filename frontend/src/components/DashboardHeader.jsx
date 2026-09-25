import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';

function DashboardHeader() {
  const { user } = useAuth();
  const avatarSrc = resolveAvatarUrl(user?.avatarUrl);

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-2 text-ink">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-lg font-semibold" style={{ fontFamily: "'Sora', 'Inter', sans-serif" }}>
          Vaultrix
        </span>
      </div>

      <Link
        to="/settings"
        className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition hover:bg-surface"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium text-white">
            {initialsFromName(user?.name)}
          </span>
        )}
        <span className="text-sm font-medium text-ink">{user?.name}</span>
      </Link>
    </header>
  );
}

export default DashboardHeader;
