'use strict';

describe('Businessunits E2E Tests:', function () {
  describe('Test Businessunits page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/businessunits');
      expect(element.all(by.repeater('businessunit in businessunits')).count()).toEqual(0);
    });
  });
});
