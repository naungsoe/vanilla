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
  window.UI.Tab = function(selector) {
    var selected = '';
      
    function bindData(context, data) {
      context.selected = data.selected || '';
    }
    
    function updateStatus(context) {
      if (context.selected === '') {
	    return;
      }

      var container = context.container,
        tabs = helpers.queryAll('.tabs > .selected', container);
      
      helpers.toArray(tabs).forEach(function(tab) {
        tab.classList.remove('selected');
      });
      
      var tab = helpers.query(
        '.tab[data-value="' + context.selected + '"]', container);
      
      tab.classList.add('selected');
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
        updateStatus(this);
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      }
    };
  };
})();