'use strict';

describe('Businessoutcomes E2E Tests:', function () {
  describe('Test Businessoutcomes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/businessoutcomes');
      expect(element.all(by.repeater('businessoutcome in businessoutcomes')).count()).toEqual(0);
    });
  });
});
