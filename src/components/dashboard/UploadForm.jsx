import React, { useState, useEffect } from 'react';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import UploadButton from '../UploadButton';
import ProgressBar from '../ProgressBar';
import RegenerateButton from '../RegenerateButton';
import AIBadge from '../AIBadge';
import { X, Wand2 } from 'lucide-react';
import { generateImageMetadata, regenerateField } from '../../lib/aiService';

export const UploadForm = ({ imageData, onCancel, onUpload }) => {
  const [formData, setFormData] = useState({
    imageName: imageData?.name || '',
    description: '',
    category: '',
    hashtags: ''
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiLoadingField, setAiLoadingField] = useState(null);
  const [aiGeneratedFields, setAiGeneratedFields] = useState({
    imageName: false,
    description: false,
    category: false,
    hashtags: false
  });
  const [editedFields, setEditedFields] = useState({
    imageName: false,
    description: false,
    category: false,
    hashtags: false
  });

  const categories = [
    'Sports',
    'Luxury',
    'Classic',
    'Modern',
    'Electric',
    'SUV',
    'Sedan',
    'Truck',
    'Other'
  ];

  // Auto-generate metadata when image is selected
  useEffect(() => {
    if (imageData && imageData.file && !formData.description) {
      generateMetadata();
    }
  }, [imageData]);

  // Generate metadata using AI
  const generateMetadata = async () => {
    if (!imageData?.file) {
      alert('No image selected');
      return;
    }

    setIsGenerating(true);
    const result = await generateImageMetadata(imageData.file);

    if (result.success) {
      setFormData(prev => ({
        ...prev,
        imageName: result.data.imageName,
        description: result.data.description,
        category: result.data.category,
        hashtags: result.data.hashtags
      }));

      setAiGeneratedFields({
        imageName: true,
        description: true,
        category: true,
        hashtags: true
      });

      setEditedFields({
        imageName: false,
        description: false,
        category: false,
        hashtags: false
      });
    } else {
      alert(`AI Generation Failed: ${result.error}`);
    }

    setIsGenerating(false);
  };

  // Regenerate specific field
  const handleRegenerateField = async (fieldType) => {
    if (!imageData?.file) return;

    setAiLoadingField(fieldType);
    const result = await regenerateField(imageData.file, fieldType);

    if (result.success) {
      setFormData(prev => ({
        ...prev,
        [fieldType]: result.data
      }));

      setAiGeneratedFields(prev => ({
        ...prev,
        [fieldType]: true
      }));

      setEditedFields(prev => ({
        ...prev,
        [fieldType]: false
      }));
    } else {
      alert(`Failed to regenerate: ${result.error}`);
    }

    setAiLoadingField(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Mark field as edited
    setEditedFields(prev => ({
      ...prev,
      [name]: true
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.imageName.trim()) {
      newErrors.imageName = 'Image name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUploadProgress(100);
      clearInterval(interval);



      setTimeout(() => {
        if (onUpload) onUpload();
        setIsUploading(false);
        setUploadProgress(0);
        setFormData({ imageName: '', description: '', category: '', hashtags: '' });
        setAiGeneratedFields({
          imageName: false,
          description: false,
          category: false,
          hashtags: false
        });
      }, 500);
    } catch (error) {
      setErrors({ form: 'Upload failed, please try again' });
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#E8EAED]">
          Upload Image Details
        </h3>
        {!isUploading && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-[#8A8D93]"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Image Preview */}
      {imageData && (
        <div className="mb-6">
          <img
            src={imageData.preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-[#00D9FF]"
          />
          <p className="text-sm mt-2 text-[#8A8D93]">
            {imageData.file.name}
          </p>
        </div>
      )}

      {/* AI Generation Button */}
      {!isGenerating && (Object.values(aiGeneratedFields).some(v => !v) || !formData.description) && (
        <button
          onClick={generateMetadata}
          disabled={isGenerating}
          className="mb-6 w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-[#00D9FF]/20 text-[#00D9FF] disabled:cursor-not-allowed"
        >
          <Wand2 size={18} />
          {isGenerating ? 'Generating with AI...' : 'Generate with AI'}
        </button>
      )}

      {/* Error Message */}
      {errors.form && (
        <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
          {errors.form}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Name */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <FormInput
              label="Image Name"
              name="imageName"
              value={formData.imageName}
              onChange={handleChange}
              placeholder="Enter image title"
              error={errors.imageName}
              required
            />
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <AIBadge isAIGenerated={aiGeneratedFields.imageName && !editedFields.imageName} />
              <RegenerateButton
                onClick={() => handleRegenerateField('imageName')}
                isLoading={aiLoadingField === 'imageName'}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add detailed description..."
              error={errors.description}
              required
              as="textarea"
              className="min-h-[120px] resize-none"
            />
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <AIBadge isAIGenerated={aiGeneratedFields.description && !editedFields.description} />
              <RegenerateButton
                onClick={() => handleRegenerateField('description')}
                isLoading={aiLoadingField === 'description'}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories}
              placeholder="Select a category"
              error={errors.category}
              required
            />
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <AIBadge isAIGenerated={aiGeneratedFields.category && !editedFields.category} />
              <RegenerateButton
                onClick={() => handleRegenerateField('category')}
                isLoading={aiLoadingField === 'category'}
              />
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <FormInput
              label="Hashtags"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleChange}
              placeholder="Enter hashtags separated by commas"
              helperText="Separate tags with commas (e.g., tag1, tag2, tag3)"
            />
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <AIBadge isAIGenerated={aiGeneratedFields.hashtags && !editedFields.hashtags} />
              <RegenerateButton
                onClick={() => handleRegenerateField('hashtags')}
                isLoading={aiLoadingField === 'hashtags'}
              />
            </div>
          </div>
        </div>

        {/* Upload Button & Progress Bar */}
        <div>
          <UploadButton
            text="Upload Image"
            isLoading={isUploading}
            disabled={!formData.imageName || !formData.description || !formData.category}
            onClick={handleSubmit}
          />

          {isUploading && <ProgressBar progress={uploadProgress} />}
        </div>
      </form>
    </div>
  );
}