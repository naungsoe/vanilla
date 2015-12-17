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
    
    function isFormValid(context) {
      var container = context.container;
      var requiredFields = helpers.queryAll('input[required]', container);
      validateRequiredFields(context, requiredFields);

      var emailFields = helpers.queryAll('input[email]', container);
      validateEmailFields(context, emailFields);
      
      var errors = helpers.queryAll('.error', container);
      return (errors.length === 0);
    }
    
    function validateRequiredFields(context, fields) {
      helpers.toArray(fields).forEach(function(field) {
        if (helpers.isEmpty(field.value)) {
          addError(field, context.resource.invalidRequiredField);
        }
        else {
          clearError(field);
        }
      });
    }
    
    function validateEmailFields(context, fields) {
      helpers.toArray(fields).forEach(function(field) {
        if (!helpers.isEmpty(field.value)) {
          if (helpers.isEmail(field.value)) {
            addError(field, context.resource.invalidEmailField);
          }
          else {
            clearError(field);
          }
        }
      });
    }
    
    function addError(field, message) {
      field.parentNode.parentNode.classList.add("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (helpers.isEmpty(hint)) {
        var hint = document.createElement('div');
        hint.classList.add('hint');
        field.parentNode.appendChild(hint);
      }
      hint.innerHTML = '<div class="hint">' + message + '</div>';
    }
    
    function clearError(field) {
      field.parentNode.parentNode.classList.remove("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (!helpers.isEmpty(hint)) {
        field.parentNode.removeChild(hint);
      }
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
        return isFormValid(this);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      toggle: function() {
        this.container.classList.toggle('hide');
        return this;
      }
    };
  };
})();