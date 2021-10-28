# Example: Running Redis Cache using Docker

## Without Persistance

```
docker run -d -p 6379:6379 --name redis redis:latest
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node redis
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/redis` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 6379:6379 --name redis -v /Users/Shared/containerStorage/redis:/data redis
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node redis
```

You can run Redis commands locally within the container by connecting to its console and running the command `redis-cli`
