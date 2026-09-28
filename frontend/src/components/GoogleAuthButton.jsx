import { useLayoutEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from '../i18n/useTranslation.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CALLBACK_URL = `${API_URL}/auth/google/callback`;

const GOOGLE_LOCALES = { zh: 'zh-CN', tl: 'fil' };

function GoogleAuthButton({ onError }) {
  const { t, language } = useTranslation();
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(null);

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const measured = node.getBoundingClientRect().width;
    setWidth(Math.max(220, Math.min(320, Math.floor(measured || 300))));
  }, []);

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      {width && (
        <GoogleLogin
          key={language}
          onSuccess={() => {}}
          onError={() => onError(t('auth.googleFailed'))}
          useOneTap={false}
          ux_mode="redirect"
          login_uri={CALLBACK_URL}
          width={width}
          text="continue_with"
          shape="rectangular"
          locale={GOOGLE_LOCALES[language] || language}
        />
      )}
    </div>
  );
}

export default GoogleAuthButton;
