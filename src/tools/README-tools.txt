//install dependencies
npm i

//build the system
npm run build

// Debug
//run debug script, the last string is a data parameter - the data files are located in the debug folder
npx run-func dist/tools/debug.js test_run simple_parse_test.txt
npx run-func dist/tools/debug.js test_run baier_test.txt

