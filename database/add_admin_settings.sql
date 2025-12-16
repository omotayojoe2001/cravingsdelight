-- Add admin email settings to payment_settings table
INSERT INTO payment_settings (method_type, settings) VALUES 
('admin_notifications', '{"admin_email": "joshuaomotayo10@gmail.com", "business_name": "Cravings Delight", "send_order_notifications": true, "send_catering_notifications": true, "send_review_notifications": true}')
ON CONFLICT (method_type) DO NOTHING;