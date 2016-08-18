define([
  'backbone', 
  'underscore'
  ], function(
    Backbone,
    _
  ) {

  var FetchModel;

  FetchModel = Backbone.Model.extend({
    constructor: function FetchModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    defaults: function() {
      return {
        "uri": "",
        "executable": false,
        "extract": false,
        "cache":false,
      };
    },
  });

  return FetchModel;
});
