-- Update LAUNCH20 coupon to allow 40 total uses (20 people × 2 uses each)
UPDATE coupons 
SET usage_limit = 40 
WHERE code = 'LAUNCH20';