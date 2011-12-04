Sift is a command line utility to rapidly compile Less into static CSS.

### Install

#### Node

Node.js >= 5.0 must be installed. To see which version of Node is installed on your system, open a terminal and type `node -v`. If Node isn't installed on your system download the package-installer for your OS (preferred) or build from source; installers are located at: http://nodejs.org/#download.

#### NPM

Next install the Node Package Manager (NPM). To do so run the following command: `curl http://npmjs.org/install.sh | sh` or `curl http://npmjs.org/install.sh | sudo sh`.

#### Sift

Once you've installed Node and NPM clone the latest stable release from Github, navigate to the "sift" directory in a terminal and type `sudo npm install -g`. This will install Sift globally. You can now do whatever you want with the Sift clone.

### Uninstall

To uninstall Sift run the command: `sudo npm uninstall -g sift`.

-------- ^ Need to update the instructions above ^ --------

### Config

In order to compile CSS, config.json must be present in the directory where you want to execute sift.

#### config.json:

    { "compiler": {
        "css": {
          "input": "./less",
          "output": "./compiled",
          "relation": {
            "base.less": "base.css",
            ...
          }
        }
      }
    }

### Commands

&nbsp;&nbsp;**compile**&nbsp;&nbsp;&nbsp;&nbsp;Invoke the compilers for the specified languages, which happens to only be Less at the moment. 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**-c, --css**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Compile all `.less` files into the corresponding `.css` files defined in config.json.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**-w, --watch**&nbsp;&nbsp;&nbsp;&nbsp;Start watching for changes on all files in the current working directory, and it's children. `ctrl + c` to exit.

&nbsp;&nbsp;**-v, --version**&nbsp;&nbsp;&nbsp;&nbsp;Display the current version of sift.

#### Examples:

`sift compile --css` - Compile `.less` files into `.css` and return control to the user.

`sift compile --css --watch` - Start watching for changes on all less files, compile if any file is directly or indirectly referenced in config.json.