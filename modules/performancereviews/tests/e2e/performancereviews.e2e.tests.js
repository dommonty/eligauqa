'use strict';

describe('Performancereviews E2E Tests:', function () {
  describe('Test Performancereviews page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/performancereviews');
      expect(element.all(by.repeater('performancereview in performancereviews')).count()).toEqual(0);
    });
  });
});
