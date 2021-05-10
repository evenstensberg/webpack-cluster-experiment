#!/usr/bin/env node

if (process.argv.length < 2) {
    console.error("No webpack config file found");
}

const webpackFile = require(process.argv[2]);
const { readFile } = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


let map = {

}

let j = 0;
for (let i = 0; i < numCPUs; i++) {
    map[i] = [webpackFile.pop()];
}

while (webpackFile.length) {
    map[j].push(webpackFile.pop())
    j++
}

if (cluster.isWorker) {
    console.log('I am a worker');
    console.log(cluster.worker.id);
    const importGlobal = require('import-global');
    const {webpack} = importGlobal('webpack');
    map[cluster.worker.id - 1].forEach(async (webpackConfig) => {
        const Compiler = webpack(webpackConfig);
        Compiler.run((err, stats) => {
            console.log(stats.toString())
        })
    })
} else {

    console.log(`Primary ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.setupPrimary({
            silent: false,
        });
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

}