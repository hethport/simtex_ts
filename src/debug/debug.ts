import * as fs from 'fs';
import {TLHParser, OXTED} from '../model/TLHParser';
import {writeNode} from 'simple_xml';
import {StatusLevel} from '../model/StatusLevel';
import {StatusEventCode} from '../model/StatusEventCode';


export function test_run(file_name: string) {
  console.log(fs.readFileSync('./debug/' + file_name,'utf8'));

  const parserText: string = fs.readFileSync('./debug/' + file_name,'utf8');
  const parser: TLHParser = new TLHParser(parserText);

  const oxted: OXTED = parser.exportOXTED();

  console.log('PARSER STATUS:\t' + StatusLevel[oxted.getStatusLevel()]);

  let int = 0;

  for (const line of oxted.getLines()) {
    int = int + 1;
    console.log(int.toString() + ':\t' + StatusLevel[line.getStatus().getLevel()]);

    for (const event of line.getStatus().getEvents()) {
      console.log('\t' + StatusLevel[event.getLevel()] + '/' + StatusEventCode[event.getCode()] + ':  ' + event.getMessage());
    }

    const line_list: string[] = [];
    for (const node of line.getNodes()) {
      line_list.push(writeNode(node).join(''));
    }
    console.log('\t\t' + line_list.join(''));
  }
}
