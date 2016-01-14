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
    var selected = '',
      tabHandler = function() {},
      changeHandler = function() {};
    
    function bindData(context, data) {
      context.selected = data.selected || '';
    }
    
    function bindTabs(context) {
      var tabs = helpers.queryAll(
        '.tabs > .nav > .tab', context.container);
      helpers.toArray(tabs).forEach(function(tab) {
        tab.removeEventListener('click', tabHandler, false);
      });
      
      tabHandler = bindTab(context);
      helpers.toArray(tabs).forEach(function(tab) {
        tab.addEventListener('click', tabHandler, false);
      });
    }
	
    function bindTab(context) {
      return function(event) {
        event = event || window.event;
        event.preventDefault();
        
        var tabs = helpers.queryAll(
          '.tabs > .nav > .selected', context.container);
        helpers.toArray(tabs).forEach(function(tab) {
          tab.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        context.selected = event.currentTarget.dataset.value;
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function updateStatus(context) {
      if (context.selected === '') {
	    return;
      }
      
      var container = context.container,
        tabs = helpers.queryAll(
          '.tabs > .nav > .selected', container);
      
      helpers.toArray(tabs).forEach(function(tab) {
        tab.classList.remove('selected');
      });
      
      var tab = helpers.query(
        '.tab[data-value="' + context.selected + '"]', container);
      
      tab.classList.add('selected');
    }
    
    function bindChange(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
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
        bindTabs(this);
        return this;
      },
      
      change: function(callback, data) {
        this.container.removeEventListener('change', changeHandler, false);
        
        changeHandler = bindChange(this, callback, data);
        this.container.addEventListener('change', changeHandler, false);
        return this;
      }
    };
  };
})();