/**
 * Generic Job Model
 *
 */
define(['backbone', 'underscore', 'models/base_job'],
       function(Backbone, _, BaseJobModel) {

  var JobModel;

  JobModel = BaseJobModel.extend({
    constructor: function JobModel() {
        BaseJobModel.prototype.constructor.apply(this, arguments);
    },
    isNew: function() {
      return true;
    },

    isValid: function() { return false; },

    getWhitelist: function() {
      return ([]).concat(BaseJobModel.getWhitelist());
    },

    hasSchedule: function() {
      return true;
    },

    fetchStats: function() {
      return false;
    }
  });

  return JobModel;
});
