'use strict';
var Vacation = require('../models/vacation'),
    moment   = require('moment'),
    mp       = require('multiparty');
exports.init = function(req, res){
  res.render('vacations/new');
};

exports.create = function(req, res){
  var vacation = new Vacation(req.body);
  console.log(req.body.start);
  vacation.save(function(){
    console.log(vacation);
    res.redirect('/vacations');
  });
};

exports.index = function(req, res){
  Vacation.all(function(err, vacations){
    console.log(typeof vacations.end);
    res.render('vacations/index', {vacations:vacations, moment:moment});
  });
};

exports.show = function(req, res){
  Vacation.findById(req.params.id, function(err, vacation){
    console.log(vacation);
    res.render('vacations/show', {vacation:vacation, moment:moment});
  });
};

exports.downloadPhoto = function(req, res){
  Vacation.findById(req.params.id, function(err, vacation){
    vacation.downloadPhoto(req.body.photo, function(){
      res.redirect('/vacations/' + req.params.id);
    });
  });
};

exports.uploadPhoto = function(req, res){
  Vacation.findById(req.params.id, function(err, vacation){
    var form = new mp.Form();
    form.parse(req, function(err, fields, files){
      vacation.uploadPhoto(files, function(){
        res.redirect('/vacations/' + req.params.id);
      });
    });
  });
};
