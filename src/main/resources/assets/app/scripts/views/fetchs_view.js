define([
  'jquery',
  'views/fetch_view',
  'components/mixable_view',
  'components/parent_view'
],
function($,
         FetchView,
         MixableView,
         ParentView) {
  'use strict';

  var FetchCollectionView = MixableView.extend({
    mixins: {
      collectionViews: ParentView.InstanceMethods
    },

    el: '.fetch-list-view',

    events: {      
    },

    initialize: function() {
      //this.header = new ResultsHeaderView();

      this.bindCollectionViews(FetchView, this.collection).
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
  return FetchCollectionView;
});