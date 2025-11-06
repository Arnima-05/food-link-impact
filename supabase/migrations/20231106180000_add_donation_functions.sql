-- Function to handle full donation acceptance
CREATE OR REPLACE FUNCTION public.accept_full_donation(
  donation_id uuid,
  ngo_id uuid,
  restaurant_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a match record
  INSERT INTO public.matches (
    donation_id,
    ngo_id,
    restaurant_id,
    status,
    matched_at,
    accepted_quantity,
    original_quantity
  )
  SELECT 
    donation_id,
    ngo_id,
    restaurant_id,
    'pending',
    NOW(),
    fd.quantity,
    fd.quantity
  FROM public.food_donations fd
  WHERE fd.id = donation_id
  AND fd.status = 'available';

  -- Update the donation status to reserved
  UPDATE public.food_donations
  SET status = 'reserved'
  WHERE id = donation_id
  AND status = 'available';
END;
$$;

-- Function to handle partial donation acceptance
CREATE OR REPLACE FUNCTION public.accept_partial_donation(
  donation_id uuid,
  ngo_id uuid,
  restaurant_id uuid,
  accepted_quantity integer,
  remaining_quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  original_donation RECORD;
  new_donation_id uuid;
BEGIN
  -- Get the original donation details
  SELECT * INTO original_donation
  FROM public.food_donations
  WHERE id = donation_id
  AND status = 'available';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found or already accepted';
  END IF;

  -- Insert a match record for the accepted portion
  INSERT INTO public.matches (
    donation_id,
    ngo_id,
    restaurant_id,
    status,
    matched_at,
    accepted_quantity,
    original_quantity
  ) VALUES (
    donation_id,
    ngo_id,
    restaurant_id,
    'pending',
    NOW(),
    accepted_quantity,
    original_donation.quantity
  );

  -- Update the original donation with the remaining quantity
  UPDATE public.food_donations
  SET 
    quantity = remaining_quantity,
    updated_at = NOW()
  WHERE id = donation_id;

  -- Create a new donation for the remaining quantity if there's any left
  IF remaining_quantity > 0 THEN
    -- Create a new donation for the remaining quantity
    INSERT INTO public.food_donations (
      food_name,
      food_type,
      quantity,
      unit,
      description,
      pickup_time_start,
      pickup_time_end,
      expires_at,
      location,
      status,
      restaurant_id,
      created_at,
      updated_at
    ) VALUES (
      original_donation.food_name,
      original_donation.food_type,
      remaining_quantity,
      original_donation.unit,
      original_donation.description || ' (Split from original donation)',
      original_donation.pickup_time_start,
      original_donation.pickup_time_end,
      original_donation.expires_at,
      original_donation.location,
      'available',
      original_donation.restaurant_id,
      NOW(),
      NOW()
    ) RETURNING id INTO new_donation_id;
  END IF;

  -- Mark the original donation as fulfilled since it's been split
  UPDATE public.food_donations
  SET status = 'fulfilled'
  WHERE id = donation_id;
END;
$$;
