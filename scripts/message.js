(function() {
  'user strict';
  
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