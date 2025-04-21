import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageFile,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  maxWidth = 250,
  maxHeight = 250
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result as string);
      setIsLoading(false);
    });
    reader.readAsDataURL(imageFile);

    return () => {
      if (imgSrc) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imageFile]);

  useEffect(() => {
    if (imgRef.current && !crop) {
      const { width, height } = imgRef.current;
      const cropWidth = Math.min(width, height) * 0.9;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: (cropWidth / width) * 100,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
    }
  }, [imgSrc, aspectRatio, crop]);

  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Set canvas size to be larger for better quality
      const size = 256; // Increased size for better quality
      canvas.width = size;
      canvas.height = size;

      // Enable image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
      ctx.clip();

      // Draw the image with proper scaling
      const sourceX = crop.x * scaleX;
      const sourceY = crop.y * scaleY;
      const sourceWidth = crop.width * scaleX;
      const sourceHeight = crop.height * scaleY;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        size,
        size
      );

      // Restore context
      ctx.restore();
    }
  }, [completedCrop]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidth = Math.min(width, height) * 0.9;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: (cropWidth / width) * 100,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleCropComplete = async () => {
    if (!previewCanvasRef.current || !imgRef.current || !completedCrop) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });
      const image = imgRef.current;

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Set to larger size for better quality
      const size = Math.max(image.naturalWidth, image.naturalHeight, 1024);
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = size;
      canvas.height = size;

      // Enable image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
      ctx.clip();

      // Calculate source dimensions
      const sourceX = completedCrop.x * scaleX;
      const sourceY = completedCrop.y * scaleY;
      const sourceWidth = completedCrop.width * scaleX;
      const sourceHeight = completedCrop.height * scaleY;

      // Draw image with high quality
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        size,
        size
      );

      // Restore context
      ctx.restore();

      // Convert to blob with high quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Failed to create blob');
          }
          onCropComplete(blob);
        },
        'image/jpeg',
        1.0 // Maximum quality
      );
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-300">
      <div className="w-full h-full flex flex-col bg-white md:m-8 md:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Crop Profile Photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-neutral-200 rounded-full transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Crop Area */}
          <div className="flex-1 flex items-center justify-center p-4 bg-neutral-900 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-green border-t-transparent"></div>
              </div>
            ) : (
              <div className="relative max-w-full max-h-full flex items-center justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  circularCrop
                  className="max-w-full max-h-full"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop me"
                    onLoad={onImageLoad}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(100vh - 12rem)',
                      objectFit: 'contain',
                      margin: 'auto',
                      imageRendering: 'crisp-edges'
                    }}
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* Preview & Controls */}
          <div className="w-full md:w-72 flex flex-col bg-white border-t md:border-t-0 md:border-l border-neutral-200">
            <div className="p-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">Preview</p>
              <div className="bg-neutral-100 rounded-lg p-4 flex items-center justify-center">
                <canvas
                  ref={previewCanvasRef}
                  className="rounded-full w-32 h-32 shadow-sm"
                  style={{
                    display: completedCrop ? 'block' : 'none',
                    imageRendering: 'crisp-edges'
                  }}
                />
                {!completedCrop && (
                  <div className="text-neutral-400 text-sm text-center">
                    Adjust crop to see preview
                  </div>
                )}
              </div>
              {completedCrop && (
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  Drag to adjust • Scroll to zoom
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto p-4 bg-neutral-50 border-t border-neutral-200">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCropComplete}
                  disabled={!completedCrop || isProcessing}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out bg-primary-green text-primary-black hover:bg-[#9ef300] hover:text-primary-white disabled:bg-neutral-200 disabled:text-neutral-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-black border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Apply Changes'
                  )}
                </button>
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out bg-white text-neutral-600 hover:text-neutral-800 border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 