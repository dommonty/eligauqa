'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Squadallocation = mongoose.model('Squadallocation');

/**
 * Globals
 */
var user, squadallocation;

/**
 * Unit tests
 */
describe('Squadallocation Model Unit Tests:', function() {
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
      squadallocation = new Squadallocation({
        name: 'Squadallocation Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return squadallocation.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      squadallocation.name = '';

      return squadallocation.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Squadallocation.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
