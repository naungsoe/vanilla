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
	  var menu = helpers.query('.menu', context.container),
        html = '';
      
      if (menu.classList.contains('selectable')) {
          context.items.forEach(function(item) {
          html = html + '<li data-value="' + item.id + '" '
            + 'class="item fixed"><i class="fa fa-check"></i>'
            + '<span class="text">' + item.name + '</span></li>';
        });
      }
      else {
        context.items.forEach(function(item) {
          html = html + '<li data-value="' + item.id + '" '
            + 'class="item fixed">' + item.name + '</li>';
        });
      }
	  return html;
	}
	
    function bindToggle(container) {
      return function(event) {
        var menu = helpers.query(".menu", container);
        if (!helpers.isNull(container.getAttribute("select"))) {
          var maxViewableItems = 7,
            items = helpers.queryAll(".item", menu),
            selected = helpers.query(".selected", menu),
            itemHeight = selected.offsetHeight,
            itemPositionTop = selected.offsetTop;
          
          helpers.toArray(items).forEach(function(item, index, items) {
            if (item === selected) {
              var itemIndex = (index + 1),
                positionTop = 0,
                scrollTop = 0;
              
              if (itemIndex < maxViewableItems) {
                positionTop = -((itemIndex - 1) * itemHeight);
                scrollTop = 0;
              }
              else {
                if ((items.length - itemIndex) < maxViewableItems) {
                  positionTop = -((maxViewableItems - 1) * itemHeight);
                  scrollTop = ((itemIndex - maxViewableItems) * itemHeight);
                }
                else {
                  while (itemIndex > maxViewableItems) {
                    itemIndex = itemIndex - maxViewableItems;
                  }
                  positionTop = -((itemIndex - 1) * itemHeight);
                  scrollTop = (itemPositionTop - (itemIndex * itemHeight)
                    + itemHeight);
                }
              }
              menu.style.top = positionTop + 'px';
              menu.scrollTop = scrollTop;
            }
          });
        }
        container.classList.toggle('open');
        triggerReflow(container);
      };
    }
    
    function triggerReflow(container) {
      var reflow = helpers.query('.reflow', container);
      if (!helpers.isEmpty(reflow)) {
        reflow.parentNode.removeChild(reflow);
      }
      
      setTimeout(function initiateReflow() {
        reflow = document.createElement('div');
        reflow.classList.add('reflow');
        container.appendChild(reflow);
      }, 100);
    }
    
    function bindDocKeydown(container) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
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
                item = helpers.query('.menu > .selected', container);
              }
              
              if (helpers.isEmpty(item)) {
                item = helpers.query('.menu > .item:last-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.previousElementSibling
                  || helpers.query('.menu > .item:last-child', container);
              }
              item.classList.add('highlight');
              
              var menu = helpers.query('.menu', container);
              menu.scrollTop = item.offsetTop;
              break;
            
            case 40:
              var item = helpers.query('.menu > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.menu > .selected', container);
              }
              
              if (helpers.isEmpty(item)) {
                item = helpers.query('.menu > .item:first-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.nextElementSibling
                  || helpers.query('.menu > .item:first-child', container);
              }
              item.classList.add('highlight');
              
              var menu = helpers.query('.menu', container);
              menu.scrollTop = item.offsetTop;
              break;
          }
        }
      };
    }
    
    function bindDocClick(container) {
      return function(event) {
        event = event || window.event;
        
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
      var itemText = helpers.query('.text', item);
      if (!helpers.isEmpty(itemText)) {
        if (helpers.isEmpty(itemText.textContent)) {
          text.innerHTML = itemText.innerHTML;
        }
        else {
          text.textContent = itemText.textContent;
        }
      }
      else {
        text.textContent = item.textContent;
      }
	  
      var items = helpers.queryAll('.menu > .item', context.container);
      helpers.toArray(items).forEach(function(item) {
        item.classList.remove('selected');
      });
      item.classList.add('selected');
    }
    
    function bindItem(context) {
      return function(event) {
        event = event || window.event;
        
        var container = context.container,
          highlight = helpers.query('.menu > .highlight', container);
        if (!helpers.isEmpty(highlight)) {
          highlight.classList.remove('highlight');
        }
        
        event.currentTarget.classList.add('selected');
        context.selected = event.currentTarget.dataset.value;
        container.classList.toggle('open');
        
        var event = new CustomEvent('change', {});
        container.dispatchEvent(event);
      };
    }
    
    function bindMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var highlight = helpers.query('.menu > .highlight', container);
        if (!helpers.isEmpty(highlight)) {
          highlight.classList.remove('highlight');
        }
        
        event.currentTarget.classList.add('highlight');
      };
    }
    
    function bindMouseLeave(container) {
      return function(event) {
        var highlight = helpers.query('.menu > .highlight', container);
        if (!helpers.isEmpty(highlight)) {
          highlight.classList.remove('highlight');
        }
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