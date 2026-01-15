-- Add length constraints to profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT full_name_length CHECK (length(full_name) <= 200),
ADD CONSTRAINT company_name_length CHECK (length(company_name) <= 200),
ADD CONSTRAINT email_length CHECK (length(email) <= 255);

-- Update handle_new_user function to truncate input and add validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, company_name)
  VALUES (
    new.id, 
    SUBSTRING(new.email, 1, 255),
    SUBSTRING(new.raw_user_meta_data ->> 'full_name', 1, 200),
    SUBSTRING(new.raw_user_meta_data ->> 'company_name', 1, 200)
  );
  RETURN new;
END;
$$;