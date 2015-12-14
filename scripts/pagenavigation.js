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
  
  window.UI = window.UI || {};
  window.UI.PageNavigation = function(selector) {
    var redirect = '',
      backHandler = function() {},
      nameHandler = function() {};
    
    function bindData(context, data) {
      context.redirect = data.redirect || '';
    }
    
    function bindNavigation(context) {
      var back = helpers.query('.back', context.container);
      back.removeEventListener('click', backHandler, false);  
      
      backHandler = bindBack(context);
      back.addEventListener('click', backHandler, false);
      
      var name = helpers.query('.name', context.container);
      name.removeEventListener('click', nameHandler, false);  
      
      nameHandler = bindName(context);
      name.addEventListener('click', nameHandler, false);
    }
    
    function bindBack(context) {
      return function(event) {
        helpers.redirect(context.redirect);
      };
    }
    
    function bindName(context) {
      return function(event) {
        helpers.refresh();
      };
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get redirect() {
        return redirect;
      },
      
      set redirect(value) {
        redirect = value;
        bindNavigation(this);
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      }
    };
  };
})();