'use strict';

describe('Packageofferings E2E Tests:', function () {
  describe('Test Packageofferings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/packageofferings');
      expect(element.all(by.repeater('packageoffering in packageofferings')).count()).toEqual(0);
    });
  });
});
