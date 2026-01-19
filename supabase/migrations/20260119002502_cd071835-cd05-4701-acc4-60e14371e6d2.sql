-- Create storage bucket for OG images
INSERT INTO storage.buckets (id, name, public)
VALUES ('og-images', 'og-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to OG images
CREATE POLICY "Public can view OG images"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');

-- Allow service role to upload OG images (for edge functions)
CREATE POLICY "Service role can upload OG images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'og-images');