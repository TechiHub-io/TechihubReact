import { useState, useEffect } from 'react';

interface UseProfilePhotoResult {
  photoUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useProfilePhoto = (initialPhotoUrl: string): UseProfilePhotoResult => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        if (!initialPhotoUrl) {
          setIsLoading(false);
          return;
        }

        // Extract the relevant part from the initial URL
        const urlParts = initialPhotoUrl.split('/profilepictures/');
        if (urlParts.length < 2) {
          throw new Error('Invalid photo URL format');
        }
        const photoPath = urlParts[1];

        // Get the URL from your API
        const response = await fetch(
          `https://techihubjobsproject.azurewebsites.net/api/files/get-profile-photo-url/${encodeURIComponent(photoPath)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch photo URL');
        }

        const data = await response.json();
        
        // Use the URL directly since it's a signed URL from Azure
        setPhotoUrl(data.data['File Url is ']);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile photo');
        setIsLoading(false);
      }
    };

    fetchProfilePhoto();
  }, [initialPhotoUrl]);

  return { photoUrl, isLoading, error };
};