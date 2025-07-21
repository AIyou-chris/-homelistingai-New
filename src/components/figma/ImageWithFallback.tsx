import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const onError = () => {
    if (!error) {
      setError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  if (!imgSrc && !fallbackSrc) {
    return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
        </div>
    );
  }

  return (
    <img
      src={imgSrc || fallbackSrc}
      onError={onError}
      {...props}
    />
  );
}; 