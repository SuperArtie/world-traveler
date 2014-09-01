/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Vacation  = require('../../app/models/vacation'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'world-traveler';

describe('Vacation', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Vacation object', function(){
      var p = new Vacation('Name', '04/11/2014', '04/12/2014', '12', '13', ['photo.png']);
      expect(p).to.be.instanceof(Vacation);
    });
  });

  describe('.all', function(){
    it('should get all people', function(done){
      Vacation.all(function(err, vacations){
        expect(vacations).to.have.length(2);
        done();
      });
    });
  });
});

