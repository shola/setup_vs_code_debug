const nodeunit = require('nodeunit');
const {
    parseVersion,
    getRecentNodeVersion,
    createVsCodeConfig
} = require('./config_factory');

exports.suiteParseVersion = function(test) {
    test.expect(3);
    function testParseVersion({ label, versionsStr, expected }) {
        test.equal(
            expected,
            parseVersion(versionsStr),
            `there was an error in parseVersion ${label}`
        );
    }
    const testMock1 = {
        label: 'test 1',
        versionsStr: `
                v7.7.2
                v7.7.3
                v7.7.4
                v7.8.0
                v7.9.0`,
        expected: '7.9.0'
    };
    const testMock2 = {
        label: 'test 2',
        versionsStr: '->      v6.10.0 *   (Latest LTS: Boron)',
        expected: '6.10.0'
    };
    const testMock3 = {
        label: 'test 3',
        versionsStr: `
                N/A
            `,
        expected: 'N/A'
    };

    testParseVersion(testMock1);
    testParseVersion(testMock2);
    testParseVersion(testMock3);

    test.done();
};

exports.suiteGetRecentNodeVersion = function(test) {
    function testGetRecentNodeVersion({ label, customVersion, expected }) {
        return getRecentNodeVersion(customVersion)
            .then(data => {
                test.equal(expected, data, `there was an error in getRecentNodeVersion ${label}`);
                return Promise.resolve(true);
            })
            .catch(e => {
                return Promise.reject(e);
            });
    }

    const testMock1 = {
        label: 'test 1',
        customVersion: 'v8.3.0',
        expected: '8.3.0'
    };
    const testMock2 = {
        label: 'test 2',
        customVersion: '6.10.0',
        expected: '6.10.0'
    };

    const test1Promise = testGetRecentNodeVersion(testMock1);
    const test2Promise = testGetRecentNodeVersion(testMock2);

    Promise.all([test1Promise, test2Promise]).then(values => {
        test.done();
    });

    test.expect(2);
};

exports.suiteCreateVsCodeConfig = function(test) {
    function testCreateVsCodeConfig({ label, version, expected }) {
        createVsCodeConfig(version)
            .then(data => {
                test.equal(expected, data, `there was an error in getRecentNodeVersion ${label}`);
                test.done();
            })
            .catch(err => console.log('there was an error!', err));
    }

    const testMock1 = {
        label: 'test 1',
        version: '6.11.1',
        expected: 'VS Code can now debug this project with nodeJS version "6.11.1"'
    };

    testCreateVsCodeConfig(testMock1);

    test.expect(1);
};
