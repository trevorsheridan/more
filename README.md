Hunter is a command line utility to rapidly compile Less into static CSS.

### Install

#### Node

Node.js >= 5.0 must be installed. To see which version of Node is installed on your system, open a terminal and type `node -v`. If Node isn't installed on your system download the package-installer for your OS (preferred) or build from source; installers are located at: http://nodejs.org/#download.

#### NPM

Next install the Node Package Manager (NPM). To do so run the following command: `curl http://npmjs.org/install.sh | sh` or `curl http://npmjs.org/install.sh | sudo sh`.

#### Hunter

Once you've installed Node and NPM clone the latest stable release from Github, navigate to the "hunter" directory in a terminal and type "npm install -g". This will install Hunter globally. You can now do whatever you want with the hunter clone.

### Uninstall

To uninstall Hunter run the command: `npm uninstall -g hunter`.

### CSS

#### config.json

In order to compile CSS a config.json file must be present in the directory where you want to run the CSS compiler. An example is provided:

    { "compiler": {
        "css": {
          "input": "./less",
          "output": "./compiled",
          "relation": {
            "base.less": "base.css"
          }
        }
      }
    }

#### Commands

Compile CSS: `hunter compile --css` or `hunter compile -c`

Watch for changes and compile CSS (coming soon): `hunter compile --css --hunt` or `hunter compile -chu`