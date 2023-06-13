# Image Resize API REST
## Introduction
This service generates variants of the uploaded image in different resolutions to serve them to different clients (web, mobile applications).

## Overview Diagram
![Arquitecture Diagram](assets/image-resizer-arq.png)

## Installation
**Note: First of all, read functions README to configure GCF**

You should install npm's dependencies
```bash 
npm i
```
Now, you have to set environment variable **MONGODB_URL** with the database connection info.

```
// .env file
MONGODB_URL=mongodb://{user}:{password}@{databaseHost}:{databasePort}/image-resizr?authSource=admin
```

Then you can run the project
```bash
npm start
```

## Local development
You can launch the project to develop using **nodemon** and use **docker compose** to instantiate a moongose database container in your system. Remember set the **MONGODB_URL** environment variable to your machine.

Run the moongose database:
```bash
docker-compose up
```

Launch the project with hot reload for development using the command below:
```bash
npm run dev
```

## API REST Documentation
For more info about the API [click here](api/swagger/openapi.yaml)