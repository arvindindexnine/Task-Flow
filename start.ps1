$root = $PSScriptRoot

function Stop-ProcessOnPort($port) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue 
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            try {
                $processName = (Get-Process -Id $processId).ProcessName
                Write-Host "Killing process '$processName' (PID: $processId) on port $port..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            } catch {
                Write-Host "Could not stop process $processId" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Port $port is clear." -ForegroundColor Green
    }
}

Stop-ProcessOnPort 3000
Stop-ProcessOnPort 5173

Write-Host "`nStarting Backend (NestJS)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend\nest-seed'; npm run start:local" -WorkingDirectory "$root\backend\nest-seed"

Write-Host "Starting Frontend (React/Vite)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend\react-seed-v2'; npm run dev" -WorkingDirectory "$root\frontend\react-seed-v2"

Write-Host "`nApplication is starting in separate windows. Please check them for logs." -ForegroundColor Green
