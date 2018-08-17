# Stagecast developement server
### Node JS - MongoDB - Docker


## Run with Docker 

The system must have a docker demon running. More here: [download docker](https://www.docker.com/get-started).

Run: 

```
docker-compose up --build 
```

This command will take by default the docker-compose.yml file in the repo, build the images and start the containers. 

It will start a nodejs application at [http://localhost:3000]() and mongodb database already populated with some random users. 

## Access the DB

It is possible to access the database via console in the following way: 
```
mongo 
use stagecast
```

You can look for users: 
```
db.users.find(); // get all users
db.users.find({email: "email@email.com"}) // get a specific user
```


