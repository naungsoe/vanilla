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
  window.UI.AppNavigation = function(selector) {
    var items = [],
      application = '',
      selected = '',
      backdropHandler = function() {},
      menuHandler = function() {},
      nameHandler = function() {},
      selectHandler = function() {};
    
    function bindData(context, data) {
      context.selected = data.selected || '';
      context.items = data.items || [];
      
      var selected = context.items.filter(function(item) {
        return (item.id === context.selected);
      });
      context.application = selected[0].name;
    }
    
    function bindItems(context) {
      var navData = { items: context.items, selected: context.selected };
      var globalNavigation = UI.Navigation('#globalNavigation');
      globalNavigation.bind(navData)
        .select(selectGlobalNavigation, context);
      
      bindBackdrop(context);
      
      var menu = helpers.query('.menu', context.container);
      menu.removeEventListener('click', menuHandler, false);  
      
      menuHandler = bindMenu(context);
      menu.addEventListener('click', menuHandler, false);
      
      var name = helpers.query('.name', context.container);
      name.removeEventListener('click', nameHandler, false);  
      
      nameHandler = bindName(context);
      name.addEventListener('click', nameHandler, false);
    }
    
    function selectGlobalNavigation(context) {
      context.selected = this.selected;
      
      var event = new CustomEvent('change', {});
      context.container.dispatchEvent(event);
    }
    
    function bindBackdrop(context) {
      var backdrop = helpers.query('.backdrop', context.container);
      if (helpers.isEmpty(backdrop)) {
        var backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        backdrop.classList.add('hide');
        context.container.appendChild(backdrop);
      }
      backdrop.removeEventListener('click', backdropHandler, false);  
      
      backdropHandler = bindBackdropClick(context);
      backdrop.addEventListener('click', backdropHandler, false);
    }
    
    function bindBackdropClick(context) {
      return function(event) {
        var navigation = helpers.query('.app-global-nav')
          ,backdrop = helpers.query('.backdrop', context.container);
        
        navigation.classList.remove('open');
        backdrop.classList.add('hide');
        backdrop.classList.remove('open');
      };
    }
    
    function bindMenu(context) {
      return function(event) {
        var navigation = helpers.query('.app-global-nav'),
          backdrop = helpers.query('.backdrop', context.container);
        
        navigation.classList.add('open');
        backdrop.classList.remove('hide');
        backdrop.classList.add('open');
      };
    }
    
    function bindName(context) {
      return function(event) {
        var selected = context.items.filter(function(item) {
          return (item.id === context.selected);
        });
        helpers.redirect(selected[0].url);
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
      
      get items() {
        return items;
      },
      
      set items(value) {
        items = value;
        bindItems(this);
      },
      
      get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
      },
      
      get application() {
        return application;
      },
      
      set application(value) {
        application = value;
        var name = helpers.query('.name', this.container);
        name.innerHTML = application;
      },
      
      bind: function(data) {
        bindData(this, data);
        return this;
      },
      
      select: function(callback, data) {
        this.container.removeEventListener('change', selectHandler, false);
        
        selectHandler = bindSelect(this, callback, data);
        this.container.addEventListener('change', selectHandler, false);
        return this;
      }
    };
  };
})();