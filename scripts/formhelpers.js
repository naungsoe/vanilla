/***************************************************************************
Copyright 2015 Yan Naung Soe, e-Learning Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************/

(function() {
  'use strict';
  
  var formHelpers = {
    validateRequired: function(context, fields, message) {
      helpers.toArray(fields).forEach(function(field) {
        if (helpers.isEmpty(field.value)) {
          formHelpers.addError(field, message);
        }
        else {
          formHelpers.clearError(field);
        }
      });
    },
    
    validateEmail: function(context, fields, message) {
      helpers.toArray(fields).forEach(function(field) {
        if (!helpers.isEmpty(field.value)) {
          if (helpers.isEmail(field.value)) {
            formHelpers.addError(field, message);
          }
          else {
            formHelpers.clearError(field);
          }
        }
      });
    },
    
    addError: function(field, message) {
      field.parentNode.parentNode.classList.add("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (helpers.isEmpty(hint)) {
        var hint = document.createElement('div');
        hint.classList.add('hint');
        field.parentNode.appendChild(hint);
      }
      hint.innerHTML = '<div class="hint">' + message + '</div>';
    },
    
    clearError: function(field) {
      field.parentNode.parentNode.classList.remove("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (!helpers.isEmpty(hint)) {
        field.parentNode.removeChild(hint);
      }
    },
    
    hasError: function(form) {
      var errors = helpers.queryAll('.error', form);
      return (errors.length > 0);
    }
  };
  
  window.formHelpers = formHelpers;
})();