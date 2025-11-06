-- Create role enum
CREATE TYPE public.user_role AS ENUM ('restaurant', 'ngo', 'admin');

-- Create food status enum
CREATE TYPE public.food_status AS ENUM ('available', 'reserved', 'fulfilled', 'expired');

-- Create request status enum
CREATE TYPE public.request_status AS ENUM ('open', 'matched', 'fulfilled', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  organization_name TEXT,
  license_number TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create food_donations table
CREATE TABLE public.food_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  food_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  pickup_time_start TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_time_end TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  status food_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_requests table
CREATE TABLE public.food_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_type TEXT NOT NULL,
  quantity_needed NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  urgency TEXT NOT NULL,
  purpose TEXT,
  location TEXT NOT NULL,
  status request_status DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.food_donations(id) ON DELETE CASCADE NOT NULL,
  request_id UUID REFERENCES public.food_requests(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  notes TEXT
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Food donations policies
CREATE POLICY "Anyone can view available donations"
  ON public.food_donations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurants can create donations"
  ON public.food_donations FOR INSERT
  TO authenticated
  WITH CHECK (restaurant_id = auth.uid() AND public.get_user_role(auth.uid()) = 'restaurant');

CREATE POLICY "Restaurants can update own donations"
  ON public.food_donations FOR UPDATE
  TO authenticated
  USING (restaurant_id = auth.uid());

CREATE POLICY "Restaurants can delete own donations"
  ON public.food_donations FOR DELETE
  TO authenticated
  USING (restaurant_id = auth.uid());

-- Food requests policies
CREATE POLICY "Anyone can view requests"
  ON public.food_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can create requests"
  ON public.food_requests FOR INSERT
  TO authenticated
  WITH CHECK (ngo_id = auth.uid() AND public.get_user_role(auth.uid()) = 'ngo');

CREATE POLICY "NGOs can update own requests"
  ON public.food_requests FOR UPDATE
  TO authenticated
  USING (ngo_id = auth.uid());

CREATE POLICY "NGOs can delete own requests"
  ON public.food_requests FOR DELETE
  TO authenticated
  USING (ngo_id = auth.uid());

-- Matches policies
CREATE POLICY "Users can view own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (ngo_id = auth.uid() OR restaurant_id = auth.uid());

CREATE POLICY "NGOs can create matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (ngo_id = auth.uid() AND public.get_user_role(auth.uid()) = 'ngo');

CREATE POLICY "Users can update own matches"
  ON public.matches FOR UPDATE
  TO authenticated
  USING (ngo_id = auth.uid() OR restaurant_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger function for profile updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_donations_updated_at
  BEFORE UPDATE ON public.food_donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_requests_updated_at
  BEFORE UPDATE ON public.food_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();