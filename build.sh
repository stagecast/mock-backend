# This script builds the app and run it
# It has 2 modes: dev and null, in dev mode Postman and Browser are automatically opened
OS_ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
echo $OS_ARCH
MODE=$1
# Delete all the containers that might be running in the host
docker rm -f $(docker ps -a | grep "filippoboiani/rest-service" | awk '{print $1}')
# # Build the container
# docker build -t filippoboiani/rest-service .
# # Run the container
# docker run -p 3000:3000 -d filippoboiani/rest-service:latest
docker-compose up --build
# Open the Browser and Postman (optinal)
if [ "$MODE" == "dev" ]
then
open "http://localhost:3000/api/v1/welcome"
open -a "Postman"
fi

