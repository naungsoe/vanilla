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
  window.UI.Message = function(selector) {
    var message = '',
      type = 'warning',
      delay = 0,
      timeout = null;
      
    function bindData(context, data) {
      context.type = data.type || 'warning';
      context.message = data.message || '';
      context.delay = data.delay || 0;
      
      clearTimeout(timeout);
      if (context.delay > 0) {
        timeout = setTimeout(function() {
          context.message = '';
        }, context.delay);
      }
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get message() {
        return message;
      },
      
      set message(value) {
        message = value;
        var html = '';
        if (message !== '') {
          html = '<div class="' + this.type + '">'
            + message + '</div>';
        }
		this.container.innerHTML = html;
      },
      
      get type() {
        return type;
      },
      
      set type(value) {
        type = value;
      },
      
      get delay() {
        return delay;
      },
      
      set delay(value) {
        delay = value;
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      }
    };
  };
})();