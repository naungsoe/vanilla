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
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Popover = function(selector) {
    var content = '',
      toggleHandler = function() {},
      docClickHandler = function() {};
      
    function bindData(context, data) {
      context.content = data.content || '';
    }
    
    function bindPopover(context) {
      if (!helpers.isEmpty(context.content)) {
        var content = helpers.query(".content", context.container);
        content.innerHTML = context.content;
      }
	  
      var toggle = helpers.query('.toggle', context.container);
      toggle.removeEventListener('click', toggleHandler, false);
      
      toggleHandler = bindToggle(context.container);
      toggle.addEventListener('click', toggleHandler, false);
      
      document.removeEventListener('click', docClickHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
	
    function bindToggle(container) {
      return function(event) {
	    container.classList.toggle('open');
        triggerReflow(container);
      };
    }
    
    function triggerReflow(container) {
      var reflow = helpers.query('.reflow', container);
      if (!helpers.isEmpty(reflow)) {
        return;
      }
      
      setTimeout(function initiateReflow() {
        reflow = document.createElement('div');
        reflow.classList.add('reflow');
        container.appendChild(reflow);
      }, 100);
    }
    
    function bindDocClick(popover) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
		while (!target.classList.contains('popover')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target !== popover)
		    && (popover.classList.contains('open'))) {
		  popover.classList.toggle('open');
        }
      };
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
	  
	  get content() {
        return content;
      },
      
      set content(value) {
        content = value;
		bindPopover(this);
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      }
    };
  };
})();