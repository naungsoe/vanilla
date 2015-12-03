(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.DatePicker = function(selector) {
    var content = '',
      boldHandler = function() {},
      italicHandler = function() {},
      underlineHandler = function() {};
      
    function bindData(context, data) {
      context.content = data.content || '';
    }
    
    function bindDatePicker(context) {
      
    }
	
    function bindChange(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
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
		bindDatePicker(this);
      },
      
      bind: function(data) {
        bindDatePicker(this, data);
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