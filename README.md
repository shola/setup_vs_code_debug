# setup_vs_code_debug
[Microsoft Visual Studio Code](https://code.visualstudio.com/) is a great editor
for NodeJS development, and the built in debugger is awesome. *Except* that it
fails to start if you are using the latest versions of NodeJS... if you want to 
use new features like [async/await](http://node.green/#ES2017-features-async-functions), you will like this tool!

![Debugging in Visual Studio Code](https://code.visualstudio.com/images/javascript_debug_data_inspection.gif)
### Prerequisites

- [Install NVM (Node Version Manager)](https://github.com/creationix/nvm)
- [Install Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview)

### Installing
```
npm i -g setup_vs_code_debug
```
## Getting Started
Run these commands in your terminal:
```
cd <YOUR_PROJECT_DIR>
setup_vs_code_debug
```
The above command will configure the the most version of NodeJS to work with VS Code's 
debugger. If you would like to target a different version of NodeJS:
```
setup_vs_code_debug X.X.X
```
To start debugging, open any of your project JS files in VS Code and hit 
`FN + F5` on a mac (try `F5` or `WIN + F5` on other systems).

[How To Debug NodeJS in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)
## Under The Hood
```
.
├── .nvmrc
└── .vscode
    └── launch.json
```
The version of NodeJS you are debugging with in VS Code will be persisted in `.nvmrc`. 
To run your app with that version, type this into your terminal:
```
cd <YOUR_PROJECT_DIR>
nvm use
node <YOUR_JS_FILE>
```
Your VS Code Debugger config will be saved in `.vscode/launch.json`.
### Uninstalling
You can safely remove `setup_vs_code_debug` at any time, and your VS code configs will 
still be saved.
```
npm uninstall -g setup_vs_code_debug
```
## Todos
- add unit tests

## Author
* **Mike Situ** - [Github Repos](https://github.com/shola)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* [Andre Weinand for explaining how to use "runtimeExecutable" in launch.json](https://github.com/Microsoft/vscode/issues/30297)
* [README.md Template](https://gist.githubusercontent.com/PurpleBooth/109311bb0361f32d87a2/raw/824da51d0763e6855c338cc8107b2ff890e7dd43/README-Template.md)