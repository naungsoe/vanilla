(function() {
  'use strict';
  
  window.UI = window.UI || {};
  window.UI.UserForm = function(selector) {
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
    
    function bindForm(context) {
      var container = context.container;
      firstName = helpers.query('#firstName', container);
      lastName = helpers.query('#lastName', container);
      email = helpers.query('#email', container);
      password = helpers.query('#password', container);
      confirmPassword = helpers.query('#confirmPassword', container);
      alternateEmail = helpers.query('#alternateEmail', container);
      
      firstName.value = context.user.name.first;
      lastName.value = context.user.name.last;
      email.value = context.user.email;
      password.value = context.user.password;
      confirmPassword.value = context.user.confirmPassword;
      alternateEmail.value = context.user.alternateEmail;
    }
    
    function validate(context) {
      var container = context.container;
      var requireds = helpers.queryAll('input[required]', container);
      var message = context.resource.invalidRequiredField;
      formhelpers.validateRequired(context, requireds, message);

      var emails = helpers.queryAll('input[email]', container);
      message = context.resource.invalidEmailField;
      formhelpers.validateEmail(context, emails, message);
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
      
      get user() {
        return user;
      },
      
      set user(value) {
        user = value;
        bindForm(this);
      },
      
      get valid() {
        return !formhelpers.hasError(this.container);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      validate: function() {
        validate(this);
        return this;
      }
    };
  };
})();