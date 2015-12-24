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
      changes = 0,
      range = {},
      unformatHandler = function() {},
      boldHandler = function() {},
      italicHandler = function() {},
      underlineHandler = function() {},
      strikethroughHandler = function() {},
      subscriptHandler = function() {},
      superscriptHandler = function() {},
      undoHandler = function() {},
      redoHandler = function() {},
      moreHandler = function() {},
      outdentHandler = function() {},
      indentHandler = function() {},
      orderedListHandler = function() {},
      unorderedListHandler = function() {},
      linkHandler = function() {},
      editorFocusHandler = function() {},
      editorBlurHandler = function() {},
      editorChangeHandler = function() {},
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
      bindEditor(context);
    }
    
    function getToolbarHTML(context) {
      var html = '<div class="primary">'
        + '<button type="button" class="bold" flat>'
        + '<i class="fa fa-bold"></i></button>'
        + '<button type="button" class="italic" flat>'
        + '<i class="fa fa-italic"></i></button>'
        + '<button type="button" class="underline" flat>'
        + '<i class="fa fa-underline"></i></button>'
        + '<button type="button" class="strikethrough" flat>'
        + '<i class="fa fa-strikethrough"></i></button>'
        + '<div class="separator"></div>'
        + '<button type="button" class="subscript" flat>'
        + '<i class="fa fa-subscript"></i></button>'
        + '<button type="button" class="superscript" flat>'
        + '<i class="fa fa-superscript"></i></button>'
        + '<div class="separator"></div>'
        + '<button type="button" class="unformat" flat>'
        + '<i class="fa fa-eraser"></i></button>'
        + '</div>'
      
      html = html + '<div class="primary">'
        + '<div class="colorpicker text-color">'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-font"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition plate"></ul></div>'
        + '<div class="colorpicker back-color">'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-font"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition plate"></ul></div>'
        + '<div class="dropdown text-align" select-menu>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text"><i class="fa fa-align-left"></i></span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu selectable">'
        + '<li data-value="justifyLeft" class="item fixed">'
        + '<i class="fa fa-check"></i><span class="text">'
        + '<i class="fa fa-align-left"></i></span></li>'
        + '<li data-value="justifyCenter" class="item fixed">'
        + '<i class="fa fa-check"></i><span class="text">'
        + '<i class="fa fa-align-center"></i></span></li>'
        + '<li data-value="justifyRight" class="item fixed">'
        + '<i class="fa fa-check"></i><span class="text">'
        + '<i class="fa fa-align-right"></i></span></li>'
        + '<li data-value="justifyFull" class="item fixed">'
        + '<i class="fa fa-check"></i><span class="text">'
        + '<i class="fa fa-align-justify"></i></span></li>'
        + '</ul></div>'
        + '<div class="separator"></div>'
        + '<button type="button" class="undo" flat>'
        + '<i class="fa fa-rotate-left"></i></button>'
        + '<button type="button" class="redo" flat>'
        + '<i class="fa fa-rotate-right"></i></button>'
        + '<button type="button" class="more" flat>'
        + '<i class="fa fa-chevron-down expand"></i>'
        + '<i class="fa fa-chevron-up collapse"></i></button>'
        + '</div>';
      
      html = html + '<div class="secondary hide">'
        + '<div class="dropdown font-family" select-menu>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text fixed">Sans Serif</span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu left selectable">'
        + '<li data-value="Arial" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Arial;">'
        + 'Arial</span</li>'
        + '<li data-value="Arial Black" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Arial Black;">'
        + 'Arial Black</span></li>'
        + '<li data-value="Courier New" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Courier New;">'
        + 'Courier New</span></li>'
        + '<li data-value="Sans-Serif" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Sans-Serif;">'
        + 'Sans Serif</span></li>'
        + '<li data-value="Serif" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Serif;">'
        + 'Serif</span></li>'
        + '<li data-value="Tahoma" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Tahoma;">'
        + 'Tahoma</span></li>'
        + '<li data-value="Times New Roman" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text" style="font-family: Times New Roman;">'
        + 'Times New Roman</span></li>'
        + '</ul></div>'
        + '<div class="dropdown font-size" select-menu>'
        + '<button type="button" class="toggle" flat-icon>'
        + '<span class="text fixed">Normal</span>'
        + '<i class="fa fa-caret-down"></i></button>'
        + '<ul class="transition menu left selectable">'
        + '<li data-value="2" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text"><font size="2">'
        + 'Small</font></span></li>'
        + '<li data-value="3" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text"><font size="3">'
        + 'Normal</font></span></li>'
        + '<li data-value="4" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text"><font size="4">'
        + 'Large</font></span></li>'
        + '<li data-value="6" class="item fixed">'
        + '<i class="fa fa-check"></i>'
        + '<span class="text"><font size="6">'
        + 'Giant</font></span></li>'
        + '</ul></div>'
        + '<div class="separator"></div>'
        + '<button type="button" class="outdent" flat>'
        + '<i class="fa fa-outdent"></i></button>'
        + '<button type="button" class="indent" flat>'
        + '<i class="fa fa-indent"></i></button>'
        + '</div>';
      
      html = html + '<div class="secondary hide">'
        + '<button type="button" class="ordered-list" flat>'
        + '<i class="fa fa-list-ol"></i></button>'
        + '<button type="button" class="unordered-list" flat>'
        + '<i class="fa fa-list-ul"></i></button>'
        + '<div class="separator"></div>'
        + '<button type="button" class="link" flat>'
        + '<i class="fa fa-link"></i></button>'
        + '<button type="button" class="image" flat>'
        + '<i class="fa fa-file-image-o"></i></button>'
        + '<button type="button" class="media" flat>'
        + '<i class="fa fa-film"></i></button>'
        + '<button type="button" class="table" flat>'
        + '<i class="fa fa-table"></i></button>'
        + '</div>';
      
      return html;
    }
    
    function bindToolbar(context) {
      var toolbar = helpers.query('.tool-bar', context.container);
      var unformat = helpers.query('.unformat', toolbar)
      unformat.removeEventListener('click', unformatHandler, false);
      
      unformatHandler = execCommand('removeFormat', '');
      unformat.addEventListener('click', unformatHandler, false);
      
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
      
      var strikethrough = helpers.query('.strikethrough', toolbar);
      strikethrough.removeEventListener('click', strikethroughHandler, false);
      
      strikethroughHandler = execCommand('strikethrough', '');
      strikethrough.addEventListener('click', strikethroughHandler, false);
      
      var subscript = helpers.query('.subscript', toolbar);
      subscript.removeEventListener('click', subscriptHandler, false);
      
      subscriptHandler = execCommand('subscript', '');
      subscript.addEventListener('click', subscriptHandler, false);
      
      var superscript = helpers.query('.superscript', toolbar);
      superscript.removeEventListener('click', superscriptHandler, false);
      
      superscriptHandler = execCommand('superscript', '');
      superscript.addEventListener('click', superscriptHandler, false);
      
      var textColor = UI.ColorPicker(helpers.query('.text-color', toolbar));
      textColor.bind({ selected: '' })
        .change(changeTextColor, context);
      
      var backColor = UI.ColorPicker(helpers.query('.back-color', toolbar));
      backColor.bind({ selected: '' })
        .change(changeBackColor, context);
      
      var textAlign = UI.Dropdown(helpers.query('.text-align', toolbar));
      textAlign.bind({ selected: 'justifyLeft' })
        .change(changeTextAlign, context);
      
      var undo = helpers.query('.undo', toolbar);
      undo.removeEventListener('click', undoHandler, false);
      
      undoHandler = execCommand('undo', '');
      undo.addEventListener('click', undoHandler, false);
      
      var redo = helpers.query('.redo', toolbar);
      redo.removeEventListener('click', redoHandler, false);
      
      redoHandler = execCommand('redo', '');
      redo.addEventListener('click', redoHandler, false);
      
      var more = helpers.query('.more', toolbar);
      more.removeEventListener('click', moreHandler, false);
      
      moreHandler = bindMore(context);
      more.addEventListener('click', moreHandler, false);
      
      var fontFamily = UI.Dropdown(helpers.query('.font-family', toolbar));
      fontFamily.bind({ selected: 'Sans-Serif' })
        .change(changeFontFamily, context);
      
      var fontSize = UI.Dropdown(helpers.query('.font-size', toolbar));
      fontSize.bind({ selected: '3' })
        .change(changeFontSize, context);
      
      var outdent = helpers.query('.outdent', toolbar);
      outdent.removeEventListener('click', outdentHandler, false);
      
      outdentHandler = execCommand('outdent', '');
      outdent.addEventListener('click', outdentHandler, false);
      
      var indent = helpers.query('.indent', toolbar);
      indent.removeEventListener('click', indentHandler, false);
      
      indentHandler = execCommand('indent', '');
      indent.addEventListener('click', indentHandler, false);
      
      var orderedList = helpers.query('.ordered-list', toolbar);
      orderedList.removeEventListener('click', orderedListHandler, false);
      
      orderedListHandler = execCommand('insertOrderedList', '');
      orderedList.addEventListener('click', orderedListHandler, false);
      
      var unorderedList = helpers.query('.unordered-list', toolbar);
      unorderedList.removeEventListener('click', unorderedListHandler, false);
      
      unorderedListHandler = execCommand('insertUnorderedList', '');
      unorderedList.addEventListener('click', unorderedListHandler, false);
      
      var link = helpers.query('.link', toolbar);
      link.removeEventListener('click', linkHandler, false);
      
      linkHandler = bindLink(context);
      link.addEventListener('click', linkHandler, false);
    }
    
    function execCommand(command, value) {
      return function(event) {
        document.execCommand(command, false, value);
      };
    }
    
    function changeTextColor(context) {
      context.restoreRange();
      document.execCommand('foreColor', false, this.selected);
    }
    
    function changeBackColor(context) {
      context.restoreRange();
      document.execCommand('backColor', false, this.selected);
    }
    
    function changeTextAlign(context) {
      context.restoreRange();
      document.execCommand(this.selected, false, '');
    }
    
    function bindMore(context) {
      return function(event) {
         var toolbar = helpers.query('.tool-bar', context.container),
           secondaries = helpers.queryAll('.secondary', toolbar),
           more = helpers.query('.more', toolbar);
         
         helpers.toArray(secondaries).forEach(function(secondary) {
           secondary.classList.toggle('hide');
         });
         more.classList.toggle('expanded');
      };
    }
    
    function changeFontFamily(context) {
      context.restoreRange();
      document.execCommand('fontName', false, this.selected);
    }
    
    function changeFontSize(context) {
      context.restoreRange();
      document.execCommand('fontSize', false, this.selected);
    }
    
    function bindLink(context) {
      return function(event) {
        
      };
    }
    
    function bindEditor(context) {
      var editor = helpers.query('.editor', context.container);
      editor.removeEventListener('focus', editorFocusHandler, false);
      editor.removeEventListener('blur', editorBlurHandler, false);
      editor.removeEventListener('change', editorChangeHandler, false);
      
      editorFocusHandler = bindEditorFocus(context);
      editor.addEventListener('focus', editorFocusHandler, false);
      
      editorBlurHandler = bindEditorBlur(context);
      editor.addEventListener('blur', editorBlurHandler, false);
      
      editorChangeHandler = bindEditorChange(context);
      editor.addEventListener('blur', editorChangeHandler, false);
    }
    
    function bindEditorFocus(context) {
      return function(event) {
        context.saveRange();
      };
    }
    
    function bindEditorBlur(context) {
      return function(event) {
        context.saveRange();
      };
    }
    
    function bindEditorChange(context) {
      return function(event) {
        var editor = helpers.query('.editor', context.container);
        context.content = editor.innerHTML;
        
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
	  
	  get changes() {
        return changes;
      },
      
	  get content() {
        return content;
      },
      
      set content(value) {
        content = value;
      },
      
      bind: function(data) {
        bindData(this, data);
		bindRichText(this);
        return this;
      },
      
      saveRange: function() {
        if (window.getSelection().rangeCount) {
          range = window.getSelection().getRangeAt(0);
        }
      },
      
      restoreRange: function() {
        if (!helpers.isEmpty(range)) {
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
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