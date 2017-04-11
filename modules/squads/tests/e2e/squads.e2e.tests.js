'use strict';

describe('Squads E2E Tests:', function () {
  describe('Test Squads page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/squads');
      expect(element.all(by.repeater('squad in squads')).count()).toEqual(0);
    });
  });
});
