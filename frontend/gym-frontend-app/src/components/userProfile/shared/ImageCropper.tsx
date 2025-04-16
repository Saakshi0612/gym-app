import React, { useState, useRef, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

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
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
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
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(croppedImageBlob);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
        <h3 className="text-lg font-semibold mb-4">Crop Your Profile Picture</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click and drag to select the portion of the image you want to use as your profile picture.
        </p>
        <div className="max-h-[60vh] overflow-auto mb-4 flex justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-w-full"
                minWidth={50}
                minHeight={50}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop me"
                  onLoad={onImageLoad}
                  className="max-w-full"
                  style={{ maxHeight: '60vh' }}
                />
              </ReactCrop>
            )
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            disabled={!completedCrop}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 