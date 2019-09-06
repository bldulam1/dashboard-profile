Clear-Host
git reset --hard
git pull origin
npm audit fix
npm run prod-stop
Clear-Host
npm run start-prod