import {parseWord, word as w, Word} from './word';
import {sumerogramm as sGr} from './sumerogramm';
import {parseSuccess} from '../parser';
import {akkadogramm as aGr} from './akkadogramm';
import {determinative as det} from './determinative';

export interface SuccessfulTestData<T> {
  source: string;
  awaitedResult: T;
}

describe('word', () => {
  test.each<SuccessfulTestData<Word>>([
    // Basic
    {source: 'pár-ši-ia', awaitedResult: w('pár-ši-ia')},
    {source: 'me-ma-i', awaitedResult: w('me-ma-i')},
    {source: 'kat+ta', awaitedResult: w('kat+ta')},

    // Sumerogramm
    {source: 'NINDA', awaitedResult: w(sGr('NINDA'))},
    {source: 'LUGAL', awaitedResult: w(sGr('LUGAL'))},
    {source: 'LUGAL-uš', awaitedResult: w(sGr('LUGAL'), '-uš')},
    {source: 'NINDA.GUR4.RA', awaitedResult: w(sGr('NINDA.GUR4.RA'))},
    {source: 'GIŠ.°D°INANNA', awaitedResult: w(sGr('GIŠ.'), det('D'), sGr('INANNA'))},
    {source: 'DUMU°MEŠ°.É.GAL', awaitedResult: w(sGr('DUMU'), det('MEŠ'), sGr('.É.GAL'))},

    // Akkadogramm
    {source: '_ŠI-PÁT', awaitedResult: w(aGr('ŠI-PÁT'))},

    // Determinativ
    {source: '°MUNUS°', awaitedResult: w(det('MUNUS'))},
    {source: '°MUNUS°ŠU.GI', awaitedResult: w(det('MUNUS'), sGr('ŠU.GI'))},
    {source: 'DINGIR°MEŠ°-aš', awaitedResult: w(sGr('DINGIR'), det('MEŠ'), '-aš')},
    {source: '°m°ḫa-at-tu-ši-li', awaitedResult: w(det('m'), 'ḫa-at-tu-ši-li')},
    {source: '°NA4°ḫu-wa-ši-ia', awaitedResult: w(det('NA₄'), 'ḫu-wa-ši-ia')},
    {source: '°LÚ.MEŠ°MUḪALDIM', awaitedResult: w(det('LÚ.MEŠ'), sGr('MUḪALDIM'))},
    {source: '°m.D°IŠKUR-šar-ru-um-ma', awaitedResult: w(det('m.D'), sGr('IŠKUR'), '-šar-ru-um-ma')}
  ])(
    'should parse "$source" as $awaitedResult',
    ({source, awaitedResult}) => expect(parseWord(source)).toEqual(parseSuccess(awaitedResult))
  );
});
