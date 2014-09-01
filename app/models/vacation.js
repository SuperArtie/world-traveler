'use strict';
var Mongo = require('mongodb'),
    _     = require('lodash'),
    cp    = require('child_process'),
    fs    = require('fs'),
    path  = require('path');
/******************
 * CONSTRUCTOR    *
 ******************/
function Vacation(o){
  this.name   = o.name;
  this.start  = new Date(o.start);
  this.end    = new Date(o.end);
  this.lat    = parseFloat(o.lat);
  this.lng    = parseFloat(o.lng);
  this.photos = [];
}

/******************
 * GETTER         *
 ******************/
Object.defineProperty(Vacation, 'collection', {
  get: function(){return global.mongodb.collection('vacations');}
});


/******************
 * SAVE           *
 ******************/
Vacation.prototype.save = function(cb){
  Vacation.collection.save(this, cb);
};

/***************
 * FIND BY ID  *
 ***************/
Vacation.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Vacation.collection.findOne({_id:_id}, function(err, obj){
    var vacation = changePrototype(obj);
    cb(null, vacation);
  });
};

/******************
 * FIND ALL       *
 ******************/
Vacation.all = function(cb){
  Vacation.collection.find().toArray(cb);
};

/*********************
 * DOWNLOAD PHOTO    *
 *********************/
Vacation.prototype.downloadPhoto = function(url, cb){
  var extensions = url.split('.'),
      extension  = extensions[extensions.length-1],
      directory  = this._id,
      file       = this.photos.length + '.' + extension,
      self       = this;
  cp.execFile(__dirname + '/../scripts/download.sh', [url, file, directory], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      var photo      = '/img/' + directory + '/' + file;
      self.photos.push(photo);
      Vacation.collection.save(self, cb);
  });
};

/*********************
 * UPLOAD PHOTO    *
 *********************/
Vacation.prototype.uploadPhoto = function(files, cb){
  var dir   = __dirname + '/../static/img/' + this._id,
      exist = fs.existsSync(dir),
      self  = this;
  if(!exist){
    fs.mkdirSync(dir);
  }
  files.photos.forEach(function(photo){
    var ext      = path.extname(photo.path),
        relative = '/img/' + self._id + '/' + self.photos.length + ext,
        absolute = dir + '/' + self.photos.length + ext;
    fs.renameSync(photo.path, absolute);
    self.photos.push(relative);
  });
  Vacation.collection.save(self, cb);
};

module.exports = Vacation;

/*********************
 * CHANGE PROTOTYPES *
 *********************/
function changePrototype(obj){
  var vacation = _.create(Vacation.prototype, obj);
  return vacation;
}
