# SimTex Unit-Test

This documentation explains how to run the SimTex Unit-Test.
To install the application, please read the main README.

## Build the application

The following command builds the application in the `dist` folder. 

```bash
npm run build
```

## Test data

The tests are performed using all files with the extension `.ut` in the folder `unitTest` sorted by name.
The format of these files is csv (tab-delimited), where the first element is the source and the second is the expected result.

## Operation mode

The tests can be performed in two ways:

### Traditional

The JavaScript Testing Framework `jest` is used to perform the tests.

```bash
npm run test
```

### Terminal

The tests are performed and the parser status with the test errors are output in the console.

```bash
npx run-func dist/unitTest/unitTest.js term
```

