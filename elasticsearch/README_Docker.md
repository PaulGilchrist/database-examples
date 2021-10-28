# Example: Running Elastic Search using Docker

## Without Persistance

```
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --name elasticsearch elasticsearch:7.14.2
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node elasticsearch
```

## With Persistance
1) Pre-create the directory `/Users/Shared/containerStorage/elasticsearch` on host before running container.  Alternate directory can be choosen if desired.
2) Run the Docker container.  It will automatically be downloaded from https://hub.docker.com if not already existing locally.

```
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --name elasticsearch -v /Users/Shared/containerStorage/elasticsearch:/usr/share/elasticsearch/data elasticsearch:7.14.2
```

3) Allow time for the container to fully start before running the nodeJS test applications.  You can look at the containers console logs to determine when it is ready.

```
node elasticsearch
```

<mark>If running this container in production, do not expose its ports externally.  Access should only be allowed to select internal containers</mark>
