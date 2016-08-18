define([
  'jquery',
  'backbone',
  'underscore',
  'hbs!templates/container/container_parameter_view'
],
function($,
         Backbone,
         _,
         ContainerParameterTpl) {
  'use strict';

  var ContainerParameterView;

  ContainerParameterView = Backbone.View.extend({
    constructor: function ContainerParameterView() {
      Backbone.View.prototype.constructor.apply(this, arguments);
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
      return html;
    }
  });

  return ContainerParameterView;
});
