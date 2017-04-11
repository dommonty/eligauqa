'use strict';

describe('Outcometeams E2E Tests:', function () {
  describe('Test Outcometeams page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/outcometeams');
      expect(element.all(by.repeater('outcometeam in outcometeams')).count()).toEqual(0);
    });
  });
});
