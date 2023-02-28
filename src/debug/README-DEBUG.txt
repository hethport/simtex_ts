//after making changes to src/debug/debug.ts
npm run build

//run debug script, the last string is a data parameter
npx run-func dist/debug/debug.js test_run "simple_parse_test.txt"

