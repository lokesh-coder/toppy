/// <reference types="karma-viewport" />

import { SlidePlacement } from '../../lib/models';
import { SlidePosition } from '../../lib/position';

describe('@ SlidePosition', () => {
  describe('#getPositions', () => {
    it('should return proper position when placement is left', () => {
      const slidePos = new SlidePosition({
        width: 200,
        placement: SlidePlacement.LEFT
      });
      expect(slidePos.getPositions()).toEqual({
        left: 0,
        top: 0,
        width: 200,
        height: '100%',
        position: 'fixed',
        extra: SlidePlacement.LEFT
      });
    });
    it('should return proper position when placement is right', () => {
      const slidePos = new SlidePosition({
        width: '500',
        placement: SlidePlacement.RIGHT
      });
      expect(slidePos.getPositions()).toEqual({
        right: 0,
        top: 0,
        width: '500',
        height: '100%',
        position: 'fixed',
        extra: SlidePlacement.RIGHT
      });
    });
  });
});
