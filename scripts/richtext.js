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
      resource = {},
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
      linkModal = {},
      unlinkHandler = function() {},
      imageHandler = function() {},
      imageModal = {},
      editHandler = function() {},
      removeHandler = function() {},
      editorClickHandler = function() {},
      editorBlurHandler = function() {},
      editorKeydownHandler = function() {},
      editorChangeHandler = function() {},
      docClickHandler = function() {},
      winResizeHandler = function() {},
      changeHandler = function() {};
    
    function bindData(context, data, resource) {
      context.resource = resource || {};
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
      
      document.removeEventListener('click', docClickHandler, false);
      
      docClickHandler = bindDocClick(context);
      document.addEventListener('click', docClickHandler, false);
      
      window.removeEventListener('resize', winResizeHandler, false);
      
      winResizeHandler = bindWindowResize(context.container);
      window.addEventListener('resize', winResizeHandler, false);
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
        + '<i class="fa fa-ellipsis-h"></i></button>'
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
      
      html = html + '<div class="secondary hide2">'
        + '<button type="button" class="ordered-list" flat>'
        + '<i class="fa fa-list-ol"></i></button>'
        + '<button type="button" class="unordered-list" flat>'
        + '<i class="fa fa-list-ul"></i></button>'
        + '<div class="separator"></div>'
        + '<button type="button" class="link" flat>'
        + '<i class="fa fa-link"></i></button>'
        + '<button type="button" class="unlink hide" flat>'
        + '<i class="fa fa-unlink"></i></button>'
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
      
      unformatHandler = execCommand('removeFormat', '', context);
      unformat.addEventListener('click', unformatHandler, false);
      
      var bold = helpers.query('.bold', toolbar)
      bold.removeEventListener('click', boldHandler, false);
      
      boldHandler = execCommand('bold', '', context);
      bold.addEventListener('click', boldHandler, false);
      
      var italic = helpers.query('.italic', toolbar);
      italic.removeEventListener('click', italicHandler, false);
      
      italicHandler = execCommand('italic', '', context);
      italic.addEventListener('click', italicHandler, false);
      
      var underline = helpers.query('.underline', toolbar);
      underline.removeEventListener('click', underlineHandler, false);
      
      underlineHandler = execCommand('underline', '', context);
      underline.addEventListener('click', underlineHandler, false);
      
      var strikethrough = helpers.query('.strikethrough', toolbar);
      strikethrough.removeEventListener('click', strikethroughHandler, false);
      
      strikethroughHandler = execCommand('strikethrough', '', context);
      strikethrough.addEventListener('click', strikethroughHandler, false);
      
      var subscript = helpers.query('.subscript', toolbar);
      subscript.removeEventListener('click', subscriptHandler, false);
      
      subscriptHandler = execCommand('subscript', '', context);
      subscript.addEventListener('click', subscriptHandler, false);
      
      var superscript = helpers.query('.superscript', toolbar);
      superscript.removeEventListener('click', superscriptHandler, false);
      
      superscriptHandler = execCommand('superscript', '', context);
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
      
      undoHandler = execCommand('undo', '', context);
      undo.addEventListener('click', undoHandler, false);
      
      var redo = helpers.query('.redo', toolbar);
      redo.removeEventListener('click', redoHandler, false);
      
      redoHandler = execCommand('redo', '', context);
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
      
      outdentHandler = execCommand('outdent', '', context);
      outdent.addEventListener('click', outdentHandler, false);
      
      var indent = helpers.query('.indent', toolbar);
      indent.removeEventListener('click', indentHandler, false);
      
      indentHandler = execCommand('indent', '', context);
      indent.addEventListener('click', indentHandler, false);
      
      var orderedList = helpers.query('.ordered-list', toolbar);
      orderedList.removeEventListener('click', orderedListHandler, false);
      
      orderedListHandler = execCommand('insertOrderedList', '', context);
      orderedList.addEventListener('click', orderedListHandler, false);
      
      var unorderedList = helpers.query('.unordered-list', toolbar);
      unorderedList.removeEventListener('click', unorderedListHandler, false);
      
      unorderedListHandler = execCommand('insertUnorderedList', '', context);
      unorderedList.addEventListener('click', unorderedListHandler, false);
      
      var link = helpers.query('.link', toolbar);
      link.removeEventListener('click', linkHandler, false);
      
      linkHandler = bindLink(context);
      link.addEventListener('click', linkHandler, false);
      
      var unlink = helpers.query('.unlink', toolbar);
      unlink.removeEventListener('click', unlinkHandler, false);
      
      unlinkHandler = bindUnlink(context);
      unlink.addEventListener('click', unlinkHandler, false);
      
      var image = helpers.query('.image', toolbar);
      image.removeEventListener('click', imageHandler, false);
      
      imageHandler = bindImage(context);
      image.addEventListener('click', imageHandler, false);
    }
    
    function execCommand(command, value, context) {
      return function(event) {
        context.restoreRange();
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
         context.restoreRange();
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
        var richtextId = context.container.getAttribute('id'),
          linkModalId = 'linkModal-' + richtextId;
        
        var view = helpers.query('#' + linkModalId);
        if (helpers.isEmpty(view)) {
          view = document.createElement('div');
          view.setAttribute('id', linkModalId);
          view.innerHTML = getLinkHTML(context);
          context.container.appendChild(view);
          
          linkModal = UI.Modal(view);
        }
        
        linkModal.bind({})
          .proceed(insertLink, context)
          .cancel(cancelInsertLink, context);
        
        updateLinkDetails(context);
      };
    }
    
    function getLinkHTML(context) {
      var richtextId = context.container.getAttribute('id');
      
      return '<div class="modal">'
        + '<header class="header">'
        + '<h3 class="title">Insert Link</h3>'
        + '</header>'
        + '<section class="content">'
        + '<form class="form form-insert-link">'
        + '<fieldset class="fieldset">'
        + '<div class="field">'
        + '<label for="linkAddress-' + richtextId + '" class="label">'
        + context.resource.linkAddressField + '</label>'
        + '<div class="control">'
        + '<input id="linkAddress-' + richtextId + '" '
        + 'type="text" value="" />'
        + '</div></div>'
        + '<div class="field">'
        + '<label for="linkText-' + richtextId + '" class="label">'
        + context.resource.linkTextField + '</label>'
        + '<div class="control">'
        + '<input id="linkText-' + richtextId + '" '
        + 'type="text" value="" />'
        + '</div></div>'
        + '</fieldset></form>'
        + '</section>'
        + '<nav class="actions">'
        + '<button type="button" class="cancel" flat>'
        + context.resource.cancelActionRequest + '</button>'
        + '<button type="button" class="proceed" flat primary>'
        + context.resource.insertActionRequest + '</button>'
        + '</nav>'
        + '</div>';
    }
    
    function insertLink(context) {
      if (isLinkFormValid(context)) {
        context.restoreRange();
        this.container.classList.add("hide");
        
        var selection = window.getSelection();
        if (helpers.isEmpty(selection.anchorNode)) {
          return;
        }
        
        var anchorNode = selection.anchorNode,
          anchorOffset = selection.anchorOffset,
          focusNode = selection.focusNode,
          focusOffset = selection.focusOffset,
          richtextId = context.container.getAttribute('id'),
          address = helpers.query('#linkAddress-' + richtextId),
          text = helpers.query('#linkText-' + richtextId),
          href = helpers.isEmail(address.value)
            ? ('mailto:' + address.value) : address.value;
        
        if (anchorNode === focusNode) {
          var start = (anchorOffset < focusOffset)
            ? anchorOffset : focusOffset;
          
          var end = (anchorOffset > focusOffset)
            ? anchorOffset : focusOffset;
          
          var node = focusNode;
          while ((node.nodeName !== 'BODY') && (node.nodeName !== 'A')) {
            if (node.classList && node.classList.contains('editor')) {
              break;
            }
            node = node.parentNode;
          }
          
          if (node.nodeName === 'A') {
            start = 0;
            end = node.textContent.length;
          }
          
          context.selectNodeContents(focusNode, start, end);
          document.execCommand('insertText', false, text.value);
          
          end = start + text.value.length;
          focusNode = selection.focusNode;
          context.selectNodeContents(focusNode, start, end);
          document.execCommand('createLink', false, href);
        }
        else {
          document.execCommand('createLink', false, href);
          focusNode = focusNode.previousSibling;
          context.selectNodeContents(focusNode, 0);
          document.execCommand('insertText', false, text.value);
        }
      }
    }
    
    function isLinkFormValid(context) {
      var richtextId = context.container.getAttribute('id'),
        address = helpers.query('#linkAddress-' + richtextId);
      
      if (helpers.isURL(address.value) || helpers.isEmail(address.value)) {
        clearError(address);
      }
      else {
        addError(address, context.resource.invalidLinkAddressField);
      }
      
      var form = helpers.query('.form-insert-link', context.container),
        errors = helpers.queryAll('.error', form);
      
      return (errors.length === 0);
    }
    
    function addError(field, message) {
      field.parentNode.parentNode.classList.add("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (helpers.isEmpty(hint)) {
        var hint = document.createElement('div');
        hint.classList.add('hint');
        field.parentNode.appendChild(hint);
      }
      hint.innerHTML = '<div class="hint">' + message + '</div>';
    }
    
    function clearError(field) {
      field.parentNode.parentNode.classList.remove("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (!helpers.isEmpty(hint)) {
        field.parentNode.removeChild(hint);
      }
    }
    
    function cancelInsertLink(context) {
      this.container.classList.add("hide");
      context.restoreRange();
    }
    
    function updateLinkDetails(context) {
      var selection = window.getSelection();
      if (helpers.isEmpty(selection.anchorNode)) {
        return;
      }
      
      var anchorNode = selection.anchorNode,
        anchorOffset = selection.anchorOffset,
        focusNode = selection.focusNode,
        focusOffset = selection.focusOffset,
        richtextId = context.container.getAttribute('id'),
        address = helpers.query('#linkAddress-' + richtextId),
        text = helpers.query('#linkText-' + richtextId);
      
      if (anchorNode === focusNode) {
        var node = anchorNode;
        while ((node.nodeName !== 'BODY') && (node.nodeName !== 'A')) {
          if (node.classList && node.classList.contains('editor')) {
            break;
          }
          node = node.parentNode;
        }
        
        if (node.nodeName === 'A') {
          address.value = node.getAttribute('href');
          text.value = node.textContent;
        }
        else {
          address.value = '';
          if (anchorOffset < focusOffset) {
            text.value = anchorNode.textContent.substring(
              anchorOffset, focusOffset);
          }
          else {
            text.value = anchorNode.textContent.substring(
              focusOffset, anchorOffset);
          }
        }
      }
      else {
        address.value = '';
        if (focusOffset === range.endOffset) {
          text.value = focusNode.textContent.substring(0, focusOffset);
        }
        else {
          text.value = anchorNode.textContent.substring(0, anchorOffset);
        }
      }
      
      clearError(address);
      address.focus();
    }
    
    function bindUnlink(context) {
      return function(event) {
        var selection = window.getSelection();
        if (helpers.isEmpty(selection.anchorNode)) {
          return;
        }
        
        var node = selection.anchorNode;
        while ((node.nodeName !== 'BODY') && (node.nodeName !== 'A')) {
          if (node.classList && node.classList.contains('editor')) {
            break;
          }
          node = node.parentNode;
        }
        
        if (node.nodeName === 'A') {
          var range = document.createRange();
          range.selectNode(node);
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand('unlink', false, '');
          
          range.setStart(selection.anchorNode, selection.focusOffset);
          range.setEnd(selection.anchorNode, selection.focusOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      };
    }
    
    function bindImage(context) {
      return function(event) {
        var richtextId = context.container.getAttribute('id'),
          imageModalId = 'imageModal-' + richtextId;
        
        var view = helpers.query('#' + imageModalId);
        if (helpers.isEmpty(view)) {
          view = document.createElement('div');
          view.setAttribute('id', imageModalId);
          view.innerHTML = getImageHTML(context);
          context.container.appendChild(view);
          
          imageModal = UI.Modal(view);
        }
        
        imageModal.bind({})
          .proceed(insertImage, context)
          .cancel(cancelInsertImage, context);
        
        var richtextId = context.container.getAttribute('id'),
          address = helpers.query('#imageAddress-' + richtextId)
        
        clearError(address);
        address.value = '';
        address.focus();
      };
    }
    
    function getImageHTML(context) {
      var richtextId = context.container.getAttribute('id');
      
      return '<div class="modal">'
        + '<header class="header">'
        + '<h3 class="title">Insert Image</h3>'
        + '<div class="tabs"><nav class="nav">'
        + '<a href="#url" class="tab url active">'
        + context.resource.imageAddressTab + '</a>'
        + '<a href="#upload" class="tab upload">'
        + context.resource.imageUploadTab + '</a>'
        + '</nav></div>'
        + '</header>'
        + '<section class="content">'
        + '<form class="form form-image-url">'
        + '<fieldset class="fieldset">'
        + '<div class="field">'
        + '<label for="imageAddress-' + richtextId + '" class="label">'
        + context.resource.imageAddressField + '</label>'
        + '<div class="control">'
        + '<input id="imageAddress-' + richtextId + '" '
        + 'type="text" value="" />'
        + '</div></div>'
        + '</fieldset></form>'
        + '<form class="form form-upload-image hide">'
        + '<fieldset class="fieldset">'
        + '<div class="field">'
        + '<div for="imageUpload-' + richtextId + '" '
        + 'class="droparea"></div>'
        + '</div>'
        + '</fieldset></form>'
        + '</section>'
        + '<nav class="actions">'
        + '<button type="button" class="cancel" '
        + 'flat>Cancel</button>'
        + '<button type="button" class="proceed" '
        + 'flat primary>Insert</button>'
        + '</nav>'
        + '</div>';
    }
    
    function insertImage(context) {
      if (isImageFormValid(context)) {
        this.container.classList.add("hide");
        
        var richtextId = context.container.getAttribute('id'),
          src = helpers.query('#imageAddress-' + richtextId).value,
          alt = src.substring(src.lastIndexOf('/'));
        
        helpers.loadImageSize(src, function() {
          var editor = helpers.query('.editor', context.container),
            maxSize = getElementSize(editor, 20);
          
          var size = (this.width < maxSize.width) 
            ? this : helpers.getAspectRatio(this, maxSize);
          
          var html = '<img src="' + src + '" alt="' + alt + '" '
            + 'width="' + size.width + '" height="' + size.height + '" '
            + 'data-width="' + this.width + '" '
            + 'data-height="' + this.height + '">';
          
          context.restoreRange();
          document.execCommand('insertHTML', false, html);
        });
      }
    }
    
    function getElementSize(element, reduce) {
      var computedStyle = getComputedStyle(element);
      reduce = reduce || 0;
      
      return {
        width: element.clientWidth
          - parseFloat(computedStyle.paddingLeft)
          - parseFloat(computedStyle.paddingRight)
          - reduce,
        height: element.clientHeight
          - parseFloat(computedStyle.paddingTop)
          - parseFloat(computedStyle.paddingBottom)
          - reduce
      };
    }
    
    function isImageFormValid(context) {
      var richtextId = context.container.getAttribute('id'),
        address = helpers.query('#imageAddress-' + richtextId);
      
      if (helpers.isURL(address.value)) {
        clearError(address);
      }
      else {
        addError(address, context.resource.invalidImageAddressField);
      }
      
      var form = helpers.query('.form-image-url', context.container),
        errors = helpers.queryAll('.error', form);
      
      return (errors.length === 0);
    }
    
    function cancelInsertImage(context) {
      this.container.classList.add("hide");
      context.restoreRange();
    }
    
    function bindEditor(context) {
      var editor = helpers.query('.editor', context.container);
      editor.removeEventListener('click', editorClickHandler, false);
      editor.removeEventListener('blur', editorBlurHandler, false);
      editor.removeEventListener('keydown', editorKeydownHandler, false);
      editor.removeEventListener('change', editorChangeHandler, false);
      
      editorClickHandler = bindEditorClick(context);
      editor.addEventListener('click', editorClickHandler, false);
      
      editorBlurHandler = bindEditorBlur(context);
      editor.addEventListener('blur', editorBlurHandler, false);
      
      editorKeydownHandler = bindEditorKeydown(context);
      editor.addEventListener('keydown', editorKeydownHandler, false);
      
      editorChangeHandler = bindEditorChange(context);
      editor.addEventListener('change', editorChangeHandler, false);
    }
    
    function bindEditorClick(context) {
      return function(event) {
        setTimeout(function() {
          var selection = window.getSelection();
          if (helpers.isEmpty(selection.focusNode)) {
            return;
          }
          
          var node = selection.focusNode;
          while ((node.nodeType !== Node.ELEMENT_NODE)
              || ((node.nodeType === Node.ELEMENT_NODE) 
                && !node.classList.contains('editor'))) {
            if ((node.nodeName === 'A') 
                || (node.nodeName === 'IMG')) {
              break;
            }
            node = node.parentNode;
          }
          
          switch (node.nodeName) {
            case 'A':
              showLinkMenu(context, node);
              break;
            
            case 'IMG':
              showImageMenu(context, node);
              break;
            
            default:
              hideMenu(context);
              break;
          }
        }, 100);
      };
    }
    
    function showLinkMenu(context, node) {
      var href = node.getAttribute('href'),
        html = '<label>Link:</label>'
          + '<a href="' + href + '" class="fixed" '
          + 'target="_blank">' + href + '</a>'
          + '<div class="separator"></div>'
          + '<a href="#edit" class="edit">'
          + context.resource.editActionRequest + '</a>'
          + '<a href="#remove" class="remove">'
          + context.resource.removeActionRequest + '</a>';
      
      var popup = helpers.query('.popup', context.container);
      popup.innerHTML = html;
      
      popup.style.left = node.offsetLeft + 'px';
      popup.style.top = node.offsetTop + node.offsetHeight + 'px';
      
      bindLinkMenuActions(context, popup);
      
      if (!popup.classList.contains('open')) {         
        popup.classList.add('open');        
      }
      
      var offsetWidth = popup.offsetWidth,
        offsetLeft = popup.offsetLeft,
        editorOffsetLeft = context.container.offsetLeft,
        docWidth = document.body.offsetWidth;
      
      if ((offsetWidth + offsetLeft) > docWidth) {
        do {
          offsetLeft = offsetLeft - 50;
        } while ((offsetWidth + offsetLeft) > docWidth);
        
        offsetLeft = (offsetLeft < editorOffsetLeft)
          ? editorOffsetLeft : offsetLeft;
        popup.style.left = offsetLeft + 'px';
      }
    }
    
    function bindLinkMenuActions(context, menu) {
      var edit = helpers.query('.edit', menu);      
      edit.removeEventListener('click', editHandler, false);
      
      editHandler = bindEdit(context);
      edit.addEventListener('click', editHandler, false);
      
      var remove = helpers.query('.remove', menu);
      remove.removeEventListener('click', removeHandler, false);
      
      removeHandler = bindRemove(context);
      remove.addEventListener('click', removeHandler, false);
    }
    
    function bindEdit(context) {
      return function(event) {
        var toolbar = helpers.query('.tool-bar', context.container),
          link = helpers.query('.link', toolbar);
        
        var event = new CustomEvent('click', {});
        link.dispatchEvent(event);
      };
    }
    
    function bindRemove(context) {
      return function(event) {
        var toolbar = helpers.query('.tool-bar', context.container),
          link = helpers.query('.unlink', toolbar);
        
        var event = new CustomEvent('click', {});
        link.dispatchEvent(event);
      };
    }
    
    function hideMenu(context) {
      var popup = helpers.query('.popup', context.container);
      if (popup.classList.contains('open')) {
        popup.classList.remove('open');
      }
    }
    
    function showImageMenu(context, node) {
      var href = node.getAttribute('href'),
        html = '<label>Link:</label>'
          + '<a href="' + href + '" class="fixed" '
          + 'target="_blank">' + href + '</a>'
          + '<div class="separator"></div>'
          + '<a href="#edit" class="edit">'
          + context.resource.editActionRequest + '</a>'
          + '<a href="#remove" class="remove">'
          + context.resource.removeActionRequest + '</a>';
      
      var popup = helpers.query('.popup', context.container);
      popup.innerHTML = html;
      
      popup.style.left = node.offsetLeft + 'px';
      popup.style.top = node.offsetTop + node.offsetHeight + 'px';
      
      bindLinkMenuActions(context, popup);
      
      if (!popup.classList.contains('open')) {         
        popup.classList.add('open');        
      }
      
      var offsetWidth = popup.offsetWidth,
        offsetLeft = popup.offsetLeft,
        editorOffsetLeft = context.container.offsetLeft,
        docWidth = document.body.offsetWidth;
      
      if ((offsetWidth + offsetLeft) > docWidth) {
        do {
          offsetLeft = offsetLeft - 50;
        } while ((offsetWidth + offsetLeft) > docWidth);
        
        offsetLeft = (offsetLeft < editorOffsetLeft)
          ? editorOffsetLeft : offsetLeft;
        popup.style.left = offsetLeft + 'px';
      }
    }
    
    function bindEditorBlur(context) {
      return function(event) {
        context.saveRange();
      };
    }
    
    function bindEditorKeydown(context) {
      return function(event) {
        setTimeout(function() {
          var selection = window.getSelection();
          if (helpers.isEmpty(selection.focusNode)) {
            return;
          }
          
          var node = selection.focusNode;
          while (node.nodeName !== 'A') {
            if (node.classList && node.classList.contains('editor')) {
              break;
            }
            node = node.parentNode;
          }
          
          if (node.nodeName === 'A') {
            showLinkMenu(context, node);
          }
          else {
            hideMenu(context);
          }
        }, 100);
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
    
    function bindDocClick(context) {
      return function(event) {
        hideMenu(context);
      };
    }
    
    function bindWindowResize(context) {
      return function(event) {
        hideMenu(context);
      };
    }
    
    function updateContent(context) {
      var editor = helpers.query('.editor', context.container);
      editor.innerHTML = context.content;
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
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
	  get content() {
        return content;
      },
      
      set content(value) {
        content = value;
		bindRichText(this);
        updateContent(this);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      get range() {
        return range;
      },
      
      saveRange: function() {
        var selection = window.getSelection();
        if (selection.rangeCount) {
          range = selection.getRangeAt(0);
        }
      },
      
      restoreRange: function() {
        if (helpers.isEmpty(range)) {
          range = document.createRange();
          
          var editor = helpers.query('.editor', this.container);
          this.selectNodeContents(editor);
        }
        
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      },
      
      selectNode: function(node, start, end) {
        range.selectNode(node);
        
        start =  helpers.isEmpty(start) 
          ? range.endOffset : start;
        
        end = helpers.isEmpty(end) 
          ? range.endOffset : end;
        
        range.setStart(node, start);
        range.setEnd(node, end);
        this.restoreRange();
      },
      
      selectNodeContents: function(node, start, end) {
        range.selectNodeContents(node);
        
        start =  helpers.isEmpty(start) 
          ? range.endOffset : start;
        
        end = helpers.isEmpty(end) 
          ? range.endOffset : end;
        
        range.setStart(node, start);
        range.setEnd(node, end);
        this.restoreRange();
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