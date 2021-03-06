# Example: Running Cassandra using Docker

## Without Persistance

```
docker run -d -p 9042:9042 --name cassandra cassandra
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node cassandra
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/cassandra` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 9042:9042 --name cassandra -v /Users/Shared/containerStorage/cassandra:/var/lib/cassandra cassandra
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node cassandra
```

You can run Cassandra commands locally within the container by connecting to its console and running the command `cqlsh`

<mark>If running this container in production, do not expose its ports externally.  Access should only be allowed to select internal containers</mark>
