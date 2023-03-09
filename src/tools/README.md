# SimTex Typescript tools

This documentation explains how to run the SimTex Typescript tools.
All commands are executed in the home folder of the application.

To install the application, please read the main README.

## Build the application
The following command will build the application into `dist` folder. 

```bash
npm run build
```

The tools scripts are located in the `dist/tools` folder.

## Debug the application

The `dist/tools/debug.js` script can be used to debug the application.
For this purpose, call the `main` function with a transliteration file.
The home folder for the transliteration files is `debug`.
For example:

```bash
npx run-func dist/tools/debug.js main simple_transliteration.txt
```
