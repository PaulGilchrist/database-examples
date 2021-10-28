# Example: Running PostgreSQL using Docker

## Without Persistance

```
docker run  -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password --name postgres postgres:latest
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mongodb
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/postgres` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run  -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password --name postgres -v /Users/Shared/containerStorage/postgres:/var/lib/postgresql/data postgres:latest
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mongodb
```

You can run MongoDB commands locally within the container by connecting to its console and running the command `psql`
