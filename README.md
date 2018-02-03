# node-configenv [![npm version](https://badge.fury.io/js/%40dormi%2Fnode-configenv.svg)](https://badge.fury.io/js/%40dormi%2Fnode-configenv) [![Build Status](https://travis-ci.org/andrewdormi/node-configenv.svg?branch=master)](https://travis-ci.org/andrewdormi/node-configenv) [![Coverage Status](https://coveralls.io/repos/github/andrewdormi/node-configenv/badge.svg?branch=master)](https://coveralls.io/github/andrewdormi/node-configenv?branch=master)

## Overview
It is just helper for parsing configuration that you passing with environment variables to javascript object.

Use it with node.js version that support es6 specification  

## Install

```bash
$ npm install @dormi/node-configenv --save
```

## Usage

```js
const ConfigEnv = require('@dormi/node-configenv');
const config = new ConfigEnv(configMap, options);
```

### configMap
Format: ```{[envName]: [envOptions]}```

#### envName
Environment name for setting options

```__``` will be parsed as deep level

```_``` will be parsed as camel case

For example:
```js
{
    API__APP_PORT: 8090
}
```
Will be parsed as: 
```js
{
    api: {
        appPort: 8090
    }
}
```

#### envOptions
Options object for environment variable. If it not an object it will be used as default value.

```required: false``` - Check for setting environment variable, default: ```false```

```default: value``` - Set default value if environment variable is undefined 

### options

```global: true``` - Set your config to ```global.config```. default: ```false```

```parse: true``` - Parse strings to primitives. e.g ```"[1, 2, 3]"``` will be parsed to array of numbers ```[1, 2, 3]```. default: ```false```

```envFile: true``` - Load environment variables from file. If true it will search ```.env``` file in project root. Can be string path. default: ```false```

## Examples

### Use with command line environment
Create configuration:
```js
const ConfigEnv = require('@dormi/node-configenv');
const config = new ConfigEnv({
    PORT: {default: 8080},
    MONGO__URL: {default: 'mongodb://localhost:27017/dbname'}
}, {global: true, parse: true});
```

Run node.js program with env variables:
```bash
PORT=9000 node index.js
```

```global.config``` will be:
```js
{
    port: 9000,
    mongo: {
        url: 'mongodb://localhost:27017/dbname'
    }
}
```

### Use with environment file
Create configuration:
```js
const ConfigEnv = require('@dormi/node-configenv');
const config = new ConfigEnv({
    PORT: {default: 8080},
    MONGO__URL: {default: 'mongodb://localhost:27017/dbname'}
}, {global: true, parse: true, envFile: true});
```

Create .env file in project root:
```bash
PORT=9000
MONGO__URL=mongodb://localhost:27020/some
```

```global.config``` will be:
```js
{
    port: 9000,
    mongo: {
        url: 'mongodb://localhost:27020/some'
    }
}
```