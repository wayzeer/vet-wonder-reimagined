-- Create table for pet advice tracking (rate limiting)
CREATE TABLE public.pet_advice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  advice_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pet_advice ENABLE ROW LEVEL SECURITY;

-- Policies for pet advice
CREATE POLICY "Users can view their own pet advice"
  ON public.pet_advice
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create advice for their pets"
  ON public.pet_advice
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = pet_advice.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

-- Add index for performance
CREATE INDEX idx_pet_advice_pet_id ON public.pet_advice(pet_id);
CREATE INDEX idx_pet_advice_created_at ON public.pet_advice(created_at DESC);

-- Update blog posts with featured images
UPDATE public.blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop'
WHERE slug = 'peligros-procesionaria-para-mascotas';

UPDATE public.blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&h=600&fit=crop'
WHERE slug = 'vacunacion-rabia-madrid';

UPDATE public.blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop'
WHERE slug = 'leishmaniosis-canina';

UPDATE public.blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop'
WHERE slug = 'cuidados-verano-mascotas';

UPDATE public.blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
WHERE slug = 'calendario-desparasitacion';