# webpack-cluster-experiment


## Installation

```console
npm install -g webpack-cluster-experiment
```

## Usage

```console
threading ./webpack.config.js
```


## Example webpack config

```js
module.exports = [
    {
        entry: './test1.js'
    },
    {
        entry: './test2.js'
    },
    {
        entry: './test3.js'
    },
    {
        entry: './test4.js'
    },
    {
        entry: './test5.js'
    },
]
```