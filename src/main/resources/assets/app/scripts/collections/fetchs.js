/**
 * Uri Collection
 *
 */
define([
  'backbone',
  'underscore',
  'models/fetch',
], function(
  Backbone,
  _,
  FetchModel
) {

  var FetchCollection;
  FetchCollection = Backbone.Collection.extend({
    constructor: function FetchCollection() {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
    }, 
    model:FetchModel
  });
  return FetchCollection;
});