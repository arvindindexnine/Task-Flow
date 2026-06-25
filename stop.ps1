function Stop-ProcessOnPort($port) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue 
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            try {
                $processName = (Get-Process -Id $processId).ProcessName
                Write-Host "Stopping process '$processName' (PID: $processId) on port $port..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            } catch {
                Write-Host "Could not stop process $processId" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Port $port is already clear." -ForegroundColor Green
    }
}

Write-Host "Stopping Application...`n" -ForegroundColor Cyan

Stop-ProcessOnPort 3000
Stop-ProcessOnPort 5173

Write-Host "`nAll application services have been stopped." -ForegroundColor Green
