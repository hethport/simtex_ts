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

export enum Type {
  term, jest
}

export interface TestData {
  filename: string;
  line: number;
  source: string;
  awaitedResult: string;
  parserResult: string;
}

export function term() {
  run(Type.term);
}
 
export function run(type: Type): TestData[] {
  if (type == Type.term)
    console.log('Directory: ' + unitTestFolder);
  
  const filenames = fs.readdirSync(unitTestFolder, 'utf8').sort();
  
  let testData: TestData[] = [];
  
  for (const filename of filenames)
    if (filename.match(patternUnitTestFilenames)) {
      if (type == Type.term)
        console.log('Unit-Test file: ' + filename);

      const lines: string[] = fs.readFileSync(unitTestFolder + filename, 'utf8').replace(/\r/g, '').split('\n');
      
      const sourceText : string[] = [];
      const targetLines : string[] = [];
      
      let number = 1;
      for (const line of lines) {
        if (line.trim().length > 0) {
          const split: string[] = line.split('\t');
          if (split.length != 2) {
            if (type == Type.term)
              console.warn('\tIgnored line ' + number + ': expected two elements but read ' + split.length + '.');
          } else if (split[0].trim().length == 0) {
            if (type == Type.term)
              console.warn('\tIgnored line ' + number + ': source element ist empty.');
          } else {
            sourceText.push(split[0]);
            targetLines.push(split[1]);
          }
        }
        
        number++;
      }
      
      if (sourceText.length == 0) {
        if (type == Type.term)
          console.warn('\tIgnored Unit-Test file: no data available.');
      } else
        testData = testData.concat(testParser(type, filename, sourceText.join('\n'), targetLines));
    }
    
  return testData;
}

function testParser(type: Type, filename: string, parserText: string, targetLines : string[]): TestData[] {
  const parser: TLHParser = new TLHParser(parserText);
  const oxted: OXTED = parser.exportOXTED();

  if (type == Type.term)
    console.log('\tParser Status: ' + StatusLevel[oxted.getStatusLevel()]);
  
  const testData: TestData[] = [];
  let erros = 0;
  
  let index = 0;
  for (const line of oxted.getLines()) {
    const line_list: string[] = [];
    
    for (const node of line.getNodes())
      line_list.push(writeNode(node, undefined, true).join(''));
      
    testData.push({filename: filename, line: (index + 1), source: line.getText(), awaitedResult: targetLines[index], parserResult: line_list.join('')});
    
    if (type == Type.term) {
      if (targetLines[index] != line_list.join('')) {
        erros++;
        
        console.error('\tError (' + filename + ':' + (index + 1) + '): ' + line.getText());
        console.error('\t\tWait:   ' + targetLines[index]);
        console.error('\t\tParser: ' + line_list.join(''));
      }
    }
    
    index++;
  }
  
  if (type == Type.term) {
    if (erros == 0)
      console.log('\tNo error found.');
    else
      console.error('\tNumber of errors: ' + erros);
  }
  
  return testData;
}
