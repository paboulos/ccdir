# ccdir

## Description

A Node.js package to recursively copy or remove the contents of a directory.\
It can run as an npm executable or node module.

## Module API

-   copy(source-path, destination-path)
-   clean(target-path)

## Executable Command Arguments

```sh
- ccdir -cl <path>
- ccdir -cp <path> <path>
- ccdir -h
- ccdir --help
```

## Installation

### Global Installation

```sh
$ npm install ccdir -g
```

-   makes ccdir executable and module available to any npm project.

### Local Development Installation

```sh
$ npm install ccdir -D
```

-   makes ccdir executable and module available to the local npm project.

### Usage Examples

#### Binary

-   "npm run ccdir -cl target" will recursively remove the contents of target directory
-   "npm run ccdir -cp source target" will recursively copy source directory to the target directory

#### Module

```sh
   const ccdir = require('ccdir');
   const {clean, copy} = ccdir;
```
