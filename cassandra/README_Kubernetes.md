# Example: Deploying Cassandra to a Kubernetes cluster using StatefulSets

The below steps show setting up Cassandra in a Kubernetes cluster without persistance, since persistance is too cloud or hardware/os specific, and not required in this example.

## Simplified Steps

1) Ensure Kubernetes cluster is online

2) Create three folders on the local host for storing the 3 Cassandra containers' data files, and update the 3 PersistentVolume files in the `kubernetes` folder to reflect their path.  If ever modifying the StatefulSet's replica count, you must first ensure an equal or greater number of pre-created local folders and PersistentVolume files referencing them.

3) Add all Cassandra specific Kubernetes resources

```
kubectl apply -f kubernetes
```

4) Allow time for all nodes of cluster to pass their readinessProbe

```
kubectl describe statefulset cassandra
```

5) Test Cassandra

```
node cassandra
```

You can optionally change the file named `cassandra-statefulset.yaml` to change the cassandra cluster node count (replicas) first ensuring there are an appropriate number of precreated PersistentVolume.

```
kubectl apply -f kubernetes
```

<mark>Initial client connection will take longer with multi-node vs single node Cassandra clusters, but post connection performance will not be impacted.</mark>

<mark>If using for production, make sure to not allow access to Cassandra from outside of the Kubernetes cluster without first adding security.</mark>


## Cleanup

```
kubectl delete -f kubernetes
```

