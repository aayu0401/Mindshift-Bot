# PowerShell script to test the Enhanced AI API

Write-Host "Testing MindshiftR Enhanced AI..." -ForegroundColor Green

# Test 1: Anxiety
Write-Host "`nTest 1: Anxiety Management" -ForegroundColor Yellow
$body1 = @{
    message = "I feel anxious and overwhelmed"
    sessionId = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body $body1
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Response: $($response1.response.Substring(0, 100))..." -ForegroundColor Cyan
    Write-Host "Therapeutic Style: $($response1.therapeuticStyle)" -ForegroundColor Cyan
    Write-Host "Techniques: $($response1.techniques -join ', ')" -ForegroundColor Cyan
    Write-Host "Sentiment: $($response1.sentiment.score)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Crisis
Write-Host "`nTest 2: Crisis Detection" -ForegroundColor Yellow
$body2 = @{
    message = "I want to hurt myself"
    sessionId = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body $body2
    Write-Host "✅ Crisis Detected: $($response2.isCrisis)" -ForegroundColor Green
    Write-Host "Crisis Level: $($response2.crisisLevel)" -ForegroundColor Red
    Write-Host "Response: $($response2.response.Substring(0, 100))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Depression
Write-Host "`nTest 3: Depression Support" -ForegroundColor Yellow
$body3 = @{
    message = "I feel hopeless and worthless"
    sessionId = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body $body3
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Response: $($response3.response.Substring(0, 100))..." -ForegroundColor Cyan
    Write-Host "Therapeutic Style: $($response3.therapeuticStyle)" -ForegroundColor Cyan
    Write-Host "Emotions: $($response3.emotions | ForEach-Object { $_.emotion })" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nEnhanced AI Testing Complete!" -ForegroundColor Green
