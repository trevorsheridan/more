Amass is a command line utility to rapidly compile Less into static CSS.

### Install

#### Node

Node.js >= 5.0 must be installed. To see which version of Node is installed on your system, open a terminal and type `node -v`. If Node isn't installed on your system download the package-installer for your OS (preferred) or build from source; installers are located at: http://nodejs.org/#download.

#### NPM

Next install the Node Package Manager (NPM). To do so run the following command: `curl http://npmjs.org/install.sh | sh` or `curl http://npmjs.org/install.sh | sudo sh`.

#### Amass

Once you've installed Node and NPM clone the latest stable release from Github, navigate to the "amass" directory in a terminal and type "npm install -g". This will install Amass globally. You can now do whatever you want with the amass clone.

### Uninstall

To uninstall Amass run the command: `npm uninstall -g amass`.

### Commands

To compile CSS: `amass compile --css` or `amass compile -c`

To compile CSS and watch for changes: `amass compile --css --watch` or `amass compile -cw`