import {parseWord} from './word';

describe('word', () => {
  it('should parse words', () => {

    const x = parseWord('');

    expect(x).toEqual('');
  });
});
