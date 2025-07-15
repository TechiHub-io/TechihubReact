// hooks/useGoogleAuth.js (Simplified - let middleware handle everything)
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { useRouter } from 'next/navigation';

export const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { socialLogin, loading } = useStore((state) => ({
    socialLogin: state.socialLogin,
    loading: state.loading,
  }));
  const router = useRouter();

  useEffect(() => {
    // Load Google Identity Services
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  const initializeGoogleAuth = (callback) => {
    if (isGoogleLoaded && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_IDD,
          callback: callback,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
          use_fedcm_for_prompt: false,
        });
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
      }
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      // Call social login - this will set all the necessary cookies
      await socialLogin('google-oauth2', response.credential);
      
      
      // ✅ Let middleware handle the redirect by navigating to home
      // The middleware will see the auth cookies and redirect appropriately
      window.location.href = '/';
      
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const signInWithGoogle = () => {
    if (isGoogleLoaded && window.google) {
      try {
        initializeGoogleAuth(handleGoogleLogin);
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error('Error with Google sign in:', error);
      }
    }
  };

  const renderGoogleButton = (elementId) => {
    if (isGoogleLoaded && window.google) {
      try {
        initializeGoogleAuth(handleGoogleLogin);
        const element = document.getElementById(elementId);
        if (element) {
          window.google.accounts.id.renderButton(element, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rounded',
            logo_alignment: 'left',
          });
        }
      } catch (error) {
        console.error('Error rendering Google button:', error);
      }
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle,
    renderGoogleButton,
    loading,
  };
};