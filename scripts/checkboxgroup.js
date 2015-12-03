(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.CheckboxGroup = function(selector) {
    var items = [],
	  selected = [],
      itemHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data) {
	  context.items = data.items || [];
	  context.selected = data.selected || [];
    }
    
    function bindCheckboxes(context) {
	  if (context.items.length > 0) {
		context.container.innerHTML = getCheckboxGroupHTML(context);
	  }
	  
      var checkboxex = helpers.queryAll('.checkbox', context.container);
      helpers.toArray(checkboxex).forEach(function(checkbox) {
        checkbox.removeEventListener('click', itemHandler, false);  
      });
      
      itemHandler = bindItem(context);
      helpers.toArray(checkboxex).forEach(function(checkbox) {
        checkbox.addEventListener('click', itemHandler, false);
      });
    }
	
	function getCheckboxGroupHTML(context) {
	  var html = '';
      context.items.forEach(function(item) {
        html = html + '<div class="item">'
          + '<div data-value="' + item.id + '" class="checkbox">'
          + '<i class="checked fa fa-check-square-o"></i>'
		  + '<i class="unchecked fa fa-square-o"></i>'
          + '<span>' + item.name + '</span></div></div>';
      });
	  return html;
	}    
    
    function updateStatus(context) {
      var checkboxes = helpers.queryAll('.checkbox', context.container);
      helpers.toArray(checkboxes).forEach(function(checkbox) {
        checkbox.removeAttribute('checked');
      });
      
      context.selected.forEach(function(item) {
        var checkbox = helpers.query(
          '.checkbox[data-value="' + item.id + '"]', context.container);
        checkbox.setAttribute('checked', 'checked');
      });
    }
    
    function bindItem(context) {
      return function(event) {
        var id = event.currentTarget.dataset.value,
          selected = context.items.filter(function(item) {
            return (item.id === id);
          }),
          existing = context.selected.filter(function(item) {
            return (item.id === id);
          });
        
        if (existing.length === 0) {
          context.selected = context.selected.concat(selected);
        }
        else {
          context.selected = context.selected.filter(function(item) {
            return (item.id !== id);
          });
        }
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function bindChange(context, callback) {
      return function(event) {
        callback.call(context);
      };
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
	  
	  get items() {
        return items;
      },
      
      set items(value) {
        items = value;
		bindCheckboxes(this);
        updateStatus(this);
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
      
      change: function(callback) {
        this.container.removeEventListener('change', changeHandler, false);
        
        changeHandler = bindChange(this, callback);
        this.container.addEventListener('change', changeHandler, false);
        return this;
      }
    };
  };
})();