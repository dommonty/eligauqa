'use strict';

describe('Opportunitynotes E2E Tests:', function () {
  describe('Test Opportunitynotes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/opportunitynotes');
      expect(element.all(by.repeater('opportunitynote in opportunitynotes')).count()).toEqual(0);
    });
  });
});
