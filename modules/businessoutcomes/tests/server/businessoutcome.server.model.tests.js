'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Businessoutcome = mongoose.model('Businessoutcome');

/**
 * Globals
 */
var user, businessoutcome;

/**
 * Unit tests
 */
describe('Businessoutcome Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      businessoutcome = new Businessoutcome({
        name: 'Businessoutcome Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return businessoutcome.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      businessoutcome.name = '';

      return businessoutcome.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Businessoutcome.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
