@echo off
cd /d "%~dp0"
echo ====================================================
echo Kolt Kase Inc - Push to GitHub
echo ====================================================
echo.
echo Make sure you have created the repository on GitHub:
echo https://github.com/new (Repository name: kolt-kase)
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/waqaskakhtar-ui/kolt-kase.git
git branch -M main

echo Pushing code to https://github.com/waqaskakhtar-ui/kolt-kase.git...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ====================================================
    echo [SUCCESS] Kolt Kase Inc is now LIVE on GitHub!
    echo URL: https://github.com/waqaskakhtar-ui/kolt-kase
    echo ====================================================
) else (
    echo.
    echo [NOTICE] Push failed or authentication needed.
    echo If the repo does not exist yet, create it first at:
    echo https://github.com/new (Name: kolt-kase)
    echo Then run this script again.
)

echo.
pause
