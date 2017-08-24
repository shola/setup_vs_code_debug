#!/usr/bin/env node
const {
    parseVersion,
    getRecentNodeVersion,
    createVsCodeConfig
} = require('./config_factory');
const customVersion = process.argv[2] || ''; // allows users to enter a specific node version

getRecentNodeVersion(customVersion)
    .then(version => {
        createVsCodeConfig(version).then(msg => console.log(msg));
    })
    .catch(err => {
        console.error(err);
    });
