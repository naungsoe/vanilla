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
  window.UI.ColorPicker = function(selector) {
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
	  context.items = data.items || [
        //red
        '#d32f2f', '#e53935', '#ef5350',
        '#e57373', '#ef9a9a', '#ffcdd2',
        
        //purple
        '#7b1fa2', '#8e24aa', '#ab47bc',
        '#ba68C8', '#ce93d8', '#e1bee7',
        
        //blue
        '#1976d2', '#1e88e5', '#42a5f5',
        '#64b5f6', '#90caf9', '#bbdefb',
        
        //green
        '#388e3c', '#43a047', '#66bb6a',
        '#81c784', '#a5d6a7', '#c8e6c9',
        
        //yellow
        '#fbc02d', '#fdd835', '#ffee58',
        '#fff176', '#fff59d', '#fff9c4',
        
        //black
        '#252525', '#616161', '#9e9e9e',
        '#bdbdbd', '#e0e0e0', '#ffffff'
      ];
	  context.selected = data.selected || '';
    }
    
    function bindColorPicker(context) {
	  if (context.items.length > 0) {
		var plate = helpers.query(".plate", context.container);
        plate.innerHTML = getColorPlateHTML(context);
	  }
	  
      var toggle = helpers.query('.toggle', context.container);
      toggle.removeEventListener('click', toggleHandler, false);
      
      toggleHandler = bindToggle(context.container);
      toggle.addEventListener('click', toggleHandler, false);

      var items = helpers.queryAll('.plate > .item', context.container);
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
    
	function getColorPlateHTML(context) {
      var html = '';
      context.items.forEach(function(item) {
	    html = html + '<li data-value="' + item + '" class="item" '
          + 'style="background-color: ' + item + ';">'
          + '<i class="fa fa-check"></i></li>';
      });
      return html;
	}
	
    function bindToggle(container) {
      return function(event) {
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
		while (!target.classList.contains('colorpicker')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target === container)
		    && (container.classList.contains('open'))) {
          switch (event.keyCode) {
            case 13:
              var item = helpers.query('.plate > .highlight', container);
              if (!helpers.isEmpty(item)) {
                container.classList.toggle('open');
                
                var event = new CustomEvent('click', {});
                item.dispatchEvent(event);
              }
              break;
            
            case 38:
              var item = helpers.query('.plate > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.plate > .selected', container);
              }
              
              if (helpers.isEmpty(item)) {
                item = helpers.query('.plate > .item:last-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.previousElementSibling
                  || helpers.query('.plate > .item:last-child', container);
              }
              item.classList.add('highlight');
              
              var plate = helpers.query('.plate', container);
              plate.scrollTop = item.offsetTop;
              break;
            
            case 40:
              var item = helpers.query('.plate > .highlight', container);
              if (helpers.isEmpty(item)) {
                item = helpers.query('.plate > .selected', container);
              }
              
              if (helpers.isEmpty(item)) {
                item = helpers.query('.plate > .item:first-child', container);
              }
              else {
                item.classList.remove('highlight');
                item = item.nextElementSibling
                  || helpers.query('.plate > .item:first-child', container);
              }
              item.classList.add('highlight');
              
              var plate = helpers.query('.plate', container);
              plate.scrollTop = item.offsetTop;
              break;
          }
        }
      };
    }
    
    function bindDocClick(container) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
		while (!target.classList.contains('colorpicker')) {
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
      
      var items = helpers.queryAll('.plate > .highlight', context.container);
      helpers.toArray(items).forEach(function(item) {
        item.classList.remove('selected');
      });
      
      var item = helpers.query(
        '.item[data-value="' + context.selected + '"]', context.container);
      item.classList.add('selected');
    }
    
    function bindItem(context) {
      return function(event) {
        event = event || window.event;
        
        var container = context.container,
          highlight = helpers.query('.plate > .highlight', container);
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
        
        var highlight = helpers.query('.plate > .highlight', container);
        if (!helpers.isEmpty(highlight)) {
          highlight.classList.remove('highlight');
        }
        
        event.currentTarget.classList.add('highlight');
      };
    }
    
    function bindMouseLeave(container) {
      return function(event) {
        var highlight = helpers.query('.plate > .highlight', container);
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
		bindColorPicker(this);
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