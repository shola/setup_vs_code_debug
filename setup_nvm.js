#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('child_process');
const customVersion = process.argv[2] || ''; // allows users to enter a specific node version

/**
 * @desc Parse out the most recent version of node available to nvm
 * @param {String} versionsStr - output of "nvm ls-remote --no-colors"
 * @returns {String} - most recent node version
 */
function parseVersion(versionsStr) {
    const semanticVersionRegEx = /\d.\d.\d/;
    const versionsArray = versionsStr.split('\n');
    let version = versionsArray.pop();
    if (!version) {
        // if version is a blank line
        version = versionsArray.pop();
    }
    return version.match(semanticVersionRegEx)[0];
}

/**
 * @name getRecentNodeVersion
 * @desc Finds the most recent version of node available to nvm
 * @returns {Promise} - resolves with the latest version number, or rejects with
 * an error string.
 */
function getRecentNodeVersion() {
    const versionPromise = new Promise((resolve, reject) => {
        const versions = `source ~/.nvm/nvm.sh && nvm ls-remote --no-colors ${customVersion}`;
        exec(versions, function(err, stdout, stderr) {
            if (stderr) {
                reject(stderr);
            }
            const version = parseVersion(stdout);
            if (version !== 'N/A') {
                resolve(version);
            } else {
                reject(`Error: ${customVersion} not found!\nRun 'nvm ls-remote'\
                 to confirm your requested version exists.`);
            }
        });
    });
    return versionPromise;
}

/**
 * @name createVsCodeConfig
 * @desc Creates a VS Code config for debugging against the latest node version
 * @param {String} version - node version number
 */
function createVsCodeConfig(version) {
    const vscodeDir = '.vscode';
    const launchFilePath = [vscodeDir, 'launch.json'].join('/');
    const getNodePath = `source ~/.nvm/nvm.sh
    echo ${version} > .nvmrc
    nvm use > /dev/null
    nvm which ${version}
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
            fs.mkdirSync('.vscode');
        }
        fs.writeFile(launchFilePath, launchFileTemplate, err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Visual Studio Code can now debug with nodeJS', version);
        });
    });
}

getRecentNodeVersion()
    .then(version => {
        createVsCodeConfig(version);
    })
    .catch(err => {
        console.error(err);
    });
