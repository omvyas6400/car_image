import { generateImageMetadata as analyze, regenerateField } from './imageAnalysisService'
import { LuxuryLoader } from './components/common/LuxuryLoader'
import { UploadLoader } from './components/common/UploadLoader'

export interface AIMetadata {
  image_name: string
  description: string
  category: string
  hashtags: string[]
}

// Main function with smart fallback
export async function generateImageMetadata(
  imageFile: File
): Promise<AIMetadata> {
  try {
    console.log('🤖 Generating image metadata...')
    const result = await analyze(imageFile)
    console.log('✅ Metadata generated successfully!')
    return result
  } catch (error) {
    console.error('Error:', error)
    // Ultimate fallback
    return {
      image_name: imageFile.name || 'Car Image',
      description: 'An automobile image',
      category: 'Other',
      hashtags: ['car', 'automobile', 'vehicle'],
    }
  }
}

// Re-export regenerateField
export { regenerateField }

