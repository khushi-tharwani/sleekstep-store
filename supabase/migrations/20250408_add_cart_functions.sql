
-- Function to delete cart items for a user
CREATE OR REPLACE FUNCTION public.delete_cart_items(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.carts
  WHERE user_id = user_id_param;
END;
$$;

-- Function to add a cart item
CREATE OR REPLACE FUNCTION public.add_cart_item(
  user_id_param UUID,
  product_id_param UUID,
  quantity_param INTEGER,
  size_param TEXT,
  color_param TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cart_id UUID;
BEGIN
  INSERT INTO public.carts (
    user_id, 
    product_id, 
    quantity, 
    size, 
    color
  ) 
  VALUES (
    user_id_param,
    product_id_param,
    quantity_param,
    size_param,
    color_param
  )
  RETURNING id INTO cart_id;
  
  RETURN cart_id;
END;
$$;

-- Function to get cart with products
CREATE OR REPLACE FUNCTION public.get_cart_with_products(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  product_id UUID,
  quantity INTEGER,
  size TEXT,
  color TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.user_id, c.product_id, c.quantity, c.size, c.color, c.created_at, c.updated_at
  FROM public.carts c
  WHERE c.user_id = user_id_param;
END;
$$;
