$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZmNhaHFucW1kZ3l5a3Vmb29rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYwMDkyNywiZXhwIjoyMDkwMTc2OTI3fQ.tFMEnwYCOQOl7OIyANqjXtG_UI6pJLctwWP38pQjvw0"
$baseUrl = "https://mcfcahqnqmdgyykufook.supabase.co"
$headers = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json"
}

Write-Host "=== AUTH USERS ==="
$users = (Invoke-RestMethod -Uri "$baseUrl/auth/v1/admin/users" -Headers $headers -Method Get).users
foreach ($u in $users) {
    Write-Host "  ID: $($u.id)"
    Write-Host "  Email: $($u.email)"
    Write-Host "  Confirmed: $($u.email_confirmed_at)"
    Write-Host "---"
}

Write-Host ""
Write-Host "=== PROFILES ==="
$profiles = Invoke-RestMethod -Uri "$baseUrl/rest/v1/profiles?select=id,name,email,is_admin" -Headers $headers -Method Get
foreach ($p in $profiles) {
    Write-Host "  ID: $($p.id)"
    Write-Host "  Name: $($p.name)"
    Write-Host "  Email: $($p.email)"
    Write-Host "  Admin: $($p.is_admin)"
    Write-Host "---"
}

Write-Host ""
Write-Host "=== CONFIRMING ALL USER EMAILS ==="
foreach ($u in $users) {
    if (-not $u.email_confirmed_at) {
        Write-Host "  Confirming: $($u.email) ($($u.id))"
        $body = '{"email_confirm": true}'
        try {
            Invoke-RestMethod -Uri "$baseUrl/auth/v1/admin/users/$($u.id)" -Headers $headers -Method Put -Body $body | Out-Null
            Write-Host "  -> DONE"
        } catch {
            Write-Host "  -> ERROR: $_"
        }
    } else {
        Write-Host "  Already confirmed: $($u.email)"
    }
}

Write-Host ""
Write-Host "=== SETTING ADMIN FOR ALL PROFILES ==="
foreach ($p in $profiles) {
    if ($p.is_admin -eq $true) {
        Write-Host "  Already admin: $($p.email)"
    } else {
        Write-Host "  Making admin: $($p.email)"
        $body = '{"is_admin": true}'
        $patchHeaders = @{
            "apikey" = $serviceKey
            "Authorization" = "Bearer $serviceKey"
            "Content-Type" = "application/json"
            "Prefer" = "return=minimal"
        }
        try {
            Invoke-RestMethod -Uri "$baseUrl/rest/v1/profiles?id=eq.$($p.id)" -Headers $patchHeaders -Method Patch -Body $body
            Write-Host "  -> DONE"
        } catch {
            Write-Host "  -> ERROR: $_"
        }
    }
}

Write-Host ""
Write-Host "=== VERIFY FINAL STATE ==="
$finalProfiles = Invoke-RestMethod -Uri "$baseUrl/rest/v1/profiles?select=id,name,email,is_admin" -Headers $headers -Method Get
foreach ($p in $finalProfiles) {
    Write-Host "  $($p.email) -> admin: $($p.is_admin)"
}

Write-Host ""
Write-Host "ALL DONE!"
