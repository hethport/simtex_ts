import {Type, run} from './unitTest';

describe('TLH dig parser: ' + new Date(), () => {
  test.each(run(Type.jest))(
    '$filename:$line - parser should parse \'$source\' as \'$awaitedResult\'',
    ({awaitedResult, parserResult}) => expect(parserResult).toEqual<string>(awaitedResult)
  );
});
