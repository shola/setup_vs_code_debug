# setup_vs_code_debug

[Microsoft Visual Studio Code](https://code.visualstudio.com/) is a great editor
for NodeJS development, and the built in debugger is awesome. *Except* that it
fails to start if you are using the latest versions of NodeJS... if you want to 
use new features like [async/await](http://node.green/#ES2017-features-async-functions), you will like this tool!

### Prerequisites

- [Install Nvm](https://github.com/creationix/nvm)
- [Install Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview)

### Installing

```
npm i -g setup_vs_code_debug
```

## Getting Started

Simply run the following command in any of your NodeJS project directories:
```
node setup_vs_code_debug
```

The above command will configure the second-most-recent version of NodeJS to work
with VS Code's debugger. If you would like to target a different version of NodeJS:
```
node setup_vs_code_debug X.X.X
```

To start debugging, open any of your project JS files in VS Code and hit 
`CMD + F5` on a mac (try `F5` or `CTRL + F5` on other systems).

[How To Debug NodeJS in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)

## Under The Hood
```
.
├── .nvmrc
└── .vscode
    └── launch.json
```
The version of NodeJS you are debugging with in VS Code will be persisted in `.nvmrc`. 
To run your app with that version:
```
cd YOUR_PROJECT_ROOT
nvm use
node YOUR_APP.js
```

Your VS Code Debugger config will be saved in `.vscode/launch.json`.

## Todos
- add unit tests
- add jsdocs

## Authors

* **Mike Situ** - [Github Repos](https://github.com/shola)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Andre Weinand for explaining how to use "runtimeExecutable" in launch.json](https://github.com/Microsoft/vscode/issues/30297)
* [README.md Template](https://gist.githubusercontent.com/PurpleBooth/109311bb0361f32d87a2/raw/824da51d0763e6855c338cc8107b2ff890e7dd43/README-Template.md)