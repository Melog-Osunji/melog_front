Write-Host "🧹 node_modules 및 lock 파일 삭제 중..."
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

Write-Host "🧼 npm 캐시 정리 중..."
npm cache clean --force

Write-Host "📦 의존성 재설치 중..."
npm install

Write-Host "🧽 Android 빌드 클린 중..."
Set-Location android
.\gradlew clean
Set-Location ..

Write-Host "🚀 앱 실행 중..."
npx react-native start --reset-cache
