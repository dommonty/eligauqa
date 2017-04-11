'use strict';

describe('Costallocations E2E Tests:', function () {
  describe('Test Costallocations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/costallocations');
      expect(element.all(by.repeater('costallocation in costallocations')).count()).toEqual(0);
    });
  });
});
