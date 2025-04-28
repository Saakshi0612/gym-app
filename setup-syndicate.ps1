# Get the current user's PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Add Python Scripts directory to PATH if it's not already there
$scriptsPath = "C:\Users\sayantan_bhaumik\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts"

# Also create the Git Bash compatible path
$gitBashScriptsPath = "/c/Users/sayantan_bhaumik/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0/LocalCache/local-packages/Python313/Scripts"

if ($userPath -notlike "*$scriptsPath*") {
    $newPath = $userPath + ";" + $scriptsPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "Added Python Scripts directory to PATH"
} else {
    Write-Host "Python Scripts directory already in PATH"
}

# Create a .bashrc file in the user's home directory if it doesn't exist
$bashrcPath = "$env:USERPROFILE\.bashrc"
if (-not (Test-Path $bashrcPath)) {
    New-Item -Path $bashrcPath -ItemType File
    Write-Host "Created new .bashrc file"
}

# Add the PATH to .bashrc if it's not already there
$bashrcContent = Get-Content $bashrcPath
if ($bashrcContent -notlike "*$gitBashScriptsPath*") {
    Add-Content $bashrcPath "export PATH=`"${gitBashScriptsPath}:`${PATH}`""
    Write-Host "Added Python Scripts directory to .bashrc"
} else {
    Write-Host "Python Scripts directory already in .bashrc"
}

# Refresh the current session's PATH
$env:PATH = [Environment]::GetEnvironmentVariable("PATH", "User")

Write-Host "Setup complete. Please:"
Write-Host "1. Restart PowerShell"
Write-Host "2. In Git Bash, run: source ~/.bashrc" 