-- Insert All Products into Database
-- Run this AFTER running database-update.sql

-- SOUP BOWLS
INSERT INTO products (id, name, description, price, sizes, category, image, is_active) VALUES
('efo-riro', 'Efo Riro', 'Made with indigenous vegetables and packed with different types of protein. One of the richest meals on our menu.', 60, '{"2L": 60, "3L": 80}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80', true),
('ogbono', 'Ogbono', 'Made with carefully sourced mango seeds and packed with flavour and intentionality. Best paired with any swallow of choice.', 55, '{"2L": 55, "3L": 75}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', true),
('fish-stew', 'Fish Stew', 'Rich tomato-based stew with tender fish pieces. A classic Nigerian favorite.', 50, '{"2L": 50, "3L": 65}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=800&q=80', true),
('ofada-sauce', 'Ofada Sauce', 'Made with a rich blend of red bell and pointed peppers and infused with a specially curated oil. It promises to leave your taste buds wanting more.', 50, '{"2L": 50, "3L": 70}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=800&q=80', true),
('chicken-turkey-peppersoup', 'Chicken/Turkey Peppersoup', 'Aromatic and spicy soup with tender chicken or turkey. Perfect for any occasion.', 50, '{"2L": 50, "3L": 70}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', true),
('seafood-okra', 'Seafood Okra', 'Fresh okra soup loaded with assorted seafood. Rich and flavorful.', 55, '{"2L": 55, "3L": 75}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800&q=80', true),
('beef-stew', 'Beef Stew', 'Hearty tomato stew with tender beef chunks. A comfort food classic.', 50, '{"2L": 50, "3L": 65}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', true),
('ayamase-sauce', 'Ayamase Sauce', 'A dish indigenous to Ghana but loved by all. Made with specially bleached oil, fresh green peppers, and other ingredients. This pairs well with a properly cooked bowl of boiled rice.', 55, '{"2L": 55, "3L": 75}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', true),
('orisirisi-atadindin', 'Orisirisi Atadindin', 'Mixed pepper sauce with assorted meats. Bold and spicy.', 55, '{"2L": 55, "3L": 75}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', true),
('cowleg-offals-peppersoup', 'Cowleg/Offals Peppersoup', 'Traditional peppersoup with cowleg and offals. Rich in flavor and nutrients.', 55, '{"2L": 55, "3L": 75}'::jsonb, 'soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', true);

-- FOOD BOWLS
INSERT INTO products (id, name, description, price, sizes, category, image, is_active) VALUES
('jollof-rice', 'Jollof Rice', 'Our signature Smokey Jollof is made with pepper mix rich in herbs, spice, and flavour, smoked to perfection for your enjoyment.', 30, '{"2L": 30, "3L": 40}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80', true),
('jollof-spaghetti', 'Jollof Spaghetti', 'Jollof-style spaghetti with rich tomato sauce and spices. A unique twist on a classic.', 30, '{"2L": 30, "3L": 40}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', true),
('coconut-rice', 'Coconut Rice', 'Our special rice meal designed to remind you of the versatility of coconut. Smells as good as it tastes. You can never have enough!', 40, '{"2L": 40, "3L": 55}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80', true),
('fried-rice', 'Fried Rice', 'Our fried rice is made with fresh vegetables carefully infused into rice. It is crunchy and flavour-filled — you will love it!', 35, '{"2L": 35, "3L": 45}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80', true),
('asaro', 'Asaro (Yam Porridge)', 'Traditional yam porridge cooked with palm oil and spices. Comfort food at its best.', 35, '{"2L": 35, "3L": 45}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80', true),
('seafood-rice', 'Seafood Rice', 'Made with specially curated and sourced seafood. Our seafood rice will blow your mind with flavour.', 45, '{"2L": 45, "3L": 55}'::jsonb, 'rice', 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800&q=80', true);

-- FOOD COOLERS
INSERT INTO products (id, name, description, price, sizes, category, image, is_active) VALUES
('jollof-rice-cooler', 'Jollof Rice Cooler', 'Our signature Smokey Jollof in large cooler portions. Perfect for parties and events.', 110, '{"Full Cooler": 110, "Half Cooler": 70}'::jsonb, 'special', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80', true),
('fried-rice-cooler', 'Fried Rice Cooler', 'Fresh vegetable fried rice in large cooler portions. Great for gatherings.', 180, '{"Full Cooler": 180, "Half Cooler": 110}'::jsonb, 'special', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80', true);

-- PROTEIN COOLERS
INSERT INTO products (id, name, description, price, sizes, category, image, is_active) VALUES
('fried-peppered-chicken', 'Fried Peppered Chicken', 'Crispy fried chicken tossed in spicy pepper sauce. Perfect for parties.', 180, '{"Full Cooler": 180, "Half Cooler": 100}'::jsonb, 'special', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80', true),
('fried-peppered-beef', 'Fried Peppered Beef', 'Premium beef cuts fried and peppered to perfection. A luxurious treat.', 500, '{"Full Cooler": 500, "Half Cooler": 300}'::jsonb, 'special', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', true),
('fried-peppered-turkey', 'Fried Peppered Turkey', 'Tender turkey pieces fried and peppered. Great for special occasions.', 200, '{"Full Cooler": 200, "Half Cooler": 100}'::jsonb, 'special', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80', true),
('fried-peppered-hake-fish', 'Fried Peppered Hake Fish', 'Fresh hake fish fried crispy and tossed in pepper sauce.', 250, '{"Full Cooler": 250, "Half Cooler": 150}'::jsonb, 'special', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', true);

-- EXTRAS
INSERT INTO products (id, name, description, price, sizes, category, image, is_active) VALUES
('salad', 'Salad', 'Fresh mixed salad tray. Perfect side dish for any meal.', 50, '{"1 Tray": 50}'::jsonb, 'sides', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', true),
('gizdodo', 'Gizdodo', 'Gizzard and plantain cooked in peppered sauce. A Nigerian favorite.', 45, '{"2L": 45, "3L": 60}'::jsonb, 'sides', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80', true),
('moimoi', 'Moi-Moi (Elewe)', 'Sometimes referred to as beans pudding. A very good choice for breakfast — something light!', 3, '{"1 Piece": 3}'::jsonb, 'sides', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80', true);

-- Update site settings with correct phone number
UPDATE site_settings SET setting_value = '+447741069639' WHERE setting_key = 'whatsapp_number';
