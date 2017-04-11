'use strict';

describe('Squadallocations E2E Tests:', function () {
  describe('Test Squadallocations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/squadallocations');
      expect(element.all(by.repeater('squadallocation in squadallocations')).count()).toEqual(0);
    });
  });
});
