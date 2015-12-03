(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Navigation = function(selector) {
    var items = [],
	  selected = '',
      linkHandler = function() {},
	  selectHandler = function() {};
      
    function bindData(context, data) {
	  context.items = data.items || [];
	  context.selected = data.selected || '';
    }
    
    function bindLinks(context) {
      if (context.items.length > 0) {
	     context.container.innerHTML = getLinksHTML(context);
	  }
      
      var links = helpers.queryAll('.link', this.container);
	  helpers.toArray(links).forEach(function(link) {
	    link.removeEventListener('click', linkHandler, false);  
	  });
	  
	  linkHandler = bindLink(this.container);
	  helpers.toArray(links).forEach(function(link) {
	    link.addEventListener('click', linkHandler, false);
      });
    }
	
	function getLinksHTML(context) {
	  var html = '';
      context.items.forEach(function(item) {
        html = html + '<a href="' + item.url + '" '
          + 'data-value="' + item.id + '" class="link">';
        
        if (!helpers.isEmpty(item.icon)) {
          html = html + '<i class="' + item.icon + '"></i>';
        }
        html = html + '<span>' + item.name + '</span></a>';
      });
	  return html;
	}
    
    function bindLink(navigation) {
      return function(event) {
		event.preventDefault();
		var url = event.currentTarget.getAttribute("href");
		helpers.redirect(url);
      };
    }
    
    function updateStatus(context) {
      if (context.selected === '') {
	    return;
	  }
	  
      var links = helpers.queryAll('a', context.container);
      helpers.toArray(links).forEach(function(link) {
        link.classList.remove('selected');
      });
      
      var link = helpers.query('a[data-value="' 
	    + context.selected + '"]', context.container);
      link.classList.add('selected');
    }
	
	function bindSelect(context, callback, data) {
      return function(event) {
        var menuItems = helpers.queryAll('.menu > li', this.container);
        helpers.toArray(menuItems).forEach(function(menuItem) {
          menuItem.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        context.selected = event.currentTarget.dataset.value;
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
		bindLinks(this);
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
      
      select: function(callback, data) {
        var links = helpers.queryAll('.link', this.container);
        helpers.toArray(links).forEach(function(link) {
          link.removeEventListener('click', selectHandler, false);  
        });
        
        selectHandler = bindSelect(this, callback, data);
        helpers.toArray(links).forEach(function(link) {
          link.addEventListener('click', selectHandler, false);
        });
        return this;
      }
    };
  };
})();