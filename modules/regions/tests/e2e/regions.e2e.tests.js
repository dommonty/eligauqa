'use strict';

describe('Regions E2E Tests:', function () {
  describe('Test Regions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/regions');
      expect(element.all(by.repeater('region in regions')).count()).toEqual(0);
    });
  });
});
