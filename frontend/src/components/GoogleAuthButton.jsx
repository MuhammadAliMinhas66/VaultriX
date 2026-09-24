import { GoogleLogin } from '@react-oauth/google';

function GoogleAuthButton({ onSuccess, onError }) {
  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => onSuccess(credentialResponse.credential)}
        onError={() => onError('Google sign-in was cancelled or failed. Please try again.')}
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}

export default GoogleAuthButton;
