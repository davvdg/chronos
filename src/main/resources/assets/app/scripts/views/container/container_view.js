/**
 * Job Detail Stats View
 *
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'views/bound_view',
  'hbs!templates/container/container_view',
  'views/container/container_parameters_view',
  'views/container/container_volumes_view',
  'components/configured_rivets',
],
function($,
         Backbone,
         _,
         BoundView,
         ContainerViewTpl,
         ContainerParametersView,
         ContainerVolumesView,
         rivets) {
  'use strict';

  var ContainerView;

  ContainerView = BoundView.extend({
    constructor: function ContainerView() {
      BoundView.prototype.constructor.apply(this, arguments);
    },

    className: 'row-fluid job-detail-view job-detail-container-view',
    template: ContainerViewTpl,

    events: {},

    initialize: function() {
      this.parameterView = new ContainerParametersView({collection:this.model.get("parameters")})
      this.volumeView = new ContainerVolumesView({collection:this.model.get("volumes")})
      this.listenTo(this.model, {
        'change': this.render
      });
      this.addRivets();
    },
    
    render: function() {
      var html = this.template(this.model.toJSON());

      this.$el.html(html);
      this.addRivets();
      this.trigger('render');
      this.parameterView.setElement(this.$('.container-parameter-list')).render();
      this.volumeView.setElement(this.$('.container-volumes-list')).render();  
      

      return this;
    }
  });

  return ContainerView;
});
