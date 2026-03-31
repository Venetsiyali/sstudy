-- S-STUDY Platform - FIX Admin Access Issues
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mcfcahqnqmdgyykufook/sql/new
-- This fixes the circular RLS policy issue that prevents admin login

-- Step 1: Drop problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Step 2: Recreate profiles policies without circular reference
-- Allow any authenticated user to read their OWN profile
CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

-- Allow any authenticated user to update their OWN profile  
CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Allow inserting own profile (for auto-creation)
CREATE POLICY "Users can insert own profile" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view ALL profiles (using auth.jwt() to avoid circular reference)
CREATE POLICY "Admins can view all profiles" ON profiles 
    FOR SELECT TO authenticated 
    USING (
        auth.uid() = id 
        OR 
        (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    );

-- Admins can update any profile (for toggling admin status)
CREATE POLICY "Admins can update all profiles" ON profiles 
    FOR UPDATE TO authenticated 
    USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    );

-- Step 3: Make sure the auto-profile trigger works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', ''), new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
