# SimTex tools

This documentation explains how to run the SimTex tools `dist/tools/tools.js`.
To install the application, please read the main README.

## Build the application

The following command builds the application in the `dist` folder. 

```bash
npm run build
```

## Synopsis

### Traditional usage
 
```bash
npx run-func dist/tools/tools.js {csv|debug} {FILE...}
```

### Note

The command is executed in the home folder of the application.
The source folder for the files is relative to `tools/src` and the folder for the target files is relative to `tools/tgt`.

### Description

The tool parses a transliteration file and can be used to create a csv file or debug the application.

### Operation mode

The options listed in the table below tell SimTex tools what operation it is to perform.
Exactly one of them must be given.

#### csv
Exports the parser results in csv format (tab-delimited).
The first column is the transliteration line and the second column is the respective xml result of the parser.
The arguments provide the names of the transliteration file and the name of the destination csv file.
For example:

```bash
npx run-func dist/tools/tools.js csv parser-test-cases.txt parser-test-cases.csv
```

The csv output file is `tools/tgt/parser-test-cases.csv`.

#### debug
Debugs the parser.
The Argument is the transliteration filename.
For example:

```bash
npx run-func dist/tools/tools.js debug parser-test-cases.txt
```

The debug results are printed on the standard output.
