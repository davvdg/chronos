define([
  'jquery',
  'views/container/container_parameter_view',
  'components/mixable_view',
  'components/parent_view'
],
function($,
         ContainerParameterView,
         MixableView,
         ParentView) {
	'use strict';

  var ContainerParameterCollectionView = MixableView.extend({
    mixins: {
      collectionViews: ParentView.InstanceMethods
    },
    //tagName: "ul",
    el: '.container-parameter-list',

    events: {      
    },

    initialize: function() {
      //this.header = new ResultsHeaderView();

      this.bindCollectionViews(ContainerParameterView, this.collection).
        listenTo(this, {
          'parentView:afterRenderChildren': this.childrenRendered
        });
    },
    render: function() {
      this.trigger('render');
      return this;
    },
    remove: function() {
      this.unbindCollectionViews();
      return MixableView.prototype.remove.call(this);
    },
    childrenRendered: function() {
      
    },
  });
  return ContainerParameterCollectionView;
});