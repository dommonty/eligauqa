'use strict';

describe('Approvals E2E Tests:', function () {
  describe('Test Approvals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/approvals');
      expect(element.all(by.repeater('approval in approvals')).count()).toEqual(0);
    });
  });
});
