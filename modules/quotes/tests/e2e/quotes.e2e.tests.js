'use strict';

describe('Quotes E2E Tests:', function () {
  describe('Test Quotes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/quotes');
      expect(element.all(by.repeater('quote in quotes')).count()).toEqual(0);
    });
  });
});
