define([
  'jquery',
  'backbone',
  'underscore',
  'views/bound_view',
  'hbs!templates/container/container_parameter_view'
],
function($,
         Backbone,
         _,
         BoundView,
         ContainerParameterTpl) {
  'use strict';

  var ContainerParameterView;

  ContainerParameterView = BoundView.extend({
    constructor: function ContainerParameterView() {
      BoundView.prototype.constructor.apply(this, arguments);
    },

    template: ContainerParameterTpl,

    events: {},

    initialize: function() {
      this.listenTo(this.model, {
        'change': this.render
      });
    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      this.trigger('render');

      return this;
    },
    toHTML: function() {
      var data = this.model.toJSON(),
          html = this.template(data);
      this.addRivets();
      return html;
    }
  });

  return ContainerParameterView;
});
