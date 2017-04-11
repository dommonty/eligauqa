'use strict';

describe('Contractterms E2E Tests:', function () {
  describe('Test Contractterms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contractterms');
      expect(element.all(by.repeater('contractterm in contractterms')).count()).toEqual(0);
    });
  });
});
