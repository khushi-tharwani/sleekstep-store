
-- Create a new cart table to store cart items
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security policies
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own cart items
CREATE POLICY "Users can view their own cart items" 
  ON public.carts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own cart items
CREATE POLICY "Users can insert their own cart items" 
  ON public.carts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own cart items
CREATE POLICY "Users can update their own cart items" 
  ON public.carts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own cart items
CREATE POLICY "Users can delete their own cart items" 
  ON public.carts 
  FOR DELETE 
  USING (auth.uid() = user_id);
