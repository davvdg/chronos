define([
  'backbone', 
  'underscore',
  'collections/container/container_parameters',
  'collections/container/container_volumes'
  ], function(
    Backbone,
    _,
    ContainerParametersCollection,
    ContainerVolumeCollection
  ) {

  var ContainerModel;

  ContainerModel = Backbone.Model.extend({
    constructor: function ContainerModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    defaults: function() {
      return {
        type:"Docker",
        image:"Ubuntu",
        network: "BRIDGE",
        forcePullImage: true,
        volumes: new ContainerVolumeCollection(),
        parameters: new ContainerParametersCollection(),
      };
    },
    set: function(key, val, options) {
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }
      if (attrs["volumes"]) {
        if (this.attributes.volumes === undefined) {
          this.attributes.volumes = new ContainerVolumeCollection();
        }
        this.attributes.volumes.set(attrs["volumes"], options);
        delete attrs["volumes"];
      }
      if (attrs["parameters"]) {
        if (this.attributes.parameters === undefined) {
          this.attributes.parameters = new ContainerParametersCollection();
        }
        this.attributes.parameters.set(attrs["parameters"], options);
        delete attrs["parameters"];
      }      
      return Backbone.Model.prototype.set.apply(this, [
        attrs,
        options
      ]);
    },
    toJSON: function() {
      var baseJSON = Backbone.Model.prototype.toJSON.apply(this);
      baseJSON.volumes = baseJSON.volumes.toJSON();
      baseJSON.parameters = baseJSON.parameters.toJSON();
      return baseJSON;
    }
  });

  return ContainerModel;
});
