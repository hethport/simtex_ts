import * as fs from 'fs';
import {TLHParser, OXTED} from '../model/TLHParser';
import {writeNode} from 'simple_xml';
import {StatusLevel} from '../model/StatusLevel';
import {StatusEventCode} from '../model/StatusEventCode';
import { Identifier } from '../model/metadata/Identifier';
import { Status } from '../model/Status';
import { Data } from '../model/data/Data';
import { DataContent } from '../model/data/DataContent';
import { ParagraphLanguage } from '../model/metadata/ParagraphLanguage';


export function test_run(file_name: string) {
  console.log(fs.readFileSync('./debug/' + file_name,'utf8'));

  const parserText: string = fs.readFileSync('./debug/' + file_name,'utf8');
  const parser: TLHParser = new TLHParser(parserText);

  const oxted: OXTED = parser.exportOXTED();

  console.log('Parser status: ' + StatusLevel[oxted.getStatusLevel()]);

  let int = 0;

  for (const line of oxted.getLines()) {
    int = int + 1;
    console.log(int.toString() + ' (status ' + StatusLevel[line.getStatusLevel()] + '): ' + line.getText());

    const parserLine = line.getParserLine();
    if (parserLine instanceof Identifier)
      logStatus('identifier', parserLine.getStatus());
    else if (parserLine instanceof ParagraphLanguage)
      logStatus('paragraph language', parserLine.getStatus());
    else if (parserLine instanceof Data) {
      const content: DataContent | null = parserLine.getContent();
      if (content != null) {
        let index = 0;
        for (const word of content.getWords()) {
          logStatus('word[' + (++index) + ']=' + word.getText(), word.getStatus());
        }
      }
      
    }

    const line_list: string[] = [];
    for (const node of line.getNodes()) {
      line_list.push(writeNode(node, undefined, true).join(''));
    }
    console.log('\t' + line_list.join(''));
  }
}

function logStatus(message: string, status: Status) {
  if (status.getEvents().length > 0 || status.getLevel() != StatusLevel.ok) {
    console.log('\t#Status ' + StatusLevel[status.getLevel()] + ': ' + message);
    for (const event of status.getEvents())
      console.log('\t\t' + StatusLevel[event.getLevel()] + '/' + StatusEventCode[event.getCode()] + ': ' + event.getMessage());
  }
}
