-- Add media support to testimonials
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS media_urls text[] DEFAULT '{}';

-- Create storage bucket for testimonial photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-media', 'testimonial-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload photos
CREATE POLICY "Anyone can upload testimonial media"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'testimonial-media');

-- Allow public read
CREATE POLICY "Public read testimonial media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'testimonial-media');
