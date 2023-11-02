import * as fs from 'fs';
import {TLHParser, OXTED, ParagraphLanguageType, defaultParagraphLanguage} from '../model/TLHParser';
import {XmlElementNode, writeNode} from 'simple_xml';
import {StatusLevel} from '../model/StatusLevel';
import {StatusEventCode} from '../model/StatusEventCode';
import { Identifier } from '../model/metadata/Identifier';
import { Status } from '../model/Status';
import { Data } from '../model/data/Data';
import { DataContent } from '../model/data/DataContent';
import { ParagraphLanguage } from '../model/metadata/ParagraphLanguage';
import { Marker } from '../model/metadata/Marker';
import { Word } from '../model/data/Word';
import { TextEvaluation } from '../model/data/fragment/TextEvaluation';
import { Content } from '../model/data/fragment/Content';
import { UnitTestConstants } from '../unitTest/unitTestConstants';

/**
  * The tools folder.
  */
const toolsFolder = './tools/';

/**
  * The source folder.
  */
const sourceFolder = toolsFolder + 'src/';

/**
  * The target folder.
  */
const targetFolder = toolsFolder + 'tgt/';

export function csv(transliterationFileName: string, outputFileName: string) {
  const parserText: string = fs.readFileSync(sourceFolder + transliterationFileName, 'utf8');
  
  const parser: TLHParser = new TLHParser(parserText);
  const oxted: OXTED = parser.exportOXTED();

  console.log('Parser Status: ' + StatusLevel[oxted.getStatusLevel()]);

  const buffer: string[] = [];
  for (const line of oxted.getLines()) {
	
    const line_list: string[] = [];
    for (const node of line.getNodes()) {
      line_list.push(writeNode(node, {}, true).join(''));
    }
    
    buffer.push(line.getText() + '\t' + (line.getParserLine().isPartPreviousLine() ? UnitTestConstants.joinChar : '') + line_list.join('') + '\n');
  }
  
  fs.writeFileSync(targetFolder + outputFileName, buffer.join(''), 'utf8');
}

export function debug(transliterationFileName: string) {
  const parserText: string = fs.readFileSync(sourceFolder + transliterationFileName, 'utf8');
  
  console.log(parserText);

  const parser: TLHParser = new TLHParser(parserText);
  const oxted: OXTED = parser.exportOXTED();

  console.log('\n*-*-* Parser *-*-*');

  console.log('\nStatus: ' + StatusLevel[oxted.getStatusLevel()]);

  for (const line of oxted.getLines()) {
    console.log(line.getNumber() + ' (status ' + StatusLevel[line.getStatusLevel()] + (line.getParserLine().isPartPreviousLine() ? '/part previous line' : '') + '): ' + line.getText());

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
      line_list.push(writeNode(node, {}, true).join(''));
    }
    console.log('\t' + line_list.join(''));
  }
}

export function word(language: string, word: string) {
  const lang : ParagraphLanguageType =  getLanguage(language);
  const node: XmlElementNode = Word.parseWord(lang, word).exportXml();
  
  let name = ParagraphLanguageType[lang];
    
  if (name == 'Ign')
    name = 'ign';
  
  console.log('language: ' + name);  
  console.log('word: "' + word + '"');
  console.log('\txml: ' + writeNode(node, {}, true).join(''));
}

export function line(language: string, line: string) {
  const lang : ParagraphLanguageType =  getLanguage(language);
  
  let name = ParagraphLanguageType[lang];
    
  if (name == 'Ign')
    name = 'ign';
  
  console.log('language: ' + name);  
  console.log('line: "' + line + '"');
  
  let i = 0;
  for (const entry of Data.parseContent(lang, line).getEntities()) {
    const node: XmlElementNode = entry.exportXml();
    i++;
    console.log('\txml ' + i + ': ' + writeNode(node, {}, true).join(''));
  }
}

function getLanguage(language: string): ParagraphLanguageType {
  let lang: ParagraphLanguageType | null = null;

  try {
    lang = ParagraphLanguageType[language as keyof typeof ParagraphLanguageType];
  
    if (lang == undefined)
      lang = defaultParagraphLanguage();
  } catch (e) {
    lang = defaultParagraphLanguage();
  }

  return lang;
}

function logStatus(message: string, status: Status, word:  Word | null) {
  if (status.getEvents().length > 0 || status.getLevel() != StatusLevel.ok) {
    console.log('\t# Status ' + StatusLevel[status.getLevel()] + ': ' + message);
    for (const event of status.getEvents())
      console.log('\t\t' + StatusLevel[event.getLevel()] + ' / ' + StatusEventCode[event.getCode()] + ': ' + event.getMessage());
  
    if (word != null) {
      for (const fragment of word.getFragments()) 
        if (StatusLevel.ok != fragment.getStatus().getLevel()){
          const text = fragment.getText();
          console.log('\t\t# Fragment ' + StatusLevel[fragment.getStatus().getLevel()] + ': ' + (text == null ? '<<EMPTY>>' : TextEvaluation.unescape(Content.unescape(text))));
          for (const event of fragment.getStatus().getEvents())
            console.log('\t\t\t' + StatusLevel[event.getLevel()] + ' / ' + StatusEventCode[event.getCode()] + ': ' + event.getMessage());
        }
    }
  }
}
