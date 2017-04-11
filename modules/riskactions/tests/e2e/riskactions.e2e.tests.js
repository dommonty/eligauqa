'use strict';

describe('Riskactions E2E Tests:', function () {
  describe('Test Riskactions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/riskactions');
      expect(element.all(by.repeater('riskaction in riskactions')).count()).toEqual(0);
    });
  });
});
