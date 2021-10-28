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

## With Persistance and Clustering

### WARNING - Slow to connect when running cluster in Docker

1) Pre-create the directory `/Users/Shared/containerStorage/cassandra1` and `/Users/Shared/containerStorage/cassandra2` on host before running containers.  Alternate directories can be choosen if desired.

2) Create a network and run two instances of the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker network create cassandra-network

docker run -d -p 9042:9042 --network cassandra-network --name cassandra1 -e CASSANDRA_SEEDS=cassandra1,cassandra2 -v /Users/Shared/containerStorage/cassandra1:/var/lib/cassandra cassandra

docker run -d -p 9043:9042 --network cassandra-network --name cassandra2 -e CASSANDRA_SEEDS=cassandra1,cassandra2 -v /Users/Shared/containerStorage/cassandra2:/var/lib/cassandra cassandra
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node cassandra
```

You can run Cassandra commands locally within the container by connecting to its console and running the command `cqlsh`

<mark>If running this container in production, do not expose its ports externally.  Access should only be allowed to select internal containers</mark>
