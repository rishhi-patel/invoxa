# Update-LambdaImages.ps1
param (
    [string]$AWS_ACCOUNT_ID = "857736875915",
    [string]$AWS_REGION = "us-east-1",
    [string]$PROJECT_PREFIX = "invoxa-dev"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$services = @('auth', 'client', 'invoice', 'payment', 'insights')
$registry = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

foreach ($svc in $services) {
    $service = $svc.Trim()
    if ([string]::IsNullOrWhiteSpace($service)) { throw "Empty service name detected." }

    $repo = "$($PROJECT_PREFIX)-$($service)"
    $imageUri = "$($registry)/$($repo):latest"
    $function = $repo  # function name: invoxa-dev-<service>

    if ($imageUri -notmatch '^[^:]+/[^:]+:[^:]+$') {
        throw "Built image URI looks wrong: $imageUri"
    }

    Write-Host "`n[INFO] Updating $function -> $imageUri"
    aws lambda update-function-code `
        --function-name $function `
        --image-uri $imageUri `
        --region $AWS_REGION `
        --no-cli-pager | Out-Null

    Write-Host "[OK] $function now points to :latest"
}

Write-Host "`n[DONE] All Lambda functions updated."
