echo "Updating repo from github"
git pull origin master
echo "Updating node and launching app"
npm install && npm start
