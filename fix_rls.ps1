$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZmNhaHFucW1kZ3l5a3Vmb29rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYwMDkyNywiZXhwIjoyMDkwMTc2OTI3fQ.tFMEnwYCOQOl7OIyANqjXtG_UI6pJLctwWP38pQjvw0"
$baseUrl = "https://mcfcahqnqmdgyykufook.supabase.co"
$headers = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json"
    "x-debug" = "true"
}

# Run SQL via Supabase's RPC - we'll create a temporary function to run raw SQL
$sql = @"
-- Drop old problematic profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate clean policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT TO authenticated
    USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE TO authenticated
    USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    );

-- Fix auto-profile trigger
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
"@

Write-Host "Running SQL to fix RLS policies..."

# Use the pg endpoint
$body = @{ query = $sql } | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$baseUrl/pg/query" -Headers $headers -Method Post -Body $body
    Write-Host "SQL executed successfully!"
    Write-Host ($result | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "pg/query failed: $($_.Exception.Message)"
    Write-Host "Trying alternative approach via REST..."
    
    # Try running individual SQL statements through the REST RPC
    # First let's check if we can use the sql function approach
    $stmts = @(
        'DROP POLICY IF EXISTS "Users can view own profile" ON profiles',
        'DROP POLICY IF EXISTS "Users can update own profile" ON profiles',
        'DROP POLICY IF EXISTS "Users can insert own profile" ON profiles',
        'DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles',
        'DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles',
        'CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id)',
        'CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id)',
        'CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)',
        'CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)',
        'CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)'
    )
    
    foreach ($stmt in $stmts) {
        try {
            $b = @{ query = $stmt } | ConvertTo-Json
            $r = Invoke-RestMethod -Uri "$baseUrl/pg/query" -Headers $headers -Method Post -Body $b
            Write-Host "OK: $($stmt.Substring(0, [Math]::Min(60, $stmt.Length)))..."
        } catch {
            Write-Host "SKIP: $($stmt.Substring(0, [Math]::Min(60, $stmt.Length)))... ($($_.Exception.Message))"
        }
    }
}

Write-Host ""
Write-Host "DONE!"
