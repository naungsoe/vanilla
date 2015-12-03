(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.RichText = function(selector) {
    var content = '',
      boldHandler = function() {},
      italicHandler = function() {},
      underlineHandler = function() {};
      
    function bindData(context, data) {
      context.content = data.content || '';
    }
    
    function bindRichText(context) {
      
    }
	
    function bindExecuteCommand(context) {
      return function(event) {
        
      };
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
	  
	  get content() {
        return content;
      },
      
      set content(value) {
        content = value;
		bindRichText(this);
      },
      
      bind: function(data) {
        bindData(this, data);
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