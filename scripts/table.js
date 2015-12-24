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
  window.UI.Table = function(selector) {
    var columns = [],
      items = [],
      item = {},
      selected = [],
      offset = 0,
      limit = 0,
      total = 0,
      pagination = {},
      resource = {},
      titleHandler = function() {},
      checkAllHandler = function() {},
      checkHandler = function() {},
      clearHandler = function() {},
      scrollHandler = function() {},
      resizeHandler = function() {},
	  sortHandler = function() {},
      docKeydownHandler = function() {},
      changePageHandler = function() {},
      selectHandler = function() {};
    
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.offset = parseInt(data.offset || 0);
      context.limit = parseInt(data.limit || 0);
      context.total = parseInt(data.total || 0);
      
      context.columns = data.columns || [];
      context.items = data.items || [];
      context.selected = data.selected || [];
    }
    
    function bindColumns(context) {
      if (context.columns.length === 0) {
	    return;
	  }
	  
      var headHTML = getTableHeadHTML(context);
	  var head = helpers.query('.head', context.container);
	  if (helpers.isEmpty(head)) {
        context.container.innerHTML = getTableHTML();
        head = helpers.query('.head', context.container);
	  }
	  head.innerHTML = headHTML;

      var columns = helpers.queryAll(
        'thead > tr > th > .sortable', context.container);
      helpers.toArray(columns).forEach(function(column) {
        column.removeEventListener('click', titleHandler, false);  
      });
      
      titleHandler = bindTitle(context);
      helpers.toArray(columns).forEach(function(column) {
        column.addEventListener('click', titleHandler, false);
      });

      var checkbox = helpers.query(
        'thead > tr > th > .checkbox', context.container);
      checkbox.removeEventListener('click', checkAllHandler, false);
      
      checkAllHandler = bindCheckAll(context);
      checkbox.addEventListener('click', checkAllHandler, false);
    }
    
    function bindItems(context) {
      var body = helpers.query('.body', context.container);
	  if (helpers.isEmpty(body)) {
        context.container.innerHTML = getTableHTML();
        body = helpers.query('.body', context.container);
	  }
      
      var bodyHTML = getTableBodyHTML(context);
      body.innerHTML = bodyHTML;
      
      var footHTML = getTableFootHTML(context);
      var foot = helpers.query('.foot', context.container);
      foot.innerHTML = footHTML;
      
      var checkboxes = helpers.queryAll(
        'tbody > tr > td > .checkbox', context.container);
      helpers.toArray(checkboxes).forEach(function(checkbox) {
        checkbox.removeEventListener('click', checkHandler, false);  
      });
      
      checkHandler = bindCheck(context);
      helpers.toArray(checkboxes).forEach(function(checkbox) {
        checkbox.addEventListener('click', checkHandler, false);
      });
      
      var pager = helpers.query('.pagination', context.container);
      pagination = UI.Pagination(pager);
      pagination.bind(context)
        .change(changePagination, context);
      
      helpers.query(".scrollable", context.container)
        .removeEventListener('scroll', scrollHandler, false);
      
      scrollHandler = bindTableScroll(context.container);
      helpers.query(".scrollable", context.container)
        .addEventListener('scroll', scrollHandler, false);
      
      document.removeEventListener('keydown', docKeydownHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);

      window.removeEventListener('resize', resizeHandler, false);
      
      resizeHandler = bindWindowResize(context.container);
      window.addEventListener('resize', resizeHandler, false);
      setTimeout(resizeHandler, 100);
    }
    
    function getTableHTML() {
      return '<div class="head"></div>'
        + '<div class="body"></div>'
        + '<div class="foot"></div>';
    }
    
    function getTableHeadHTML(context) {
      var html = '<table>';
      
      html = html + '<colgroup>';
      html = html + '<col class="checkbox"/>';
      context.columns.forEach(function(column) {
        if (column.hidden === "false") {
          html = html + '<col class="' + column.id + '"/>';
        }
      });
      html = html + '</colgroup>';
      
      html = html + '<thead><tr><th><div class="checkbox" data-value="'
        + item.id + '" tabindex="0">'
        + '<i class="checked fa fa-check-square-o"></i>'
		+ '<i class="unchecked fa fa-square-o"></i></div></th>';
      
      context.columns.forEach(function(column) {
        if (column.hidden === "false") {
          var sort = (column.sort === '') ? '' : column.sort;
          html = html + '<th><div class="fixed title sortable ' 
		    + sort + '" data-value="' + column.id + '">'
            + '<i class="down fa fa-long-arrow-down"></i>'
		    + '<i class="up fa fa-long-arrow-up"></i>'
            + column.title + '</div></th>';
        }
      });
      
      html = html + '</tr></thead></table>';
      return html;
    }
    
    function getTableBodyHTML(context) {
      var html = '<div class="scrollable"><table>';
      
      html = html + '<colgroup>';
      html = html + '<col class="checkbox"/>';
      context.columns.forEach(function(column) {
        if (column.hidden === "false") {
          html = html + '<col class="' + column.id + '"/>';
        }
      });
      html = html + '</colgroup>';
      
      html = html + '<tbody>';
      if (context.items.length === 0) {
        html = html + '<tr><td colspan="' + context.columns.length + '">'
          + resource.tableRecordsEmpty + '</td></tr>';
      }
      else {
        context.items.forEach(function(item) {
          html = html + '<tr><td>';
          html = html + '<div class="checkbox" data-value="'
            + item.id + '" tabindex="0">'
            + '<i class="checked fa fa-check-square-o"></i>'
		    + '<i class="unchecked fa fa-square-o"></i></div></td>';
          
          context.columns.forEach(function(column) {
            if (column.hidden === "false") {
              html = html + '<td><div class="fixed">'
                + item[column.id] + '</div></td>';
            }
          });
          
          html = html + '</tr>';
        });
      }
      
      html = html + '</tbody></table></div>';
      return html;
    }
    
    function getTableFootHTML(context) {
      var html = '<div class="left"></div>';
      
      html = html + '<div class="right"><div class="pagination">'
        + '<div class="label">' + context.resource.tablePageLength + '</div>'
        + '<div class="limit dropdown" select-menu>'
        + '<button type="button" class="toggle" flat-icon><span class="text">'
        + context.resource.tenRecords + '</span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu up selectable">'
        + '<li data-value="10" class="item">'
        + '<i class="fa fa-check"></i><span class="text">'
        + context.resource.tableTenRecords + '</span></li>'
        + '<li data-value="20" class="item">'
        + '<i class="fa fa-check"></i><span class="text">'
        + context.resource.tableTwentyRecords + '</span></li>'
        + '<li data-value="30" class="item">'
        + '<i class="fa fa-check"></i><span class="text">'
        + context.resource.tableThirtyRecords + '</span></li>'
        + '<li data-value="50" class="item">'
        + '<i class="fa fa-check"></i><span class="text">'
        + context.resource.tableFiftyRecords + '</span></li>'
        + '<li data-value="100" class="item">'
        + '<i class="fa fa-check"></i><span class="text">'
        + context.resource.tableHundredRecords + '</span></li>'
        + '</ul></div>'
        + '<div class="offset"></div><div class="label">-</div>'
        + '<div class="end"></div><div class="label">'
        + context.resource.tablePageTotalSeparator + '</div>'
        + '<div class="total"></div>'
        + '<button type="button" class="previous" flat-icon>'
        + '<i class="fa fa-angle-left"></i></button>'
        + '<button type="button" class="next" flat-icon>'
        + '<i class="fa fa-angle-right"></i></button>'
        + '</div>';
      
      return html;
    }
    
    function bindTableScroll(container) {
      return function(event) {
        var scrollable = helpers.query('.scrollable', container);
        var head = helpers.query('.head', container);
        head.scrollLeft = scrollable.scrollLeft;
      };
    }
    
    function bindDocKeydown(container) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
		while (!target.classList.contains('table')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if (target === container) {
          switch (event.keyCode) {
            case 32:
              var checkbox = helpers.query('.checkbox:focus', container);
              var event = new CustomEvent('click', {});
              checkbox.dispatchEvent(event);
              break;
          }
        }
      };
    }
    
    function bindWindowResize(container) {
      return function(event) {
        var head = helpers.query('.head', container),
          scrollable = helpers.query('.scrollable', container);
        
        head.style.maxWidth = scrollable.clientWidth + 'px';
      };
    }
	
    function updateStatus(context) {
      var container = context.container;
      var rows = helpers.queryAll('tbody > tr', container);
      helpers.toArray(rows).forEach(function(row) {
        row.classList.remove('selected');
      });
      
      context.selected.forEach(function(item) {
        var checkbox = helpers.query(
          '.checkbox[data-value="' + item.id + '"]', container);
        if (!helpers.isEmpty(checkbox)) {
          checkbox.parentNode.parentNode.classList.add('selected');
        }
      });
      
      var row = helpers.query('thead > tr', container);
      if (context.selected.length === items.length) {
        row.classList.add('selected');
      }
      else {
        row.classList.remove('selected');
      }
    }
    
	function bindTitle(context, callback) {
      return function(event) {
        event = event || window.event;
        
	    var target = event.currentTarget;
        context.columns.forEach(function(column) {
          if (column.id === target.dataset.value) {
		    if (target.classList.contains('ascending')) {
              column.sort = 'descending';
			}
			else if (target.classList.contains('descending')) {
              column.sort = 'ascending';
            }
			else if (column.id === 'modified') {
			  column.sort = 'descending';
            }
            else {
              column.sort = 'ascending';
            }
		  }
		  else {
		    column.sort = '';
		  }
        });
        
		var event = new CustomEvent('sort', {});
        context.container.dispatchEvent(event);
      };
	}
    
    function bindCheckAll(context) {
      return function(event) {
        if ( context.selected.length === context.items.length) {
          context.selected = [];
        }
        else {
          context.selected = context.items;
        }
        
        var event = new CustomEvent('select', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function bindCheck(context) {
      return function(event) {
        event = event || window.event;
        
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
        
        var event = new CustomEvent('select', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function changePagination(context) {
      context.offset = this.offset;
      context.limit = this.limit;
      
      var event = new CustomEvent('pagechange', {});
      context.container.dispatchEvent(event);
    }
    
    function bindSort(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
    }
    
    function bindChangePage(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
    }
    
    function bindSelect(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
    }
    
    function removeItem(context, id) {
      for (var i = 0, length = context.items.length; i < length; i++) {
        if (context.items[i].id === id) {
          context.items.splice(i, 1);
          break;
        }
      }
        
      var checkbox = helpers.query(
        '.checkbox[data-value="' + id + '"]', context.container);
      checkbox.removeEventListener('click', checkHandler, false);
      checkbox.parentNode.parentNode.classList.add('deleted');
      
      if (context.items.length === 0) {
        context.offset = 0;
        context.total = 0;
      }
      bindItems(context);
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get offset() {
        return offset;
      },
      
      set offset(value) {
        offset = value;
      },

      get limit() {
        return limit;
      },
      
      set limit(value) {
        limit = value;
      },
      
      get total() {
        return total;
      },
      
      set total(value) {
	    total = value;
      },

      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      get columns() {
        return columns;
      },
      
      set columns(value) {
        columns = value;
		bindColumns(this);
      },
      
      get items() {
        return items;
      },
      
      set items(value) {
        items = value;
		bindItems(this);
        updateStatus(this);
      },
	  
      get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
        updateStatus(this);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
	  
	  sort: function(callback, data) {
        this.container.removeEventListener('sort', sortHandler, false);
        
        sortHandler = bindSort(this, callback, data);
        this.container.addEventListener('sort', sortHandler, false);
		return this;
	  },
      
      changePage: function(callback, data) {
        this.container.removeEventListener(
          'pagechange', changePageHandler, false);
        
        changePageHandler = bindChangePage(this, callback, data);
        this.container.addEventListener(
          'pagechange', changePageHandler, false);
        return this;
      },
      
      select: function(callback, data) {
        this.container.removeEventListener('select', selectHandler, false);
        
        selectHandler = bindSelect(this, callback, data);
        this.container.addEventListener('select', selectHandler, false);
        return this;
      },
      
      remove: function(id) {
        removeItem(this, id);
        return this;
      },
      
      refresh: function() {
        bindColumns(this);
        bindItems(this);
        updateStatus(this);
        
        var event = new CustomEvent('select', {});
        this.container.dispatchEvent(event);
        return;
      }
    };
  };
})();