'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Packageoffering = mongoose.model('Packageoffering');

/**
 * Globals
 */
var user, packageoffering;

/**
 * Unit tests
 */
describe('Packageoffering Model Unit Tests:', function() {
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
      packageoffering = new Packageoffering({
        name: 'Packageoffering Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return packageoffering.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      packageoffering.name = '';

      return packageoffering.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Packageoffering.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
