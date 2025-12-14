-- Create delivery zones table for Hull area postcodes
CREATE TABLE IF NOT EXISTS delivery_zones (
  id SERIAL PRIMARY KEY,
  postcode_prefix VARCHAR(10) NOT NULL,
  area_name VARCHAR(100) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Hull postcodes (£10 delivery)
INSERT INTO delivery_zones (postcode_prefix, area_name, delivery_fee) VALUES
('HU1', 'Hull City Centre', 10.00),
('HU2', 'Hull North', 10.00),
('HU3', 'Hull West', 10.00),
('HU4', 'Hull East', 10.00),
('HU5', 'Hull South', 10.00),
('HU6', 'Hull Bransholme', 10.00),
('HU7', 'Hull Sutton', 10.00),
('HU8', 'Hull Hessle Road', 10.00),
('HU9', 'Hull Holderness Road', 10.00),
('HU10', 'Anlaby/Willerby', 10.00),
('HU11', 'Cottingham', 10.00),
('HU12', 'Thorngumbald', 10.00),
('HU13', 'Hessle', 10.00),
('HU14', 'Barton-upon-Humber', 10.00),
('HU15', 'Brough', 10.00),
('HU16', 'Cottingham East', 10.00),
('HU17', 'Beverley', 10.00),
('HU18', 'Hornsea', 10.00),
('HU19', 'Withernsea', 10.00),
('HU20', 'Aldbrough', 10.00);

-- Add delivery zone settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('delivery_fee_hull', '10.00', 'Delivery fee within Hull area (£)'),
('delivery_fee_outside', '20.00', 'Delivery fee outside Hull area (£)')
ON CONFLICT (setting_key) DO NOTHING;