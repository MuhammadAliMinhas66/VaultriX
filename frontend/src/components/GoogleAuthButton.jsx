import { useLayoutEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from '../i18n/useTranslation.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CALLBACK_URL = `${API_URL}/auth/google/callback`;

function GoogleAuthButton({ onError }) {
  const { t } = useTranslation();
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(320);

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;

    const update = () => {
      const measured = node.getBoundingClientRect().width;
      if (measured) setWidth(Math.max(220, Math.min(320, Math.floor(measured))));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={() => {}}
        onError={() => onError(t('auth.googleFailed'))}
        useOneTap={false}
        ux_mode="redirect"
        login_uri={CALLBACK_URL}
        width={width}
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}

export default GoogleAuthButton;
