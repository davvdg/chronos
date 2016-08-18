/**
 * Container Volumes Collection
 *
 */
define([
  'backbone',
  'underscore',
  'models/container/container_volume_model',
], function(
  Backbone,
  _,
  ContainerVolumeModel
) {

  var ContainerVolumeCollection;

  ContainerVolumeCollection = Backbone.Collection.extend({
    constructor: function ContainerVolumeCollection() {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
    },     
    model:ContainerVolumeModel
  });

  return ContainerVolumeCollection;
});