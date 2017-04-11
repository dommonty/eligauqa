'use strict';

describe('Reviewrequests E2E Tests:', function () {
  describe('Test Reviewrequests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reviewrequests');
      expect(element.all(by.repeater('reviewrequest in reviewrequests')).count()).toEqual(0);
    });
  });
});
