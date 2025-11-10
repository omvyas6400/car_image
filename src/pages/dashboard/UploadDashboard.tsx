import { useState } from 'react';
import DragDropZone from '../../components/dashboard/DragDropZone';
import { UploadForm } from '../../components/dashboard/UploadForm';
import { UserProfile } from '../../components/dashboard/UserProfile';
import { UploadImageData } from '../../types';

interface UploadDashboardProps {
  onUploadSuccess: () => void;
}

export default function UploadDashboard({ onUploadSuccess }: UploadDashboardProps) {
  const [selectedImage, setSelectedImage] = useState<UploadImageData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageSelected = (imageData: UploadImageData) => {

    setSelectedImage(imageData);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setShowForm(false);
  };

  const handleUploadComplete = () => {
    setSelectedImage(null);
    setShowForm(false);
    onUploadSuccess();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#121820' }}>
      {/* Header spacing */}
      <div className="h-[72px]"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#E8EAED', fontFamily: 'Space Grotesk' }}>
              📸 Upload Car Images
            </h2>

            {!showForm ? (
              <DragDropZone onImageSelected={handleImageSelected} />
            ) : (
              <UploadForm 
                imageData={selectedImage}
                onCancel={handleCancel}
                onUpload={handleUploadComplete}
              />
            )}
          </div>

          {/* Sidebar - User Profile */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}