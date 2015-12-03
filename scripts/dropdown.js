(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Dropdown = function(selector) {
    var items = [],
	  selected = '',
      toggleHandler = function() {},
      itemHandler = function() {},
      mouseEnterHandler = function() {},
      mouseLeaveHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data) {
	  context.items = data.items || [];
	  context.selected = data.selected || '';
    }
    
    function bindDropdown(context) {
	  if (context.items.length > 0) {
		var menu = helpers.query(".menu", context.container);
        menu.innerHTML = getMenuHTML(context);
	  }
	  
      var toggle = helpers.query('.toggle', context.container);
      toggle.removeEventListener('click', toggleHandler, false);
      
      toggleHandler = bindToggle(context.container);
      toggle.addEventListener('click', toggleHandler, false);

      var items = helpers.queryAll('.menu > .item', context.container);
      helpers.toArray(items).forEach(function(item) {
        item.removeEventListener('click', itemHandler, false);
        item.removeEventListener('mouseenter', mouseEnterHandler, false);
        item.removeEventListener('mouseleave', mouseLeaveHandler, false);
      });
      
      itemHandler = bindItem(context);
      helpers.toArray(items).forEach(function(item) {
        item.addEventListener('click', itemHandler, false);
      });
      
      mouseEnterHandler = bindMouseEnter(context.container);
      helpers.toArray(items).forEach(function(item) {
        item.addEventListener('mouseenter', mouseEnterHandler, false);
      });
      
      mouseLeaveHandler = bindMouseLeave(context.container);
      helpers.toArray(items).forEach(function(item) {
        item.addEventListener('mouseleave', mouseLeaveHandler, false);
      });
      
      document.removeEventListener('keydown', docKeydownHandler, false);
      document.removeEventListener('click', docClickHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
    
	function getMenuHTML(context) {
	  var html = '';
      context.items.forEach(function(item) {
        html = html + '<li data-value="' + item.id + '" '
          + 'class="item">' + item.name + '</li>';
      });
	  return html;
	}
	
    function bindToggle(container) {
      return function(event) {
        var menu = helpers.query(".menu", container);
        if (menu.classList.contains("selectable")
            && !menu.classList.contains("up")) {
          var item = helpers.query(".selected", menu),
            offsetTop = item.offsetTop;
          
          offsetTop = (offsetTop < 280) ? offsetTop : 280;
          menu.style.top = -offsetTop + 'px';
        }
        container.classList.toggle('open');
      };
    }
    
    function bindDocKeydown(container) {
      return function(event) {
		var target = event.target;
        event = event || window.event;
        
		while (!target.classList.contains('dropdown')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target === container)
		    && (container.classList.contains('open'))) {
          switch (event.keyCode) {
            case 13:
              var item = helpers.query('.menu > .highlight', container);
              if (!helpers.isEmpty(item)) {
                container.classList.toggle('open');
                
                var event = new CustomEvent('click', {});
                item.dispatchEvent(event);
              }
              break;
            
            case 38:
              var item = helpers.query('.menu > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.menu > .item:last-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.previousElementSibling || item;
              }
              item.classList.add('highlight');
              break;
            
            case 40:
              var item = helpers.query('.menu > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.menu > .item:first-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.nextElementSibling || item;
              }
              item.classList.add('highlight');
              break;
          }
        }
      };
    }
    
    function bindDocClick(container) {
      return function(event) {
		var target = event.target;
		while (!target.classList.contains('dropdown')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target !== container)
		    && (container.classList.contains('open'))) {
		  container.classList.toggle('open');
        }
      };
    }
    
    function updateStatus(context) {
      if (context.selected === '') {
	    return;
	  }
      
      var text = helpers.query('.toggle > .text', context.container);
      var item = helpers.query(
        '.item[data-value="' + context.selected + '"]', context.container);
      text.textContent = item.textContent;
	  
      var items = helpers.queryAll('.menu > .item', context.container);
      helpers.toArray(items).forEach(function(item) {
        item.classList.remove('selected');
      });
      item.classList.add('selected');
    }
    
    function bindItem(context) {
      return function(event) {
        var items = helpers.queryAll('.menu > .item', context.container);
        helpers.toArray(items).forEach(function(item) {
          item.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        context.selected = event.currentTarget.dataset.value;
        context.container.classList.toggle('open');
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function bindMouseEnter(container) {
      return function(event) {
        var items = helpers.queryAll('.menu > .item', container);
        helpers.toArray(items).forEach(function(item) {
          item.classList.remove('highlight');
        });
        
        event.currentTarget.classList.add('highlight');
      };
    }
    
    function bindMouseLeave(container) {
      return function(event) {
        var items = helpers.queryAll('.menu > .item', container);
        helpers.toArray(items).forEach(function(item) {
          item.classList.remove('highlight');
        });
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
	  
	  get items() {
        return items;
      },
      
      set items(value) {
        items = value;
		bindDropdown(this);
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
      
      change: function(callback, data) {
        this.container.removeEventListener('change', changeHandler, false);
        
        changeHandler = bindChange(this, callback, data);
        this.container.addEventListener('change', changeHandler, false);
        return this;
      }
    };
  };
})();