import { useNavigate } from 'react-router';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useUser } from '../contexts/UserContext';

const GoogleOneTapProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user, login } = useUser();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/auth/google/callback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          user_type: 'volunteer'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google One Tap error:', err);
      alert('Login failed: ' + err.message);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error('Google One Tap login failed:', error);
      alert('Google login failed. Please try again.');
    },
    disabled: !!user,
    auto_select: true,
    use_fedcm_for_prompt: true,
    containerProps:{ allow: "identity-credentials-get" },
    cancel_on_tap_outside: false
  });

  return children;
};

export default GoogleOneTapProvider;
