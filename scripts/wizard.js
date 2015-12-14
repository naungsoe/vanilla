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
  window.UI.Wizard = function(selector) {
    var steps = [],
      previous = '',
      selected = '',
      stepHandler = function() {},
      changeHandler = function() {};
    
    function bindData(context, data) {
      context.steps = data.steps || [];
	  context.previous = data.previous || '';
	  context.selected = data.selected || '';
    }
    
    function bindWizard(context) {
      var steps = helpers.queryAll('.step', context.container);
      helpers.toArray(steps).forEach(function(step, index) {
        step.removeEventListener('click', stepHandler, false);
      });
      
      stepHandler = bindStep(context);
      helpers.toArray(steps).forEach(function(step, index) {
        step.addEventListener('click', stepHandler, false);
      });
    }
    
    function updateStatus(context) {
      if (context.selected === '') {
	    return;
	  }
      
      var steps = helpers.queryAll('.step', context.container);
      helpers.toArray(steps).forEach(function(step, index) {
        step.classList.remove('selected');
      });
      
      var step = helpers.query(
        '.step[data-value="' + context.selected + '"]', context.container);
      step.classList.add('selected');
    }
    
    function bindStep(context) {
      return function(event) {
        event = event || window.event;
        context.previous = context.selected;
        context.selected = event.currentTarget.dataset.value;
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function enableStep(context, step) {
      var step = helpers.query('.step[data-value="' + step + '"]');
      step.removeAttribute('disabled');
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
	  
	  get steps() {
        return steps;
      },
      
      set steps(value) {
        steps = value;
		bindWizard(this);
		updateStatus(this);
      },
	  
	  get previous() {
        return previous;
      },
      
      set previous(value) {
        previous = value;
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
      },
      
      enable: function(step) {
        enableStep(this, step);
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