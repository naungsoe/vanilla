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
  window.UI.RichText = function(selector) {
    var content = '',
      focusHandler = function() {},
      boldHandler = function() {},
      italicHandler = function() {},
      underlineHandler = function() {},
      changeHandler = function() {};
    
    function bindData(context, data) {
      context.content = data.content || '';
    }
    
    function bindRichText(context) {
      var toolbar = helpers.query('.tool-bar', context.container),
        editor = helpers.query('.editor', context.container),
        textarea = helpers.query('.textarea', context.container);
      
      editor.contentEditable  = 'true';
      textarea.classList.add('hide');
      
      toolbar.innerHTML = getToolbarHTML(context);
      bindToolbar(context);
    }
    
    function getToolbarHTML(context) {
      var html = '<div class="primary">'
        + '<div class="dropdown font-family">'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text fixed">Sans Serif</span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu left selectable">'
        + '<li data-value="Arial" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Arial</span</li>'
        + '<li data-value="Arial Black" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Arial Black</span></li>'
        + '<li data-value="Courier New" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Courier New</span></li>'
        + '<li data-value="Sans Serif" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Sans Serif</span></li>'
        + '<li data-value="Tahoma" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Tahoma</span></li>'
        + '<li data-value="Times New Roman" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Times New Roman</span></li>'
        + '</ul></div>'
        + '<div class="dropdown font-size">'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text fixed">Normal</span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu left selectable">'
        + '<li data-value="small" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Small</span></li>'
        + '<li data-value="medium" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Normal</span></li>'
        + '<li data-value="Large" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Large</span></li>'
        + '<li data-value="xx-large" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text">Giant</span></li>'
        + '</ul></div>'
        + '<button type="button" class="link" flat>'
        + '<i class="fa fa-link"></i></button>'
        + '<button type="button" class="format" flat>'
        + '<i class="fa fa-eraser"></i></button>'
        + '</div>';
      
      html = html + '<div class="secondary">'
        + '<button type="button" class="bold" flat>'
        + '<i class="fa fa-bold"></i></button>'
        + '<button type="button" class="italic" flat>'
        + '<i class="fa fa-italic"></i></button>'
        + '<button type="button" class="underline" flat>'
        + '<i class="fa fa-underline"></i></button>'
        + '<div class="dropdown color" select>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-font"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu selectable"></ul></div>'
        + '<div class="dropdown align" select>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-align-left"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu selectable"></ul></div>'
        + '<div class="dropdown bullet" select>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-list"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu selectable"></ul></div>'
        + '</div>';
      
      return html;
    }
    
    function bindToolbar(context) {
      var toolbar = helpers.query('.tool-bar', context.container);
      
      var fontFamily = UI.Dropdown(helpers.query('.font-family', toolbar));
      fontFamily.bind({ selected: 'Sans Serif' })
        .change(changeFontFamily, context.container);
      
      var fontSize = UI.Dropdown(helpers.query('.font-size', toolbar));
      fontSize.bind({ selected: 'medium' })
        .change(changeFontSize, context.container);
      
      var bold = helpers.query('.bold', toolbar)
      bold.removeEventListener('click', boldHandler, false);
      
      boldHandler = execCommand('bold', '');
      bold.addEventListener('click', boldHandler, false);
      
      var italic = helpers.query('.italic', toolbar);
      italic.removeEventListener('click', italicHandler, false);
      
      italicHandler = execCommand('italic', '');
      italic.addEventListener('click', italicHandler, false);
      
      var underline = helpers.query('.underline', toolbar);
      underline.removeEventListener('click', underlineHandler, false);
      
      underlineHandler = execCommand('underline', '');
      underline.addEventListener('click', underlineHandler, false);
    }
    
    function changeFontFamily() {
      document.execCommand('fontName', false, this.selected);
    }
    
    function changeFontSize(container) {
      document.execCommand('fontSize', false, this.selected);
    }
    
    function execCommand(command, value) {
      return function(event) {
        document.execCommand(command, false, value);
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
	  
	  get content() {
        return content;
      },
      
      set content(value) {
        content = value;
		bindRichText(this);
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