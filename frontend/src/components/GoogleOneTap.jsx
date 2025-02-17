import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../contexts/UserContext';

const GoogleOneTap = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    // Only initialize if user is not logged in
    if (!localStorage.getItem('access_token')) {
      window.google?.accounts.id.initialize({
        client_id: "1032409090840-gus43isikcnuq4n365l7gocm53h725dl.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: true,
        cancel_on_tap_outside: false
      });
      window.google?.accounts.id.prompt();
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch('/api/auth/google/callback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
          user_type: 'volunteer'
        }),
      });
      
      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google One Tap error:', err);
    }
  };

  return null; // This component doesn't render anything
};

export default GoogleOneTap;
