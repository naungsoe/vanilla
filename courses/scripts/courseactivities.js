(function() {
  'use strict';
  
  window.UI = window.UI || {};
  window.UI.CourseActivities = function(selector) {
    var user = { name: { first: '', last: '' },
        email: '', password: '', confirmPassword: '',
        alternateEmail: '' },
      resource = {},
      firstName = {},
      lastName = {},
      email = {},
      password = {},
      confirmPassword = {},
      alternateEmail = {};
    
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.user = data.user
        || { name: { first: '', last: '' },
          email: '', password: '', confirmPassword: '',
          alternateEmail: '' };
    }
    
    function bindActivities(context) {
      var container = context.container;
      
    }
    
    function validate(context) {
      
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      get activities() {
        return user;
      },
      
      set activities(value) {
        activities = value;
        bindActivities(this);
      },
      
      get hidden() {
        return this.container.classList.contains('hide');
      },
      
      get valid() {
        return !formHelpers.hasError(this.container);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      show: function() {
        if (this.container.classList.contains('hide')) {
          this.container.classList.remove('hide');
        }
        return this;
      },
      
      hide: function() {
        if (!this.container.classList.contains('hide')) {
          this.container.classList.add('hide');
        }
        return this;
      },
      
      validate: function() {
        validate(this);
        return this;
      }
    };
  };
})();