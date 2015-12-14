(function() {
  'use strict';
  
  window.UI = window.UI || {};
  window.UI.Actions = function(selector) {
    var rights = [],
      items = [],
      selected = '',
      clickHandler = function() {};
      
    function bindData(context, data) {
      context.rights = data.rights || [];
	  context.items = data.items || [];
      context.selected = data.selected || '';
    }
    
    function updateStatus(context) {
      var actions = ['edit', 'delete'];
	  hideActions(context, actions);
      
      var availActions = [];
      context.rights.forEach(function(right) {
        switch (right) {
          case 'edit':
            if (context.items.length === 1) {
              availActions.push(right);
            }
            break;
          
          case 'delete':
            if (context.items.length >= 1) {
              availActions.push(right);
            }
            break;
        }
      });
      
      showActions(context, availActions);
    }
    
    function showActions(context, actions) {
      actions.forEach(function(action) {
        var button = helpers.query('button[data-action="' 
          + action + '"]', context.container);
        if (button.classList.contains('hide')) {
          button.classList.remove('hide');
        }
      });
    }
	
    function hideActions(context, actions) {
      actions.forEach(function(action) {
        var button = helpers.query('button[data-action="' 
          + action + '"]', context.container);
		if (!button.classList.contains('hide')) {
          button.classList.add('hide');
        }
      });
    }

    function bindClick(context, callback) {
      return function(event) {
        context.selected = event.currentTarget.dataset.action;
        callback.call(context);
      };
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
	  
      get rights() {
        return rights;
      },
      
      set rights(value) {
        rights = value;
		updateStatus(this);
      },
	  
	  get items() {
        return items;
      },
      
      set items(value) {
        items = value;
		updateStatus(this);
      },

      get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
      },
	  
	  bind: function(data) {
	    bindData(this, data);
        return this;
	  },
      
      select: function(callback) {
        var actionButtons = helpers.queryAll('button', this.container);
        helpers.toArray(actionButtons).forEach(function(actionButton) {
          actionButton.removeEventListener('click', clickHandler, false);  
        });

        clickHandler = bindClick(this, callback);
        helpers.toArray(actionButtons).forEach(function(actionButton) {
          actionButton.addEventListener('click', clickHandler, false);
        });
        return this;
      }
    };
  };
})();