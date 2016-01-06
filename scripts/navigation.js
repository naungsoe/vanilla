/***************************************************************************
Copyright 2015 Yan Naung Soe, e-Learning Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************/

(function() {
  'use strict';
  
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
      
      var links = helpers.queryAll('.link', context.container);
	  helpers.toArray(links).forEach(function(link) {
        link.removeEventListener('click', selectHandler, false);
	    link.removeEventListener('click', linkHandler, false);  
	  });
	  
	  linkHandler = bindLink(context.container);
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
        html = html + '<span class="text">' + item.name + '</span></a>';
      });
	  return html;
	}
    
    function bindLink(navigation) {
      return function(event) {
        event = event || window.event;
        
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
        event = event || window.event;
        
        event.preventDefault();
        var links = helpers.queryAll('.selected', this.container);
        helpers.toArray(links).forEach(function(link) {
          link.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        context.selected = event.currentTarget.dataset.value;
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
          link.removeEventListener('click', linkHandler, false);
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