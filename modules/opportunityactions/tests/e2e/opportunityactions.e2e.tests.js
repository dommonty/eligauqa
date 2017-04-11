'use strict';

describe('Opportunityactions E2E Tests:', function () {
  describe('Test Opportunityactions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/opportunityactions');
      expect(element.all(by.repeater('opportunityaction in opportunityactions')).count()).toEqual(0);
    });
  });
});
