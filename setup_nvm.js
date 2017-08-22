#!/usr/bin/env node

const fs = require('fs');
const {exec, spawn} = require('child_process');
const customNodeVersion = process.argv[2] || '';

function getRecentNodeVersion() {
    const versionPromise = new Promise((resolve, reject) => {
        const remoteVersions = `source ~/.nvm/nvm.sh && nvm ls-remote ${customNodeVersion}`;
        exec(remoteVersions, function(err, versionsString, stderr) {
            if (stderr) {
                reject(stderr);
            }
            const versionsArray = versionsString.split('\n');   
            const recentVersion = versionsArray[versionsArray.length - 2].trim();                     
            if (recentVersion !== 'N/A') {
                resolve(recentVersion)
            } else {
                reject(`Error: ${customNodeVersion} not found!\nRun 'nvm ls-remote' to confirm your requested version exists.`)
            }      
        });
    });
    return versionPromise;
}

function createVsCodeConfig(version) {
    const vscodeDir = '.vscode';
    const launchFilePath = [vscodeDir, 'launch.json'].join('/');
    const getNodePath = `
    source ~/.nvm/nvm.sh > /dev/null
    echo ${version} > .nvmrc
    nvm use > /dev/null
    which node
    `;

    const used = exec(getNodePath, function(err, localNodePath, stderr) {
        if (stderr.includes('N/A: version')) {
            console.error(stderr);
            return;
        }
        
        const launchFileTemplate = `{
            "version": "0.2.0",
            "configurations": [
                {
                    "type": "node",
                    "request": "launch",
                    "name": "Lanuch to Process",
                    "program": "\$\{file\}",
                    "protocol": "auto",
                    "runtimeExecutable": "${localNodePath.trim()}"
                }
            ]
        }`;
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync('.vscode')
        }
        fs.writeFile(launchFilePath, launchFileTemplate, err => {
            if (err) {
                console.error(err);
            }
            console.log('created a new', launchFilePath);
        });
    });
}

const versionPromise = getRecentNodeVersion();
versionPromise.then(version => {
    createVsCodeConfig(version);
}).catch(err => {
    console.error(err);
});