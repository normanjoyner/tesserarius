tesserarius
==============

## About

### Build Status
[![Build Status](https://drone.containership.io/api/badges/containership/tesserarius/status.svg)](https://drone.containership.io/containership/tesserarius)

### Description
Basic iptables manipulation in nodejs.

### Disclaimer
For now, tesserarius shells out when manipulating iptables rules. This will change in the future.

### Author
ContainerShip Developers - developers@containership.io

## Getting Started

### Installation
`npm install tesserarius --save`

### Examples

####Instantiation
Instantiate a new tesserarius object.

```javascript
const Tesserarius = require("tesserarius");
const tesserarius = new Tesserarius();
```

#### Creating a Chain
Creates a new chain with the given name
```javascript
tesserarius.create_chain('MyChain', (err) => {
    if(err) {
        throw err;
    }
});
```

#### Set Chain Policy
Sets the policy of a given chain
```javascript
tesserarius.set_policy('MyChain', 'DROP', (err) => {
    if(err) {
        throw err;
    }
});
```

#### Add Rule to Chain
Adds a rule with the given specifications to the chain if it does not already exist
```javascript
const rule = {
    interface: 'eth0',
    policy: 'ACCEPT',
    protocol: 'tcp',
    destination_port: 22,
    source: '10.0.10.0/24'
}

tesserarius.add_rule('MyChain', rule, (err) => {
    if(err) {
        throw err;
    }
});
```

#### Remove Rule from Chain
Removes a rule with the given specifications from the chain if it exists
```javascript
const rule = {
    interface: 'eth0',
    policy: 'ACCEPT',
    protocol: 'tcp',
    destination_port: 22,
    source: '10.0.10.0/24'
}

tesserarius.delete_rule('MyChain', rule, (err) => {
    if(err) {
        throw err;
    }
});
```

#### Set Chain Rules
Resets the chain rules to the given rules
```javascript
const rules = [
    {
        interface: 'eth0',
        policy: 'ACCEPT',
        protocol: 'tcp',
        destination_port: 22,
        source: '10.0.10.0/24'
    },
    {
        interface: 'eth0',
        policy: 'ACCEPT',
        protocol: 'tcp',
        destination_port: 22,
        source: '10.0.12.0/24'
    }
]

tesserarius.set_rules('MyChain', rules, (err) => {
    if(err) {
        throw err;
    }
});
```

#### Get Chain Rules
Returns an array of the given chain's rules
```javascript
tesserarius.get_rules('MyChain', (err, rules) => {
    if(err) {
        throw err;
    }

    console.log(rules);
});
```

#### Flush
Flushes a given chain, or all chains if chain is omitted
```javascript
tesserarius.flush('MyChain', (err) => {
    if(err) {
        throw err;
    }
});
```

## Contributing
Pull requests and issues are encouraged!
