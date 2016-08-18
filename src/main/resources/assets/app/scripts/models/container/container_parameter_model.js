define([
    'backbone',
    'underscore'
  ], function(
    Backbone,
    _
  ) {

  var ParameterModel;

  ParameterModel = Backbone.Model.extend({
    constructor: function ParameterModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    defaults: function() {
      return {
        "key": "",
        "value":""
      };
    }
  });

  return ParameterModel;
});
