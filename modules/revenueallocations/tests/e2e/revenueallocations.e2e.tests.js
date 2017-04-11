'use strict';

describe('Revenueallocations E2E Tests:', function () {
  describe('Test Revenueallocations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/revenueallocations');
      expect(element.all(by.repeater('revenueallocation in revenueallocations')).count()).toEqual(0);
    });
  });
});
