# Example: Deploying Cassandra to a Kubernetes cluster using StatefulSets

The below steps show setting up Elastic Search in a Kubernetes cluster without persistance, since persistance is too cloud or hardware/os specific, and not required in this example.

## Simplified Steps

1) Ensure Kubernetes cluster is online

2) Create a folder on the local host for storing the Elastic Search container's data files, and update the PersistentVolume file in the `kubernetes` folder to reflect its path.  If ever modifying the StatefulSet's replica count, you must first ensure an equal or greater number of pre-created local folders and PersistentVolume files referencing them.

3) Add all Elastic Search specific Kubernetes resources

```
kubectl apply -f kubernetes
```

4) Allow time for all nodes of cluster to pass their readinessProbe

```
kubectl describe statefulset elasticsearch
```

5) Test Elastic Search

```
node elasticsearch
```

You can optionally change the file named `elasticsearch-statefulset.yaml` to change the cassandra cluster node count (replicas) first ensuring there are an appropriate number of precreated PersistentVolume.

```
kubectl apply -f kubernetes
```

<mark>If using for production, make sure to not allow access to Elastic Search from outside of the Kubernetes cluster without first adding security.</mark>


## Cleanup

```
kubectl delete -f kubernetes
```

