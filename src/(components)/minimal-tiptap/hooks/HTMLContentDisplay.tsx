import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentDisplayProps {
  htmlContent: string;
}

const HTMLContentDisplay: React.FC<HTMLContentDisplayProps>  = ({ htmlContent }) => {
  const sanitizedContent = useMemo(() => {
    // Sanitize the HTML content
    return DOMPurify.sanitize(htmlContent);
  }, [htmlContent]);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HTMLContentDisplay;