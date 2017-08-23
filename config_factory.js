const fs = require('fs');
const { exec } = require('child_process');
const customVersion = process.argv[2] || ''; // allows users to enter a specific node version

/**
 * @desc Parse out the most recent version of node available to nvm. It may be
 * possible that the last line in versionStr is "N/A" if version is invalid.
 * @param {String} versionsStr - output of "nvm ls-remote --no-colors ${version}"
 * @returns {String} - most recent node version, or "N/A"
 */
function parseVersion(versionsStr) {
    const semanticVersionRegEx = /\d+.\d+.\d+/;
    const versionsArray = versionsStr.split('\n');
    let version = versionsArray.pop().trim();
    if (!version) {
        // if version is a blank line
        version = versionsArray.pop().trim();
    }
    const matchGroup = version.match(semanticVersionRegEx);
    return matchGroup ? matchGroup[0] : version;
}

/**
 * @name getRecentNodeVersion
 * @desc Finds the most recent version of node available to nvm
 * @returns {Promise} - resolves with the latest version number, or rejects with
 * an error string.
 */
function getRecentNodeVersion(customVersion) {
    const versionPromise = new Promise((resolve, reject) => {
        const versions = `source ~/.nvm/nvm.sh && nvm ls-remote --no-colors ${customVersion}`;
        exec(versions, function(err, stdout, stderr) {
            if (err) {
                let msg = `${err.message}\
                    \nMake sure you are connected to the internet.`;
                if (customVersion) {
                    msg += `\nVerify that "${customVersion}" is a valid nodeJS version.`;
                }
                reject(msg);
            }
            // is it safe to assume that parseVersion will never return N/A????
            const version = parseVersion(stdout);
            if (version !== 'N/A') {
                resolve(version);
            } else {
                const msg = `Error: nodeJS version "${customVersion}" not found!\
                    \nRun 'nvm ls-remote'\to confirm your requested version exists.`;
                reject(msg);
            }
        });
    });
    return versionPromise;
}

/**
 * @name createVsCodeConfig
 * @desc Creates a VS Code config for debugging against the latest node version.
 * @param {String} version - node version number
 * @returns {Promised} - will resolve to a success launch.json created message, or 
 * reject with the error message.
 */
function createVsCodeConfig(version) {
    const vscodeDir = '.vscode';
    const launchFilePath = [vscodeDir, 'launch.json'].join('/');
    const getNodePath = `source ~/.nvm/nvm.sh\
    \necho ${version} > .nvmrc\
    \nnvm use > /dev/null\
    \nnvm which ${version}`;
    const configPromise = new Promise((resolve, reject) => {
        exec(getNodePath, function(err, localNodePath, stderr) {
            if (err) {
                reject(err.message);
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
                    reject(err.message);
                } else {
                    resolve(`VS Code can now debug with this project with nodeJS "${version}"`);
                }
            });
        });
    });
    return configPromise;
}

module.exports = {
    parseVersion,
    getRecentNodeVersion,
    createVsCodeConfig
};
