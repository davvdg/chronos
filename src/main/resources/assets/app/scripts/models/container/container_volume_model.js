/* *
 * 
 * Volume Model
 * */



define([
    'backbone', 
    'underscore'
  ], function(
    Backbone,
    _
  ) {

  var VolumeModel;
  
  VolumeModel = Backbone.Model.extend({
    constructor: function VolumeModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },    
    defaults: function() {
      return {
        "containerPath": "",
        "hostPath": "",
        "mode": "RW"
      };
    }
  });
  
  return VolumeModel;
});