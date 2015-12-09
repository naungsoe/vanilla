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
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.Pagination = function(selector) {
    var offset = 0,
      end = 0,
      limit = 0,
      total = 0,
      pageLimit = {},
      pageLimitHandler = function() {},
      previousHandler = function() {},
      nextHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data) {
      context.offset = parseInt(data.offset || 0);
      context.limit = parseInt(data.limit || 0);
      context.total = parseInt(data.total || 0);
      
      var end = (context.offset + context.limit - 1);
      context.end = (end < context.total) ? end : context.total;
    }
    
    function bindPagination(context) {
      if (helpers.isEmpty(pageLimit)) {
        var dropdown = helpers.query('.dropdown', context.container);
        pageLimit = UI.Dropdown(dropdown);
      }
      pageLimit.bind({ selected: context.limit })
        .change(changePageLimit, context);
      
      var previous = helpers.query('.previous', context.container);
      previous.removeEventListener('click', previousHandler, false);
      
      previousHandler = bindPrevious(context);
      previous.addEventListener('click', previousHandler, false);
      
      var next = helpers.query('.next', context.container);
      next.removeEventListener('click', nextHandler, false);
      
      nextHandler = bindNext(context);
      next.addEventListener('click', nextHandler, false);
    }
    
    function updateStatus(context) {
      if ((context.offset == 0) || (context.offset == 1)) {
        var previous = helpers.query('.previous', context.container);
        previous.setAttribute('disabled', true);
      }
      else {
        var next = helpers.query('.next', context.container);
        next.removeAttribute('disabled');
      }
      
      if (context.end < context.total) {
        var next = helpers.query('.next', context.container);
        next.removeAttribute('disabled');
      }
      else {
        var previous = helpers.query('.previous', context.container);
        previous.setAttribute('disabled', true);
      }
    }
    
    function changePageLimit(context) {
      context.limit = this.selected;
      
      var event = new CustomEvent('change', {});
      context.container.dispatchEvent(event);
    }
    
    function bindPrevious(context) {
      return function(event) {
        context.offset = context.offset - context.limit;
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
      };
    }
    
    function bindNext(context, callback) {
      return function(event) {
        context.offset = context.offset + context.limit;
        
        var event = new CustomEvent('change', {});
        context.container.dispatchEvent(event);
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
      
      get offset() {
        return offset;
      },
      
      set offset(value) {
        var offsetSpan = helpers.query('.offset', this.container);
        offsetSpan.textContent = value;
        offset = value;
      },
      
      get end() {
        return end;
      },
      
      set end(value) {
	    end = value;
        var endSpan = helpers.query('.end', this.container);
        endSpan.textContent = end;
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
        var totalSpan = helpers.query('.total', this.container);
        totalSpan.textContent = total;
      },
      
      bind: function(data) {
        bindData(this, data);
        bindPagination(this);
        updateStatus(this);
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