-- Create a separate table for AI metadata (recommended approach)
CREATE TABLE image_ai_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  ai_generated BOOLEAN DEFAULT true,
  ai_model TEXT DEFAULT 'gemini-1.5-flash',
  confidence FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Additional metadata fields
  generation_type TEXT, -- 'initial', 'regenerate'
  field_generated TEXT[], -- Array of fields that were AI-generated
  processing_time FLOAT, -- Time taken for AI processing in seconds
  model_version TEXT -- Specific version of the AI model used
);

-- Create indexes for better query performance
CREATE INDEX idx_image_ai_metadata_image_id ON image_ai_metadata(image_id);
CREATE INDEX idx_image_ai_metadata_ai_model ON image_ai_metadata(ai_model);
CREATE INDEX idx_image_ai_metadata_created_at ON image_ai_metadata(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE image_ai_metadata ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view AI metadata for their own images
CREATE POLICY "Users can view their own images' AI metadata" ON image_ai_metadata
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM images
      WHERE images.id = image_ai_metadata.image_id
      AND images.user_id = auth.uid()
    )
  );

-- Policy to allow users to insert AI metadata for their own images
CREATE POLICY "Users can insert AI metadata for their own images" ON image_ai_metadata
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM images
      WHERE images.id = image_ai_metadata.image_id
      AND images.user_id = auth.uid()
    )
  );

-- Create view for easy querying of images with their AI metadata
CREATE VIEW v_images_with_ai_metadata AS
SELECT 
  i.*,
  aim.ai_generated,
  aim.ai_model,
  aim.confidence,
  aim.generation_type,
  aim.field_generated,
  aim.processing_time,
  aim.model_version
FROM 
  images i
LEFT JOIN 
  image_ai_metadata aim ON i.id = aim.image_id;

-- Grant appropriate permissions
GRANT SELECT ON v_images_with_ai_metadata TO authenticated;
GRANT ALL ON image_ai_metadata TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE image_ai_metadata_id_seq TO authenticated;