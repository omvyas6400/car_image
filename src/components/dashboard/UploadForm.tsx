import { useState, useRef } from 'react'
import { Loader2, X, Wand2, AlertCircle, Check } from 'lucide-react'
import { generateImageMetadata, regenerateField } from '../../lib/aiService'
import { uploadImage } from '../../lib/supabaseQueries'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { CAR_CATEGORIES, CarCategory, UploadImageData } from '../../types'
import DragDropZone from './DragDropZone'
import { Button } from '../common/Button'
import { UploadLoader } from '../common/UploadLoader'

interface UploadFormProps {
  imageData: UploadImageData | null
  onCancel: () => void
  onUpload: () => void
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_HASHTAGS = 8
const AUTO_CLEAR_ERROR_DELAY = 5000

export const UploadForm = ({
  imageData,
  onCancel,
  onUpload,
}: UploadFormProps) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const [file, setFile] = useState<File | null>(imageData?.file || null)
  const [preview, setPreview] = useState<string | null>(
    imageData?.preview || null
  )
  const [formData, setFormData] = useState({
    image_name: imageData?.name || '',
    description: '',
    category: '' as CarCategory | '',
    hashtags: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadLoader, setShowUploadLoader] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [regenerating, setRegenerating] = useState<string>('')

  // Auto-clear error after delay
  const setErrorWithAutoClear = (message: string) => {
    setError(message)
    
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setError('')
    }, AUTO_CLEAR_ERROR_DELAY)
  }

  // Validate file before setting
  const validateFile = (selectedFile: File): string | null => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
    }
    
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      return `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
    }
    
    return null
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setError('')
    onCancel()
  }

  const handleRegenerateField = async (
    fieldName: keyof typeof formData
  ) => {
    if (!file) {
      setErrorWithAutoClear('No file selected')
      return
    }

    setRegenerating(fieldName)
    setError('')

    try {
      // Create proper AIMetadata object for regenerateField
      const currentData = {
        image_name: formData.image_name,
        description: formData.description,
        category: formData.category,
        hashtags: formData.hashtags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      }

      const newValue = await regenerateField(file, fieldName, currentData)

      // Handle different field types
      let processedValue = newValue
      if (fieldName === 'hashtags' && Array.isArray(newValue)) {
        processedValue = newValue.slice(0, MAX_HASHTAGS).join(', ')
      } else if (Array.isArray(newValue)) {
        processedValue = newValue.join(', ')
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: processedValue || prev[fieldName],
      }))

      showToast(`${fieldName} regenerated successfully`, 'success')
    } catch (error) {
      console.error(`Failed to regenerate ${fieldName}:`, error)
      setErrorWithAutoClear(`Failed to regenerate ${fieldName}`)
    } finally {
      setRegenerating('')
    }
  }

  const analyzeImageWithAI = async () => {
    if (!file) {
      setErrorWithAutoClear('No file selected')
      return
    }

    setAiLoading(true)
    setError('')

    try {
      const metadata = await generateImageMetadata(file)

      // Ensure hashtags are limited
      const hashtags = Array.isArray(metadata.hashtags)
        ? metadata.hashtags.slice(0, MAX_HASHTAGS).join(', ')
        : metadata.hashtags

      // Update form with AI suggestions, preserving user inputs
      setFormData(prev => ({
        image_name: metadata.image_name || prev.image_name || 'Car Image',
        description: metadata.description || prev.description,
        category:
          (metadata.category as CarCategory) ||
          prev.category ||
          (CAR_CATEGORIES[0] as CarCategory),
        hashtags: hashtags || prev.hashtags,
      }))

      showToast('AI analysis completed successfully', 'success')
    } catch (error) {
      console.error('AI Analysis Error:', error)
      setErrorWithAutoClear('Failed to analyze image with AI. Using fallback...')
    } finally {
      setAiLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    // Validate hashtags count
    if (name === 'hashtags') {
      const tags = value.split(',').filter(tag => tag.trim().length > 0)
      if (tags.length > MAX_HASHTAGS) {
        setErrorWithAutoClear(`Maximum ${MAX_HASHTAGS} hashtags allowed`)
        return
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileSelected = (data: {
    file: File
    preview: string
    name: string
  }) => {
    const validationError = validateFile(data.file)
    
    if (validationError) {
      setErrorWithAutoClear(validationError)
      return
    }

    setFile(data.file)
    setPreview(data.preview)
    setFormData(prev => ({
      ...prev,
      image_name: data.name,
    }))
    setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.image_name.trim()) {
      setErrorWithAutoClear('Please enter an image name')
      return false
    }

    if (formData.image_name.trim().length < 3) {
      setErrorWithAutoClear('Image name must be at least 3 characters')
      return false
    }

    if (!formData.category) {
      setErrorWithAutoClear('Please select a category')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !file) {
      setErrorWithAutoClear('User not authenticated or no file selected')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setShowUploadLoader(true)
    setUploadProgress(0)
    setError('')

    try {
      const hashtags = formData.hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, MAX_HASHTAGS)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 300)

      await uploadImage(user.id, file, {
        image_name: formData.image_name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        setShowUploadLoader(false)
        showToast('🎉 Image uploaded successfully!', 'success')
        setFormData({
          image_name: '',
          description: '',
          category: '',
          hashtags: '',
        })
        setSuccess(true)
        handleRemoveFile()
        onUpload()
      }, 1000)

    } catch (err) {
      setShowUploadLoader(false)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload image'
      setErrorWithAutoClear(errorMessage)
      showToast(errorMessage, 'error')
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <UploadLoader isVisible={showUploadLoader} uploadProgress={uploadProgress} />
      
      <div className="bg-[#1A212B] rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-white">Upload Car Images</h2>
        <Button
          onClick={analyzeImageWithAI}
          disabled={aiLoading || !file}
          className="flex items-center gap-2"
        >
          {aiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          AI Suggestions
        </Button>
      </div>
      <p className="mb-8 text-base text-gray-400">
        Share your collection with the community
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 border border-red-500 rounded-lg bg-red-500/10 animate-shake">
            <p className="flex items-center gap-2 text-xs text-red-500">
              <AlertCircle size={16} />
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="p-3 border border-green-500 rounded-lg bg-green-500/10 animate-fade-in">
            <p className="flex items-center gap-2 text-xs text-green-500">
              <Check size={16} />
              Image uploaded successfully!
            </p>
          </div>
        )}

        {!preview ? (
          <DragDropZone
            onImageSelected={handleFileSelected}
            error={error}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-32 h-32 rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <div>
              <label
                htmlFor="image_name"
                className="block mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase"
              >
                Image Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="image_name"
                  name="image_name"
                  value={formData.image_name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full h-12 px-4 pr-12 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300"
                  placeholder="Enter image title"
                />
                <button
                  type="button"
                  onClick={() => handleRegenerateField('image_name')}
                  disabled={regenerating === 'image_name' || !file || aiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#00D9FF] disabled:opacity-50 disabled:hover:text-gray-400"
                  title="Regenerate image name"
                >
                  {regenerating === 'image_name' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.image_name.length}/100
              </p>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase"
              >
                Category *
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 pr-12 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300 cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {CAR_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRegenerateField('category')}
                  disabled={regenerating === 'category' || !file || aiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#00D9FF] disabled:opacity-50 disabled:hover:text-gray-400"
                  title="Regenerate category"
                >
                  {regenerating === 'category' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase"
              >
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 pr-12 py-3 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300 resize-none"
                  placeholder="Tell us about this car..."
                />
                <button
                  type="button"
                  onClick={() => handleRegenerateField('description')}
                  disabled={regenerating === 'description' || !file || aiLoading}
                  className="absolute right-2 top-4 p-2 text-gray-400 hover:text-[#00D9FF] disabled:opacity-50 disabled:hover:text-gray-400"
                  title="Regenerate description"
                >
                  {regenerating === 'description' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500
              </p>
            </div>

            <div>
              <label
                htmlFor="hashtags"
                className="block mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase"
              >
                Hashtags (max {MAX_HASHTAGS})
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="hashtags"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleChange}
                  className="w-full h-12 px-4 pr-12 bg-[#0F1419] border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.3)] text-white transition-all duration-300"
                  placeholder="ferrari, red, supercar (comma separated)"
                />
                <button
                  type="button"
                  onClick={() => handleRegenerateField('hashtags')}
                  disabled={regenerating === 'hashtags' || !file || aiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#00D9FF] disabled:opacity-50 disabled:hover:text-gray-400"
                  title="Regenerate hashtags"
                >
                  {regenerating === 'hashtags' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.hashtags.split(',').filter(tag => tag.trim().length > 0).length}/{MAX_HASHTAGS}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full h-12 bg-[#FF6B35] text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </button>

            {loading && (
              <div className="space-y-2">
                <div className="w-full h-2 overflow-hidden bg-gray-700 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      uploadProgress === 100 ? 'bg-green-500' : 'bg-[#00D9FF]'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-400">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
    </>
  )
}