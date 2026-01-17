import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Ticket, X } from 'lucide-react';

interface CouponInputProps {
  onCouponApplied: (coupon: { code: string; discount_percentage: number; discount_amount: number }) => void;
  onCouponRemoved: () => void;
  appliedCoupon: { code: string; discount_percentage: number; discount_amount: number } | null;
  subtotal: number;
  customerEmail: string;
}

export function CouponInput({ onCouponApplied, onCouponRemoved, appliedCoupon, subtotal, customerEmail }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);

    try {
      // Check if coupon exists and is valid
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        toast.error('Invalid coupon code');
        return;
      }

      // Check if coupon is still valid (not expired)
      const now = new Date();
      const validUntil = new Date(coupon.valid_until);
      if (now > validUntil) {
        toast.error('This coupon has expired');
        return;
      }

      // Check if coupon has usage left
      if (coupon.used_count >= coupon.usage_limit) {
        toast.error('This coupon has reached its usage limit');
        return;
      }

      // Check per-user usage limit if it exists
      if (coupon.user_usage_limit) {
        const { data: userUsage, error: usageError } = await supabase
          .from('coupon_usage')
          .select('id')
          .eq('coupon_id', coupon.id)
          .eq('customer_email', customerEmail);

        if (usageError) {
          toast.error('Failed to validate coupon usage');
          return;
        }

        if (userUsage && userUsage.length >= coupon.user_usage_limit) {
          toast.error(`You can only use this coupon ${coupon.user_usage_limit} times`);
          return;
        }
      }

      // Calculate discount amount
      const discountAmount = (subtotal * coupon.discount_percentage) / 100;

      // Apply coupon
      onCouponApplied({
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        discount_amount: discountAmount
      });

      toast.success(`Coupon applied! ${coupon.discount_percentage}% discount`);
      setCouponCode('');
    } catch (error) {
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemoved();
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">
              {appliedCoupon.code} ({appliedCoupon.discount_percentage}% off)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeCoupon}
            className="text-green-600 hover:text-green-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-green-600 mt-1">
          You saved £{appliedCoupon.discount_amount.toFixed(2)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <Label htmlFor="coupon" className="text-sm font-medium mb-2 block">
        Have a coupon code?
      </Label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
        />
        <Button
          type="button"
          variant="outline"
          onClick={validateCoupon}
          disabled={isValidating || !couponCode.trim()}
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}