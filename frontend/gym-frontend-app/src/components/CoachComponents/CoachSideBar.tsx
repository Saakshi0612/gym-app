import React from "react";
import pdfIconPath from "../../assets/PDF.svg";
import { CoachProps } from "../../types/components/coach.types";
import Button from "../common/ButtonComponent";

const CoachSidebar: React.FC<CoachProps> = ({
  name_of_coach,
  about,
  rating,
  title,
  specializations,
  certificates,
  profileImage,
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white p-0">
      {/* Profile Image - Updated for better image display */}
      <div className="w-full h-64 relative">
        <img
          src={profileImage}
          alt={`${name_of_coach} - Trainer`}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Coach Info */}
        <div className="mb-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">{name_of_coach}</h2>
            <div className="flex items-center">
              <span className="text-gray-700 mr-1">{rating}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>

        {/* About Section */}
        <div className="mb-5">
          <h3 className="font-medium text-sm text-gray-800 mb-2">
            About coach
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{about}</p>
        </div>

        {/* Specialization */}
        <div className="mb-5">
          <h3 className="font-medium text-sm text-gray-800 mb-2">
            Specialization
          </h3>
          <div className="flex flex-wrap gap-2">
            {specializations?.map((spec, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-gray-800 mb-2">
            Certificates
          </h3>
          <div className="space-y-2">
            {certificates?.map((cert, index) => (
              <div key={index} className="flex items-center">
                <img src={pdfIconPath} alt="PDF" className="h-5 w-5 mr-2" />
                <a
                  href={cert.file}
                  className="text-sm text-gray-700 underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cert.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth={true}
            className="bg-primary-green hover:bg-green-600 text-black py-2.5 px-4 text-sm"
          >
            Book Workout
          </Button>
          <Button
            variant="secondary"
            fullWidth={true}
            className="bg-white hover:bg-gray-100 text-gray-800 py-2.5 px-4 border border-gray-300 text-sm"
          >
            Repeat Previous Workout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachSidebar;