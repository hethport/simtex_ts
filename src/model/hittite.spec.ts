import {parseSuccess} from '../parser';
import {SuccessfulTestData} from './word.spec';
import {XmlText, xmlText} from '../xmlModel';
import {parseHittite} from './hittite';

describe('hittite', () => {
  test.each<SuccessfulTestData<XmlText>>([
    {source: 'pár-ši-ia', awaitedResult: xmlText('pár-ši-ia')},
    {source: 'me-ma-i', awaitedResult: xmlText('me-ma-i')}
  ])(
    'should parse "$source" as $awaitedResult',
    ({source, awaitedResult}) => expect(parseHittite(source)).toEqual(parseSuccess(awaitedResult))
  );
});
