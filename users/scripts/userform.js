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
      firstName.value = context.user.name.first;
      
      lastName = helpers.query('#lastName', container);
      lastName.value = context.user.name.last;
      
      email = helpers.query('#email', container);
      email.value = context.user.email;
      
      password = helpers.query('#password', container);
      password.value = context.user.password;
      
      confirmPassword = helpers.query('#confirmPassword', container);
      confirmPassword.value = context.user.confirmPassword;
      
      alternateEmail = helpers.query('#alternateEmail', container);
      alternateEmail.value = context.user.alternateEmail;
    }
    
    function validate(context) {
      var container = context.container;
      var requireds = helpers.queryAll('input[required]', container);
      var message = context.resource.invalidRequiredField;
      formHelpers.validateRequired(context, requireds, message);

      var emails = helpers.queryAll('input[email]', container);
      message = context.resource.invalidEmailField;
      formHelpers.validateEmail(context, emails, message);
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
        return !formHelpers.hasError(this.container);
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