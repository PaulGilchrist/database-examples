# Example: Running RabbitMQ using Docker

## Without Persistance

```
docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --name rabbitmq rabbitmq:3-management
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node rabbitmq
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/rabbitmq` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --name rabbitmq -v /Users/Shared/containerStorage/rabbitmq:/var/lib/rabbitmq rabbitmq:3-management
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node rabbitmq
```

You can connect to the management UI at http://localhost:15672
Default username and password of guest / guest
