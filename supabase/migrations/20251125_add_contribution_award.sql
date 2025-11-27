-- Add contributions counter to profiles and trigger to award on fulfillment

-- Add column to track contributions per restaurant
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS contributions_count INTEGER DEFAULT 0;

-- Function: when a donation is fulfilled, mark related match fulfilled and award contribution
CREATE OR REPLACE FUNCTION public.on_donation_fulfilled_award()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act when status transitions to 'fulfilled'
  IF NEW.status = 'fulfilled' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Increment contributions for the restaurant
    UPDATE public.profiles
    SET contributions_count = COALESCE(contributions_count, 0) + 1,
        updated_at = NOW()
    WHERE id = NEW.restaurant_id;

    -- Mark any related matches as fulfilled
    UPDATE public.matches
    SET status = 'fulfilled',
        fulfilled_at = NOW()
    WHERE donation_id = NEW.id;

    -- Create a notification for the restaurant
    INSERT INTO public.notifications (user_id, title, message, type, link, created_at)
    VALUES (
      NEW.restaurant_id,
      'Donation fulfilled',
      'Your donation was collected by an NGO. Contribution recorded — thank you!',
      'contribution',
      '/restaurant',
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger: after updating food_donations, award contributions when fulfilled
DROP TRIGGER IF EXISTS trg_on_food_donation_fulfilled_award ON public.food_donations;
CREATE TRIGGER trg_on_food_donation_fulfilled_award
AFTER UPDATE ON public.food_donations
FOR EACH ROW
EXECUTE FUNCTION public.on_donation_fulfilled_award();