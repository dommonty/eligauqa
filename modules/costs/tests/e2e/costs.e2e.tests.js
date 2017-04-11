'use strict';

describe('Costs E2E Tests:', function () {
  describe('Test Costs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/costs');
      expect(element.all(by.repeater('cost in costs')).count()).toEqual(0);
    });
  });
});
