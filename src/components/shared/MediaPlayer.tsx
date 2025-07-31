import React from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';

interface MediaPlayerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, isOpen, onClose, title = 'Media Player' }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Parse URL to determine media type
  const getMediaType = (url: string) => {
    if (!url) return 'unknown';
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (lowerUrl.includes('vimeo.com')) {
      return 'vimeo';
    }
    
    if (lowerUrl.includes('matterport.com')) {
      return 'matterport';
    }
    
    if (lowerUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
      return 'video';
    }
    
    return 'iframe';
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/i)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  };

  const getMatterportEmbedUrl = (url: string) => {
    // Matterport URLs are already embeddable
    return url;
  };

  const mediaType = getMediaType(url);
  const embedUrl = mediaType === 'youtube' ? getYouTubeEmbedUrl(url) :
                   mediaType === 'vimeo' ? getVimeoEmbedUrl(url) :
                   mediaType === 'matterport' ? getMatterportEmbedUrl(url) : null;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const renderMediaContent = () => {
    switch (mediaType) {
      case 'youtube':
        return embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Invalid YouTube URL</p>
              <p className="text-sm text-gray-300">Please check the URL format</p>
            </div>
          </div>
        );

      case 'vimeo':
        return embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Invalid Vimeo URL</p>
              <p className="text-sm text-gray-300">Please check the URL format</p>
            </div>
          </div>
        );

      case 'matterport':
        return (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-4">Matterport Virtual Tour</p>
              <p className="text-sm text-gray-300 mb-4">
                Matterport tours cannot be embedded due to security restrictions.
              </p>
              <Button
                onClick={() => window.open(url, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Open Virtual Tour in New Tab
              </Button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedMetadata={() => setIsPlaying(false)}
            >
              <source src={url} type="video/mp4" />
              <source src={url} type="video/webm" />
              <source src={url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
            
            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMuteToggle}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'iframe':
      default:
        return (
          <div className="w-full h-full">
            <iframe
              src={url}
              title={title}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
              onError={() => {
                // If iframe fails to load, show fallback
                console.log('Iframe failed to load, showing fallback');
              }}
            />
            {/* Fallback for blocked iframes */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
              <div className="text-center text-white">
                <p className="text-lg font-semibold mb-4">Content Blocked</p>
                <p className="text-sm text-gray-300 mb-4">
                  This content cannot be embedded due to security restrictions.
                </p>
                <Button
                  onClick={() => window.open(url, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{title}</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Media Content */}
        <div className="w-full h-full">
          {renderMediaContent()}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer; 