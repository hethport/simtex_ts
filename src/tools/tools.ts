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
import { Marker } from '../model/metadata/Marker';
import { Word } from '../model/data/Word';


export function main(file_name: string) {
  console.log(fs.readFileSync('./debug/' + file_name,'utf8'));

  const parserText: string = fs.readFileSync('./debug/' + file_name,'utf8');
  const parser: TLHParser = new TLHParser(parserText);

  const oxted: OXTED = parser.exportOXTED();

  console.log('Parser status: ' + StatusLevel[oxted.getStatusLevel()]);

  for (const line of oxted.getLines()) {
    console.log(line.getNumber() + ' (status ' + StatusLevel[line.getStatusLevel()] + '): ' + line.getText());

    const parserLine = line.getParserLine();
    if (parserLine instanceof Identifier)
      logStatus('identifier', parserLine.getStatus(), null);
    else if (parserLine instanceof Marker)
      logStatus('marker', parserLine.getStatus(), null);
    else if (parserLine instanceof ParagraphLanguage)
      logStatus('paragraph language', parserLine.getStatus(), null);
    else if (parserLine instanceof Data) {
      const content: DataContent | null = parserLine.getContent();
      if (content != null) {
        let index = 0;
        for (const word of content.getWords()) {
          logStatus('word[' + (++index) + ']=' + word.getText(), word.getStatus(), word);
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

function logStatus(message: string, status: Status, word:  Word | null) {
  if (status.getEvents().length > 0 || status.getLevel() != StatusLevel.ok) {
    console.log('\t# Status ' + StatusLevel[status.getLevel()] + ': ' + message);
    for (const event of status.getEvents())
      console.log('\t\t' + StatusLevel[event.getLevel()] + ' / ' + StatusEventCode[event.getCode()] + ': ' + event.getMessage());
  
    if (word != null) {
      for (const fragment of word.getFragments()) 
        if (StatusLevel.ok != fragment.getStatus().getLevel()){
          console.log('\t\t# Fragment ' + StatusLevel[fragment.getStatus().getLevel()] + ': ' + fragment.getText());
          for (const event of fragment.getStatus().getEvents())
            console.log('\t\t\t' + StatusLevel[event.getLevel()] + ' / ' + StatusEventCode[event.getCode()] + ': ' + event.getMessage());
        }
    }
  }
}
