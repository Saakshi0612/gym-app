import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageFile,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageFile) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result as string);
        setIsLoading(false);
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Use a smaller initial crop size on mobile
    const cropWidth = windowWidth < 640 ? 90 : 80;
    
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: cropWidth,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  // Calculate max height based on screen size
  const getMaxHeight = useCallback(() => {
    if (windowWidth < 380) return 250;
    if (windowWidth < 640) return 300;
    if (windowWidth < 768) return 320;
    return 400;
  }, [windowWidth]);

  // Calculate preview size based on screen size
  const getPreviewSize = useCallback(() => {
    if (windowWidth < 380) return 100;
    if (windowWidth < 640) return 120;
    return 150;
  }, [windowWidth]);

  const updatePreview = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Set preview canvas size based on screen size
    const size = getPreviewSize();
    canvas.width = size;
    canvas.height = size;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      size,
      size
    );
  }, [completedCrop, getPreviewSize]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(
      crop.width / 2,
      crop.height / 2,
      Math.min(crop.width, crop.height) / 2,
      0,
      2 * Math.PI
    );
    ctx.clip();

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      try {
        setIsProcessing(true);
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(croppedImageBlob);
      } catch (error) {
        console.error('Error cropping image:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  // Get dynamic preview size
  const previewSize = getPreviewSize();
  const maxHeight = getMaxHeight();

  return (
    <div className="fixed inset-0 bg-primary-white/30 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-primary-white rounded-xl p-3 sm:p-4 w-full max-w-xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 my-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">Crop Your Profile Picture</h3>
        <p className="text-xs sm:text-sm text-neutral-600 mb-3">
          Click and drag to select the portion of the image you want to use as your profile picture.
        </p>
        
        {/* Main content area - switch to column on mobile */}
        <div className="flex flex-col gap-4">
          {/* Crop area */}
          <div className="w-full overflow-hidden bg-neutral-200 rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 sm:h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-green"></div>
              </div>
            ) : (
              imgSrc && (
                <div className="flex items-center justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={handleCropChange}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    className="max-w-full touch-manipulation"
                    minWidth={50}
                    minHeight={50}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Crop me"
                      className="max-w-full object-contain"
                      style={{ maxHeight: `${maxHeight}px` }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
              )
            )}
          </div>
          
          {/* Preview Section - centered on smaller screens */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs sm:text-sm font-medium text-neutral-700 mb-2">Preview</h4>
            <div 
              className="rounded-full bg-neutral-200 overflow-hidden shadow-inner border border-neutral-200"
              style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
            >
              <canvas
                ref={previewCanvasRef}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Button group */}
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-3 sm:px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropComplete}
            disabled={!completedCrop || isProcessing}
            className="px-3 sm:px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-primary-black rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-r-transparent"></div>
                Processing...
              </span>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 