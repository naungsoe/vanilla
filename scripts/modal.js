(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Modal = function(selector) {
    var content = '',
      proceedHandler = function() {},
	  cancelHandler = function() {},
      resizeHandler = function() {};
      
    function bindData(context, data) {
	  context.content = data.content || '';
    }
    
    function bindModal(context) {
      if (context.content !== '') {
        var content = helpers.query('.content', context.container);
        content.innerHTML = context.content;
      }
            
      window.removeEventListener('resize', resizeHandler, false);
      
      resizeHandler = bindWindowResize(context.container);
      window.addEventListener('resize', resizeHandler, false);
      
      bindBackdrop(context);
      showModal(context);
    }
    
    function bindWindowResize(container) {
      return function(event) {
        var modal = helpers.query('.modal', container);
        modal.style.marginLeft = -(modal.offsetWidth / 2) + 'px';
        modal.style.marginTop = -(modal.offsetHeight / 2) + 'px';
      };
    }
    
    function bindBackdrop(context) {
      var backdrop = helpers.query('.backdrop', context.container);
      if (helpers.isEmpty(backdrop)) {
        var backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        context.container.appendChild(backdrop);
      }
    }
    
    function showModal(context) {
      var backdrop = helpers.query('.backdrop', context.container),
        modal = helpers.query('.modal', context.container);
      
      context.container.classList.remove("hide");
      backdrop.classList.add('transition');
      backdrop.classList.remove('open');
      modal.classList.add('transition');
      modal.classList.remove('open');
      
      setTimeout(function() {
        var backdrop = helpers.query('.backdrop', context.container),
          modal = helpers.query('.modal', context.container);
        
        backdrop.classList.add('open');
        modal.classList.add('open');
        
        modal.style.marginLeft = -(modal.offsetWidth / 2) + 'px';
        modal.style.marginTop = -(modal.offsetHeight / 2) + 'px';
      }, 100);
    }
    
    function bindProceed(context, callback, data) {
      return function(event) {
		callback.call(context, data);
      };
    }

    function bindCancel(context, callback, data) {
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
        bindModal(this);
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      },
      
      proceed: function(callback, data) {
        var proceed = helpers.query('.proceed', this.container);
        proceed.removeEventListener('click', proceedHandler, false);
        
        proceedHandler = bindProceed(this, callback, data);
        proceed.addEventListener('click', proceedHandler, false);
        return this;
      },
      
      cancel: function(callback, data) {
        var cancel = helpers.query('.cancel', this.container);
        cancel.removeEventListener('click', cancelHandler, false);
        
        cancelHandler = bindCancel(this, callback, data);
        cancel.addEventListener('click', cancelHandler, false);
        return this;
      }
    };
  };
})();