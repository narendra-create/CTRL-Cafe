-- ==============================================================================
-- Food Items Seed File
-- Location: supabase/food_seed.sql
-- Source: app/mockdata/foodData.ts
-- ==============================================================================

INSERT INTO public.food_items (
  id,
  name,
  category,
  description,
  image_url,
  is_available,
  price,
  serves,
  created_at
)
VALUES
  (
    '50000000-0000-4000-8000-000000000123',
    'Paneer Chlly',
    'snacks',
    'Paneer cubes fried and then tossed into sauces',
    'https://images.pexels.com/photos/7160695/pexels-photo-7160695.jpeg',
    true,
    123.00,
    1,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000456',
    'Momos',
    'snacks',
    'Steamed dumplings filled with seasoned vegetables and served with spicy chutney',
    'https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg',
    true,
    99.00,
    1,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000789',
    'Chicken Lolypop',
    'snacks',
    'Crispy chicken wings marinated in spices and coated with a flavorful sauce',
    'https://images.pexels.com/photos/31771054/pexels-photo-31771054.jpeg',
    true,
    179.00,
    2,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000321',
    'White sauce Pasta',
    'food',
    'Creamy white sauce pasta tossed with herbs, vegetables, and Italian seasoning',
    'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
    true,
    149.00,
    2,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000654',
    'Cheese Burger',
    'food',
    'Juicy burger layered with melted cheese, fresh vegetables, and a house sauce',
    'https://images.pexels.com/photos/32480062/pexels-photo-32480062.jpeg',
    true,
    129.00,
    1,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000987',
    'Fried Rice',
    'food',
    'Wok-tossed rice with fresh vegetables, soy sauce, and aromatic spices',
    'https://images.pexels.com/photos/35071826/pexels-photo-35071826.jpeg',
    true,
    119.00,
    4,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000213',
    'Pizza',
    'food',
    'Classic pizza topped with mozzarella cheese, tomato sauce, and fresh herbs',
    'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg',
    true,
    199.00,
    2,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000546',
    'Corn Cheese Sandwich',
    'snacks',
    'Grilled sandwich stuffed with sweet corn, melted cheese, and mild spices',
    'https://images.pexels.com/photos/36268517/pexels-photo-36268517.jpeg',
    false,
    109.00,
    1,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000879',
    'DimSums',
    'snacks',
    'Delicate dumplings filled with seasoned ingredients and served with dipping sauce',
    NULL,
    true,
    129.00,
    1,
    now()
  ),
  (
    '50000000-0000-4000-8000-000000000852',
    'Chaumin',
    'food',
    NULL,
    'https://images.pexels.com/photos/3926121/pexels-photo-3926121.jpeg',
    true,
    99.00,
    1,
    now()
  )
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_available = EXCLUDED.is_available,
  price = EXCLUDED.price,
  serves = EXCLUDED.serves;
