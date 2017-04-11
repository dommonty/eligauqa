'use strict';

describe('Squadoutcomes E2E Tests:', function () {
  describe('Test Squadoutcomes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/squadoutcomes');
      expect(element.all(by.repeater('squadoutcome in squadoutcomes')).count()).toEqual(0);
    });
  });
});
