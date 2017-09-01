import {expect} from 'chai';

import { tabSort, orderByTabIndex} from '../src/utils/tabOrder';

const r = (tabIndex, index, key) => ({tabIndex, index, key});
const order = (data) => data.map(({key})=>key).join(',');

describe('tab order', () => {
  it('should order simple row', () => {
    const row = [
      r(0, 1, 1),
      r(0, 2, 2),
      r(0, 6, 6),
      r(0, 3, 3),
      r(0, 4, 4),
      r(0, 5, 5),
    ];
    const result = row.sort(tabSort);
    expect(order(result)).to.equal('1,2,3,4,5,6')
  });

  it('should use tabIndex', () => {
    const row = [
      r(0, 1, 1),
      r(0, 2, 2),
      r(1, 3, 6),
      r(2, 4, 3),
      r(2, 7, 7),
      r(0, 5, 4),
      r(0, 6, 5),
    ];
    const result = row.sort(tabSort);
    expect(order(result)).to.equal('6,3,7,1,2,4,5')
  });

});