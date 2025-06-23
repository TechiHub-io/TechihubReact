// src/hooks/useProfileStrength.js
import { useStore } from '@/hooks/useZustandStore';

export function useProfileStrength() {
  const { profile } = useStore(state => ({
    profile: state.profile
  }));

  return {
    profileStrength: profile?.profile_strength || 0
  };
}