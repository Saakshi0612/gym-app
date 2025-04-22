import React, { useRef, useState, useEffect } from "react";
import { CertificateUploadProps } from "../../types/components/UserProfileSettings.types";
import { Download, Trash2, FileText } from "lucide-react";

const MAX_SIZE_MB = 5;
const MAX_FILES = 5;

const CertificateUpload: React.FC<CertificateUploadProps> = ({
  certificates,
  onDrop,
  onRemove,
  onDownload,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploadingIndex !== null) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingIndex(null);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [uploadingIndex]);

  const handleFileDrop = (files: FileList | null) => {
    if (!files) return;

    const currentCount = certificates.length;
    const incoming = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf" &&
        file.size <= MAX_SIZE_MB * 1024 * 1024
    );

    const availableSlots = MAX_FILES - currentCount;
    const finalFiles = incoming.slice(0, availableSlots);

    if (finalFiles.length > 0) {
      setUploadingIndex(certificates.length);
      onDrop(finalFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileDrop(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <h3 className="text-body font-semibold text-[var(--color-neutral-800)]">
        Add your certificates
      </h3>

      {/* Drag & Drop Area */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border border-dashed border-[var(--color-neutral-300)] rounded-md p-6 text-center"
      >
        <p className="text-caption font-semibold text-[var(--color-neutral-700)]">
          Drag & drop file here
        </p>
        <p className="text-caption-2 text-[var(--color-neutral-500)] my-1">or</p>
        <label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            hidden
            onChange={(e) => handleFileDrop(e.target.files)}
          />
          <div className="inline-block px-4 py-2 border border-[var(--color-neutral-400)] rounded-md text-caption text-[var(--color-neutral-800)] cursor-pointer hover:bg-[var(--color-neutral-100)]">
            Select File
          </div>
        </label>
      </div>

      {/* Uploaded Certificates */}
      <div className="divide-y divide-[var(--color-neutral-200)]">
        {certificates.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-2 py-3 gap-3"
          >
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <FileText size={20} className="text-[var(--color-semantic-red)] min-w-[20px]" />
              <p className="text-caption text-[var(--color-neutral-800)] truncate w-full">
                {file.name}
                <span className="text-caption-2 text-[var(--color-neutral-500)] ml-1">
                  ({file.size})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {uploadingIndex === index ? (
                <div className="w-20 h-1 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-semantic-green)] h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onDownload(file.url)}
                    title="Download"
                  >
                    <Download
                      size={16}
                      className="text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)]"
                    />
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    title="Remove"
                  >
                    <Trash2
                      size={16}
                      className="text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-900)]"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateUpload;
