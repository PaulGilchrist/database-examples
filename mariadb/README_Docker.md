# Example: Running MariaDB using Docker

## Without Persistance

```
docker run -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=password --name mariadb mariadb:latest
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mariadb
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/mariadb` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=password --name mariadb -v /Users/Shared/containerStorage/mariadb:/var/lib/mysql mariadb:latest
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node mariadb
```

You can run MariaDB commands locally within the container by connecting to its console and running the command `mysql`
