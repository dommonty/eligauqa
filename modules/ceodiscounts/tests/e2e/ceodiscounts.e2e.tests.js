'use strict';

describe('Ceodiscounts E2E Tests:', function () {
  describe('Test Ceodiscounts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ceodiscounts');
      expect(element.all(by.repeater('ceodiscount in ceodiscounts')).count()).toEqual(0);
    });
  });
});
