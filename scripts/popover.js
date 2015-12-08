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