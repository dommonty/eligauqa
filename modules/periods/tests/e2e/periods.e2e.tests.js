'use strict';

describe('Periods E2E Tests:', function () {
  describe('Test Periods page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/periods');
      expect(element.all(by.repeater('period in periods')).count()).toEqual(0);
    });
  });
});
