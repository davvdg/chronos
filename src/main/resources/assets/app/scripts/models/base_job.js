/**
 * Base Job Model
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'moment',
  'validations/base_job',
  'collections/fetchs',
  'models/container/container_model'
],function(
  $, 
  Backbone, 
  _, 
  moment, 
  BaseJobValidations, 
  FetchCollection, 
  ContainerModel
) {

  'use strict';

  var slice = Array.prototype.slice,
      BaseWhiteList,
      BaseJobModel;

  function Route() {
    var args = slice.call(arguments),
        encoded;

    encoded = _.map(args, function(arg) { return encodeURIComponent(arg); });
    return encoded.join('/');
  }

  BaseWhiteList = [
    'name', 'command', 'description', 'owner', 'ownerName', 'async', 'epsilon', 'executor',
    'disabled', 'softError', 'cpus', 'mem', 'disk', 'highPriority', 'container', 'fetch', 'useContainer',
  ];

  BaseJobModel = Backbone.Model.extend({
    constructor: function BaseJobModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    nestedKeys: {
      container: {
        type: "optional",
        model: ContainerModel,
      },
      fetch: {
        type: "optional",
        model: FetchCollection,
      },
    },
    defaults: function() {
      var d = new Date();

      
      return {
        name: '-',
        owner: '',
        startTime: moment.utc(d).format('HH:mm:ss'),
        startDate: moment.utc(d).format('YYYY-MM-DD'),
        repeats: '',
        duration: 'T24H',
        epsilon: 'PT30M',
        command: '-',
        schedule: '-',
        parents: [],
        retries: 2,
        lastSuccess: null,
        lastError: null,
        successCount: 0,
        errorCount: 0,
        persisted: false,
        async: false,
        disabled: false,
        softError: false,
        useContainer: false,
        hasContainer: false,
        container: null,
        fetch: new FetchCollection(),
      };
    },

    idAttribute: 'name',

    url: function(action) {
      if (action === 'put') {
        return Route('scheduler', 'job', this.get('name'));
      }
    },

    initialize: function() {

      this.bindings();
      this.trigger('add');
      /*
      var that = this;
      setInterval(function() {

        that.set("useContainer", !that.get("useContainer"));
      }, 1000);
      console.log(this);
      */
      return this;
    },

    bindings: function() {
      this.listenTo(this, {
        setSchedule: this.updateSchedule,
        add: this.parseDisplayName,
        'before:validate': this.parseSchedule,
        'change:name': this.parseDisplayName,
        'change:repeats': this.updateSchedule,
        'change:startTime': this.updateSchedule,
        'change:startDate': this.updateSchedule,
        'change:duration': this.updateSchedule,
        'change:lastRunStatus': this.updateLastRunInfo,
        'change:useContainer':this.onChangeUseContainer,
        'change:hasContainer':this.onChangeHasContainer
      });
    },
    parse: function(resp, options) {
      console.log("parsing object");
      return resp;
    },
    set: function(attrName, attrVal, options) {
      var attrs;
      if (typeof attrName === 'object') {
        attrs = _.clone(attrName);
        options = attrVal;
      } else {
        (attrs = {})[attrName] = attrVal;
      }
      var self = this;

      Object.keys(this.nestedKeys).forEach(function (key) {
        if (key in attrs) {
          
          self.updateNestedModels(key, attrs[key], options);
          if (key === "container") {
            attrs["useContainer"] = true;
          } 
          delete attrs[key];
        }
      });
      
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    updateNestedModels : function(key, attrs, options) {
      var currentmodel = this.get(attrs);

      var modelType = this.nestedKeys[key].model;
      if (attrs instanceof modelType) {
        this.attributes[key] = attrs;
        return;
      }
      if (currentmodel) {
        
        currentmodel.set(attrs, options);
        return;
      }
      this.attributes[key] = new modelType(attrs, options);      
      this.trigger("change:" + key, this, this.attributes[key]);

    },
    /*
    set: function(key, val, options) {
      
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }      
      //console.log(attributes);
      //console.log(this.attributes.name + " " + this.cid + attrs.container)

      /*
      if (attrs["container"]) { // we set container data
        if ( !(attrs["container"] instanceof ContainerModel)) { // with a raw object, not a backbone object
          console.log(attrs["container"])
          if (!_.isEmpty(attrs["container"])) { // and this object is not empty
            // do we already have a container object ?
            //console.log(this);
            //console.log(this.attributes);
            //console.log(this._previousAttributes);

            if (attributes) {
              //if yes, let's try to update it
              //console.log("already got a ContainerModel")
              this.attributes.container.set(attrs["container"], options);
            } else {
              // let's create a new container.
              //console.log("creating a ContainerModel")
              attrs["container"] = new ContainerModel(attrs["container"], options);  
            }            
            attrs["useContainer"] = true;           
          }
          //delete attrs["container"];
        }
      }
      if (attrs["fetch"]) {
        if (this.attributes.fetch === undefined) {
          this.attributes.fetch = new FetchCollection();  
        }
        this.attributes.fetch = new FetchCollection();
        this.attributes.fetch.set(attrs["fetch"], options);
        delete attrs["fetch"];
      }      
      return Backbone.Model.prototype.set.apply(this, [
        attrs,
        options
      ]);
    },
    */
    onChangeUseContainer: function(model, value, options) {
      if (value) {
        var container = model.get("container");
        if (container===null) {
          model.set("container", new ContainerModel());
        }  
      }      
    },
    onChangeHasContainer: function(model, value, options) {
      if (value) {
        model.set("useContainer", true);
      } else {
        model.set("useContainer", false);
      }
    },
    fetchStats: function() {
      var url = Route('scheduler', 'job', 'stat', this.get('name')),
          model = this;

      var formatStats = function(stats) {
        return _.reduce(stats, function(memo, v, k) {
          var key = k;
          memo[key] = v;
          return memo;
        }, {});
      };
      $.getJSON(url, function(data) {
        if (!data) { return null; }
        if (data.histogram && data.histogram.count) {
          model.set({stats: formatStats(data.histogram)});
        }
        if (data.taskStatHistory) {
          model.set({taskStatHistory: data.taskStatHistory});
        }
      });
    },

    hasSchedule: function() {
      return true;
    },

    updateSchedule: function() {
      var repeats = this.get('repeats'),
          startDate = this.get('startDate'),
          startTime = this.get('startTime'),
          duration  = this.get('duration'),
          schedule,
          parts;

      parts = [
        'R' + repeats,
        startDate + 'T' + startTime + 'Z',
        'P' + duration
      ];
      schedule = parts.join('/');

      this.set({schedule: schedule}, {silent: true});
    },

    run: function(options) {
      return this.sync('run', this, options);
    },

    sync: function(method, model, options) {
      var syncUrl,
          _method = method;

      if (method === 'run') { _method = 'update'; }
      switch (method) {
      case 'delete':
      case 'run':
        syncUrl = this.url('put');
        options.data = null;
        break;
      default:
        syncUrl = this.url();
        break;
      }

      return Backbone.sync.apply(this, [
        _method,
        model,
        _.extend({}, options, {url: syncUrl})
      ]).done(_.bind(function() {
        this.set('persisted', true);
      }, this));
    },

    isNew: function() {
      return !this.get('persisted');
    },

    clone: function() {
      var m = new BaseJobModel(_.extend({}, this.attributes, {
        persisted: false
      }));
      m.id = null;

      return m;
    },

    toJSON: function() {
      var baseJSON;

      if (this.get('schedule') === '-') {
        this.trigger('setSchedule');
      }
      /*
      baseJSON = this.toData();
      if (baseJSON.useContainer === false) {
        delete baseJSON["container"];
      }
      console.log(baseJSON);*/
      return _.pick.apply(null, ([baseJSON]).concat(this.getWhitelist()));
    },

    toData: function() {
      var data = Backbone.Model.prototype.toJSON.call(this);
      /*
      if (data["container"]) {
        data["container"] = this.get("container").toJSON();
      }*/
      //data["fetch"] = this.get("fetch").toJSON();
      return _.extend({}, data, {
        cid: this.cid,
        parentsList: this.get('parents').join(', '),
        isNew: this.isNew(),
        hasSchedule: this.hasSchedule(),
        lastError: data.lastError || 'none',
        lastSuccess: data.lastSuccess || 'none'
      });
    },

    updateLastRunInfo: function(model, lastRunStatus) {
      var lastRunFailed  = (lastRunStatus === 'failure'),
          lastRunFresh   = (lastRunStatus === 'fresh'),
          lastRunSuccess = (lastRunStatus === 'success');

      var lastRunDescr, lastRunTime;
      if (lastRunFailed) {
        lastRunTime = model.get('lastError');
        lastRunDescr = 'Last run @ ' + lastRunTime + ' failed.';
      } else if (lastRunSuccess) {
        lastRunTime = model.get('lastSuccess');
        lastRunDescr = 'Last run @ ' + lastRunTime + ' was successful.';
      } else {
        lastRunDescr = 'Job has not run yet.';
      }

      model.set({
        lastRunDescr: lastRunDescr,
        lastRunSuccess: lastRunSuccess,
        lastRunError: lastRunFailed,
        lastRunFresh: lastRunFresh,
        lastRunTime: lastRunTime
      });
    },

    getWhitelist: function() {
      return [];
    },

    parentsList: function(parents) {
      return this.get('parents').join(', ');
    },

    parseDisplayName: function() {
      var name = this.get('name');

      this.set('displayName', (name ? name.split('_').join(' ') : ''));
    },

    getInvocationCount: function() {
      return this.get('successCount') + this.get('errorCount');
    },

    validate: _.extend({}, BaseJobValidations),

    parseSchedule: function() {
      return this;
    }
  }, {
    getWhitelist: function() {
      return BaseWhiteList.slice();
    }
  });

  return BaseJobModel;
});
