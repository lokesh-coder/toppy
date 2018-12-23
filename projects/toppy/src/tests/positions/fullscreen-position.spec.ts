import { FullscreenPosition } from '../../lib/position';

describe('@ FullscreenPosition', () => {
  describe('#getPositions', () => {
    it('should return proper position', () => {
      const slidePos = new FullscreenPosition();
      expect(slidePos.getPositions()).toEqual({
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'fixed'
      });
    });
  });
});
