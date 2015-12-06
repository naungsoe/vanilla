(function() {
  'user strict';
  
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