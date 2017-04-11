'use strict';

describe('Customercontacts E2E Tests:', function () {
  describe('Test Customercontacts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/customercontacts');
      expect(element.all(by.repeater('customercontact in customercontacts')).count()).toEqual(0);
    });
  });
});
