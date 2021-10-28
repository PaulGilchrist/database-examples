# Example: Running MongoDB using Docker

## Without Persistance

```
docker run -d -p 27017:27017 --name mongodb mongo
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mongodb
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/mongodb` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 27017:27017 --name mongodb -v /Users/Shared/containerStorage/mongodb:/data/db mongo
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mongodb
```

You can run MongoDB commands locally within the container by connecting to its console and running the command `mongo`
