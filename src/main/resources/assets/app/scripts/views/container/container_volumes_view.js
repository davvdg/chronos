define([
  'jquery',
  'views/container/container_volume_view',
  'components/mixable_view',
  'components/parent_view'
],
function($,
         ContainerVolumeView,
         MixableView,
         ParentView) {
	'use strict';

  var ContainerVolumeCollectionView = MixableView.extend({
    mixins: {
      collectionViews: ParentView.InstanceMethods
    },

    el: '.container-parameter-list',

    events: {      
    },

    initialize: function() {
      //this.header = new ResultsHeaderView();

      this.bindCollectionViews(ContainerVolumeView, this.collection).
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
  return ContainerVolumeCollectionView;
});