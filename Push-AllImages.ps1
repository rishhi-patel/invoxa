# Push-AllImages.ps1
param (
    [string]$AWS_ACCOUNT_ID = "857736875915",
    [string]$AWS_REGION = "us-east-1",
    [string]$PROJECT_PREFIX = "invoxa-dev"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

# Map service name -> directory
$services = @{
    "auth"     = ".\microservices\auth-service"
    "client"   = ".\microservices\client-service"
    "invoice"  = ".\microservices\invoice-service"
    "payment"  = ".\microservices\payment-service"
    "insights" = ".\microservices\insights-service"
}

# Ensure Docker daemon is up
docker version | Out-Null

# Login to ECR
$registry = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
Write-Host "[INFO] Logging in to ECR $registry ..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $registry

foreach ($svc in $services.Keys) {
    $service = $svc.Trim()
    if ([string]::IsNullOrWhiteSpace($service)) { throw "Empty service key detected." }

    $dir = $services[$svc]
    $repo = "$($PROJECT_PREFIX)-$($service)"
    $localTag = "$($repo):latest"
    $remoteTag = "$($registry)/$($repo):latest"

    Write-Host "`n[INFO] Service : $service"
    Write-Host "       Dir     : $dir"
    Write-Host "       Local   : $localTag"
    Write-Host "       Remote  : $remoteTag"

    if ($remoteTag -notmatch '^[^:]+/[^:]+:[^:]+$') {
        throw "Remote tag looks wrong: $remoteTag"
    }

    # Ensure ECR repo exists
    try {
        aws ecr describe-repositories --repository-names $repo --region $AWS_REGION | Out-Null
    }
    catch {
        Write-Host "[INFO] Creating ECR repo $repo ..."
        aws ecr create-repository --repository-name $repo --image-scanning-configuration scanOnPush=true --region $AWS_REGION | Out-Null
    }

    if (-not (Test-Path $dir)) { throw "Directory not found: $dir" }
    if (-not (Test-Path (Join-Path $dir 'Dockerfile'))) { throw "Dockerfile not found in $dir" }

    Push-Location $dir
    try {
        docker build -t $localTag .
        docker tag   $localTag $remoteTag
        docker push  $remoteTag
    }
    finally {
        Pop-Location
    }

    $digest = aws ecr describe-images `
        --repository-name $repo `
        --image-ids imageTag=latest `
        --region $AWS_REGION `
        --query 'imageDetails[0].imageDigest' `
        --output text

    if ([string]::IsNullOrWhiteSpace($digest) -or $digest -eq 'None') {
        Write-Host "[WARN] Could not resolve digest for $repo:latest (pushed ok?)." -ForegroundColor Yellow
    }
    else {
        Write-Host "  -> Immutable URI: $registry/$repo@$digest"
    }
}

Write-Host "`n[SUCCESS] All requested images built & pushed."
