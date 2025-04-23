import React, { useRef, useState, useEffect } from "react";
import { CertificateUploadProps } from "../../types/components/UserProfileSettings.types";
import { Download, Trash2, FileText, Upload } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (uploadingIndex !== null) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingIndex(null);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
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
      const dataTransfer = new DataTransfer();
      finalFiles.forEach(file => dataTransfer.items.add(file));
      onDrop(dataTransfer.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileDrop(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <h3 className="text-body font-semibold text-neutral-900">
        Add your certificates
      </h3>

      {/* Drag & Drop Area */}
      <motion.div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border border-dashed rounded-md p-6 text-center transition-all duration-300 ${
          isDragging 
            ? "border-primary-green bg-green-50" 
            : "border-neutral-400"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center"
        >
          <Upload size={24} className={`mb-2 ${isDragging ? "text-primary-green" : "text-neutral-500"}`} />
          <p className="text-caption font-semibold text-neutral-700">
            Drag & drop file here
          </p>
          <p className="text-caption-2 text-neutral-500 my-1">or</p>
          <label>
            <input
              type="file"
              multiple
              accept="application/pdf"
              hidden
              onChange={(e) => handleFileDrop(e.target.files)}
            />
            <div className="inline-block px-4 py-2 border border-neutral-400 rounded-md text-caption text-neutral-800 cursor-pointer hover:bg-neutral-200 transition-all duration-200">
              Select File
            </div>
          </label>
        </motion.div>
      </motion.div>

      {/* Uploaded Certificates */}
      <div className="divide-y divide-neutral-200">
        {certificates.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between px-2 py-3 gap-3"
          >
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <FileText size={20} className="text-semantic-red min-w-[20px]" />
              <p className="text-caption text-neutral-800 truncate w-full">
                {file.name}
                <span className="text-caption-2 text-neutral-500 ml-1">
                  ({file.size})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {uploadingIndex === index ? (
                <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden relative">
                  <motion.div
                    className="bg-primary-green h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-white/30 to-transparent"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDownload(file.url)}
                    title="Download"
                  >
                    <Download
                      size={16}
                      className="text-neutral-500 hover:text-neutral-900"
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(index)}
                    title="Remove"
                  >
                    <Trash2
                      size={16}
                      className="text-neutral-500 hover:text-neutral-900"
                    />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CertificateUpload;
