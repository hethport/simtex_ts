import * as fs from 'fs';

export function test_run(file_name: string) {
  console.log(fs.readFileSync('./debug/' + file_name,'utf8'));
}
