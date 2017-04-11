'use strict';

describe('Supportplans E2E Tests:', function () {
  describe('Test Supportplans page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/supportplans');
      expect(element.all(by.repeater('supportplan in supportplans')).count()).toEqual(0);
    });
  });
});
