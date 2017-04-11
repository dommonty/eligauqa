'use strict';

describe('Outcomes E2E Tests:', function () {
  describe('Test Outcomes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/outcomes');
      expect(element.all(by.repeater('outcome in outcomes')).count()).toEqual(0);
    });
  });
});
