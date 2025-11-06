
Write-Host "🚀 Iniciando proceso de despliegue para Ideark Dashboard..." -ForegroundColor Green

# Limpiar archivos anteriores
Write-Host "🧹 Limpiando archivos de build anteriores..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules\.vite") { Remove-Item -Recurse -Force "node_modules\.vite" }

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm ci

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

# Ejecutar linting
Write-Host "🔍 Ejecutando linting..." -ForegroundColor Yellow
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Linting encontró problemas, pero continuando..." -ForegroundColor Yellow
}

# Construir para producción
Write-Host "🏗️  Construyendo aplicación para producción..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    exit 1
}

# Verificar que el build fue exitoso
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: El directorio 'dist' no fue creado. Build falló." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completado exitosamente!" -ForegroundColor Green

# Mostrar información del build
Write-Host "📁 Archivos generados en: .\dist" -ForegroundColor Cyan
Write-Host "📄 Archivos principales generados:" -ForegroundColor Cyan
Get-ChildItem -Path "dist" | Format-Table Name, Length, LastWriteTime

Write-Host ""
Write-Host "🎉 ¡Listo para desplegar!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor White
Write-Host "1. Sube tu código a GitHub/GitLab" -ForegroundColor White
Write-Host "2. Conecta tu repositorio en Render/Netlify/Vercel" -ForegroundColor White
Write-Host "3. Configura las variables de entorno" -ForegroundColor White
Write-Host "4. ¡Despliega!" -ForegroundColor White
Write-Host ""
Write-Host "📖 Ver DEPLOYMENT.md para instrucciones detalladas" -ForegroundColor Cyan