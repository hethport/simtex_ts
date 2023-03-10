import * as fs from 'fs';
import {TLHParser, OXTED} from '../model/TLHParser';
import {writeNode} from 'simple_xml';
import {StatusLevel} from '../model/StatusLevel';

/**
  * The unit-test folder.
  */
const unitTestFolder = './unitTest/';

/**
  * The pattern for unit-test filenames.
  */
const patternUnitTestFilenames = new RegExp('(.ut)$');
  
export function unitTest() {
  const filenames = fs.readdirSync(unitTestFolder, 'utf8').sort();
  
  console.log('Directory: ' + unitTestFolder);
  for (const filename of filenames)
    if (filename.match(patternUnitTestFilenames)) {
      console.log('Unit-Test file: ' + filename);

      const lines: string[] = fs.readFileSync(unitTestFolder + filename, 'utf8').replace(/\r/g, '').split('\n');
      
      const sourceText : string[] = [];
      const targetLines : string[] = [];
      
      let number = 1;
      for (const line of lines) {
        if (line.trim().length > 0) {
          const split: string[] = line.split('\t');
          if (split.length != 2)
            console.warn('\tIgnored line ' + number + ': expected two elements but read ' + split.length + '.');
          else if (split[0].trim().length == 0)
            console.warn('\tIgnored line ' + number + ': source element ist empty.');
          else {
            sourceText.push(split[0]);
            targetLines.push(split[1]);
          }
        }
        
        number++;
      }
      
      if (sourceText.length == 0)
        console.warn('\tIgnored Unit-Test file: no data available.');
      else
        testParser(filename, sourceText.join('\n'), targetLines);
    }
}

function testParser(filename: string, parserText: string, targetLines : string[]) {
  const parser: TLHParser = new TLHParser(parserText);
  const oxted: OXTED = parser.exportOXTED();

  console.log('\tParser Status: ' + StatusLevel[oxted.getStatusLevel()]);
  
  let index = 0;
  for (const line of oxted.getLines()) {
    const line_list: string[] = [];
    
    for (const node of line.getNodes())
      line_list.push(writeNode(node, undefined, true).join(''));
      
    if (targetLines[index] != line_list.join('')) {
      console.error('\tError (' + filename + ':' + (index + 1) + '): ' + line.getText());
      console.error('\t\tWait:   ' + targetLines[index]);
      console.error('\t\tParser: ' + line_list.join(''));
    }
    
    index++;
  }
  
}
