import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import Logo from './Logo.jsx';

function DashboardHeader() {
  const { user } = useAuth();
  const avatarSrc = resolveAvatarUrl(user?.avatarUrl);

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Logo size="sm" />

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
