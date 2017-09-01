import {expect} from 'chai';

import {newFocus} from '../src/utils/focusMerge';

describe('focus Merge order', () => {
  it('should move from start to end', () => {
    // cycle via left
    expect(newFocus([2, 3, 4], [1, 2, 3, 4, 5], 1, 2)).to.be.equal(2);
  });

  it('should move from end to start', () => {
    // cycle via left
    expect(newFocus([2, 3, 4], [1, 2, 3, 4, 5], 5, 4)).to.be.equal(0);
  });

  it('should keep direction of move', () => {
    // cycle via left
    expect(newFocus([2, 4, 6], [1, 2, 3, 4, 5, 6], 5, 4)).to.be.equal(2);
  });

  it('should jump back', () => {
    // jump back
    expect(newFocus([2,3,4],[1,2,3,4,5],1,4)).to.be.equal(2);
    // jump back
    expect(newFocus([2,3,4],[1,2,3,4,5],1,3)).to.be.equal(1);
  });


});