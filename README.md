# Database and Message Platform Examples

This project is a tutorial for using the most popular and heavily used open source, and Docker enabled database and messaging platforms.  Currently supported platform include the following:

* Cassandra
* ElasticSearch
* MariaDB
* MongoDB
* PostgreSQL
* RabbitMQ
* Redis Cache

Each database or messaging platform specific JavaScript file has the needed Docker run command and NPM pagage install command documented at the top of the file.

The following database engines were considered for this project but excluded for the following reasons:

* Kafka has no official Docker image, no ARM64 version, and will not run without Zookeeper
* MySQL has no official ARM64 version for Docker
* Neo4j has no official ARM64 version for Docker
* SQLite has no official Docker image