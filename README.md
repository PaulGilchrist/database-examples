# Database and Message Platform Examples

This project is a tutorial for using the most popular and heavily used open source (and Docker enabled) databases, search engines, and messaging platforms.  Currently supported platforms include the following:

* Cassandra
* ElasticSearch
  * This is a search engine and not a full database due mainly to its lack of transactions or locking
* MariaDB
* MongoDB
* PostgreSQL
* RabbitMQ
* Redis Cache

Each database or messaging platform specific JavaScript file has the needed Docker run command, persistance path, and NPM pagage install command documented at the top of the file.  If wanting more advanced production level capabilities like encryption, or network isolation, Kubernetes should be used including its built in ingress gateway.  This will allow for the container's configuration to remain simple while offloading these capabilities to a more standardized orchestration layer.  This can also remove the need for each container to maintain its own authentication, offloading this to Kubernetes.

The following database engines were considered for this project but excluded for the following reasons:

* Kafka has no official Docker image, no ARM64 version, and will not run without Zookeeper
* MySQL has no official ARM64 version for Docker
* Neo4j has no official ARM64 version for Docker
* SQLite has no official Docker image

## Initial Setup

Make sure to load all the required NPM packages before running any of the node tests
```cmd
npm i cassandra-driver --save
```

All test require either Docker or Kubernetes environments with setup instructions for each covered in the respective sub-folders