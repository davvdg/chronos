/**
 * Container Parameters Collection
 *
 */
define([
  'backbone',
  'underscore',
  'models/container/container_parameter_model'
], function(
  Backbone,
  _,
  ContainerParameterModel
) {

  var ContainerParameterCollection;

  ContainerParameterCollection = Backbone.Collection.extend({
    constructor: function ContainerParameterCollection() {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
    },   
    model:ContainerParameterModel
  });

  return ContainerParameterCollection;
});