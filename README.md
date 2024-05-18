1. [x] Added a new endpoint to get the balance of an account for a given dateTime
2. [x] Get requests are being cached
3. [x] Added a method to settle incoming funds:
   - [x] Triggers each 10 seconds
   - [x] If some of the incoming funds can be settled, write them to settled_funds and update balances accounts table
4. [x] If the performance is not enough, we can set several instances of the same service in k8s, 
and use a load balancer to distribute the load
5. [x] Sharding and replication can improve the performance of the service furthermore
