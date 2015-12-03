(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Search = function(selector) {
    var url = '',
      fields = '',
      filter = '',
      keyword = '',
      items = [],
      search = {},
      resource = {},
      focusHandler = function() {},
      keypressHandler = function() {},
      itemHandler = function() {},
      mouseEnterHandler = function() {},
      mouseLeaveHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      selectHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.url = data.url || '';
      context.fields = data.fields || '';
      context.filter = data.filter || '';
      context.keyword = data.keyword || '';
      context.items = data.items || [];
    }
    
    function bindSearch(context) {
      var query = helpers.query('input', context.container);
      query.removeEventListener('focus', focusHandler, false);
      
      focusHandler = bindFocus(context);
      query.addEventListener('focus', focusHandler, false);
      
      query.removeEventListener('keypress', keypressHandler, false);
      query.removeEventListener('keyup', keypressHandler, false);
      
      keypressHandler = bindKeypress(context);
      query.addEventListener('keypress', keypressHandler, false);
      query.addEventListener('keyup', keypressHandler, false);
      
      document.removeEventListener('keydown', docKeydownHandler, false);
      document.removeEventListener('click', docClickHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
    
    function bindFocus(context) {
      return function(event) {
        if (!context.container.classList.contains('open')) {
          context.container.classList.add('open');
          if (!helpers.isEmpty(context.keyword)) {
            var query = helpers.query('input', context.container);
            context.keyword = query.value;
          }
        }
      };
    }
    
    function bindKeypress(context) {
      var timeout = null;
      return function(event) {
        event = event || window.event;
        if (!helpers.isEmpty(timeout)) {
          clearTimeout(timeout);
        }
        
        switch (event.keyCode) {
          case 13:
          case 37:
          case 38:
          case 39:
          case 40:
            // do something
            break;
          
          default:
            if (!context.container.classList.contains('open')) {
              context.container.classList.add('open');
            }
            
            timeout = setTimeout(function() {
	          if (context.keyword !== event.target.value) {
	            context.keyword = event.target.value;
              }
            }, 100);
            break;
        }
      };
    }
    
    function bindDocKeydown(container) {
      return function(event) {
		var target = event.target;
        event = event || window.event;
        
		while (!target.classList.contains('search-box')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target === container)
		    && (container.classList.contains('open'))) {
          switch (event.keyCode) {
            case 13:
              var item = helpers.query('.result > .highlight', container);
              if (!helpers.isEmpty(item)) {
                container.classList.toggle('open');
                
                var event = new CustomEvent('click', {});
                item.dispatchEvent(event);
              }
              break;
            
            case 38:
              var item = helpers.query('.result > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.result > .item:last-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.previousElementSibling || item;
              }
              item.classList.add('highlight');
              break;
            
            case 40:
              var item = helpers.query('.result > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.result > .item:first-child', container);
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
		while (!target.classList.contains('search-box')) {
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
    
    function searchKeyword(context) {
      if (!context.container.classList.contains('open')) {
        return;
      }
      else if (helpers.isEmpty(context.url)
          || helpers.isEmpty(context.keyword)) {
        context.items = [];
        return;
      }
      
      search = context;
      var criteria = { fields: context.fields };
      criteria[context.filter] = '%' + context.keyword + '%';
      helpers.request(context.url)
        .get(criteria)
        .then(searchKeywordSuccess);
    }
    
    function searchKeywordSuccess(response) {
      search.items = response;
    }
    
    function bindItems(context) {
      var result = helpers.query('.result', context.container);
      result.innerHTML = getItemsHTML(context);
      
      var items = helpers.queryAll('.result > .item', context.container);
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
    }
    
    function getItemsHTML(context) {
      var html = '';
      
      if (context.items.length === 0) {
        if (helpers.isEmpty(context.keyword)) {
          html = html + '<div class="item" disabled><div class="left">'
            + context.resource.searchRecordsEntry + '</div></div>';
        }
        else {
          html = html + '<div class="item" disabled><div class="left">'
            + context.resource.searchRecordsEmpty + '</div></div>';
        }
      }
      else {
        context.items.forEach(function(item) {
          html = html + '<div class="item" data-name="' + item.name + '">';
          
          if (!helpers.isEmpty(item.image)) {
            html = html + '<div class="left">';
            html = html + '<img src="' + item.image + '" '
              + 'alt="' + item.name + '" class="picture" /></div>';
          }
          
          var regexp = new RegExp(context.keyword, 'i');
          var match = regexp.exec(item.name);
          var name = item.name;
          if (!helpers.isEmpty(match)) {
            name = name.replace(match, '<b>' + match + '</b>');
          }
          html = html + '<div class="right">';
          html = html + '<div class="name">' + name + '</div>';
          
          if (!helpers.isEmpty(item.email)) {
            var email = item.email;
            var parts = item.email.split('@');
            match = regexp.exec(parts[0]);
            if (!helpers.isEmpty(match)) {
              email = email.replace(match, '<b>' + match + '</b>');
            }
            html = html + '<div class="email">' + email + '</div>';
          }
          html = html + '</div></div>';
        });
      }
      
      return html;
    }
    
    function bindItem(context) {
      return function(event) {
        context.container.classList.remove('open');
        context.keyword = event.currentTarget.dataset.name;
        
        var data = { 'keyword': context.keyword };
        var event = new CustomEvent('select', data);
        context.container.dispatchEvent(event);
      };
    }
    
    function bindMouseEnter(container) {
      return function(event) {
        var items = helpers.queryAll('.result > .item', container);
        helpers.toArray(items).forEach(function(item) {
          item.classList.remove('highlight');
        });
        
        event.currentTarget.classList.add('highlight');
      };
    }
    
    function bindMouseLeave(container) {
      return function(event) {
        var items = helpers.queryAll('.result > .item', container);
        helpers.toArray(items).forEach(function(item) {
          item.classList.remove('highlight');
        });
      };
    }
    
    function bindSelect(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
	  
	  get url() {
        return url;
      },
      
      set url(value) {
        url = value;
      },
      
	  get fields() {
        return fields;
      },
      
      set fields(value) {
        fields = value;
      },

	  get filter() {
        return filter;
      },
      
      set filter(value) {
        filter = value;
      },
      
      get keyword() {
        return keyword;
      },
      
      set keyword(value) {
        keyword = value;
        var query = helpers.query('.query', this.container);
        query.value = keyword;
        searchKeyword(this);
      },
      
      get items() {
        return items;
      },
      
      set items(value) {
        items = value;
        bindItems(this);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        bindSearch(this);
        return this;
      },

      select: function(callback, data) {
        this.container.removeEventListener('select', selectHandler, false);
        
        selectHandler = bindSelect(this, callback, data);
        this.container.addEventListener('select', selectHandler, false);
        return this;
      }
    };
  };
})();