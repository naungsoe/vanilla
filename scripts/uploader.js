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
  window.UI.Uploader = function(selector) {
    var url = "",
      resource = {},
      uploadHanlder = function() {},
      selectHandler = function() {},
      dragoverHandler = function() {},
      dragleaveHandler = function() {},
      dropHandler = function() {},
      completeHandler = function() {};
    
    function bindData(context, data, resource) {
      context.resource = resource || {};
	  context.url = data.url || "";
    }
    
    function bindUploadArea(context) {
      context.container.innerHTML = getDropzoneHTML(context);
      
      var upload = helpers.query('.upload', context.container);
      upload.removeEventListener('click', uploadHanlder, false);
      
      uploadHanlder = bindUpload(context);
      upload.addEventListener('click', uploadHanlder, false);
      
      var file = helpers.query('input', context.container);
      file.removeEventListener('change', selectHandler, false);
      
      selectHandler = bindSelect(context);
      file.addEventListener('change', selectHandler, false);
      
      var dropzone = helpers.query('.dropzone', context.container);
      dropzone.removeEventListener("dragover", dragoverHandler, false);
      dropzone.removeEventListener("dragleave", dragleaveHandler, false);
      dropzone.removeEventListener("drop", dropHandler, false);
      
      dragoverHandler = bindDragover(context);
      dropzone.addEventListener("dragover", dragoverHandler, false);
      
      dragleaveHandler = bindDragleave(context);
      dropzone.addEventListener("dragleave", dragleaveHandler, false);
      
      dropHandler = bindDrop(context);
      dropzone.addEventListener("drop", dropHandler, false);
    }
    
    function getDropzoneHTML(context) {
      return '<div class="dropzone">'
        + '<div class="actions"><span class="hint">'
        + context.resource.imageUploadDropzoneHint + '</span>'
        + '<button type="button" class="upload" raised primary>'
        + context.resource.uploadActionRequest + '</button>'
        + '</div></div>'
        + '<input type="file" class="hide" />';
    }
    
    function bindUpload(context) {
      return function(event) {
        var file = helpers.query('input', context.container);
        var event = new CustomEvent('click', {});
        file.dispatchEvent(event);
      };
    }
    
    function bindSelect(context) {
      return function(event) {
        var file = helpers.query('input', context.container);
        var formData = new FormData();
        formData.append('file', file.files[0]);
        helpers.request(context.url)
          .post(formData)
          .then(function() {
            var event = new CustomEvent('complete', {});
            context.container.dispatchEvent(event);
          });
      };
    }
    
    function bindDrag(context) {
      return function(event) {
        var file = helpers.query('input', context.container);
        var event = new CustomEvent('click', {});
        file.dispatchEvent(event);
      };
    }
    
    function bindDragover(context) {
      return function(event) {
        event = event || window.event;
        event.preventDefault();
        event.stopPropagation();
        
        var dropzone = helpers.query('.dropzone', context.container);
        if (!dropzone.classList.contains('dragover')) {
          dropzone.classList.add('dragover');
        }
      };
    }
    
    function bindDragleave(context) {
      return function(event) {
        event = event || window.event;
        event.preventDefault();
        event.stopPropagation();
        
        var dropzone = helpers.query('.dropzone', context.container);
        if (dropzone.classList.contains('dragover')) {
          dropzone.classList.remove('dragover');
        }
      };
    }
    
    function bindDrop(context) {
      return function(event) {
        event = event || window.event;
        event.preventDefault();
        event.stopPropagation();
        
        var files = event.target.files || event.dataTransfer.files;
        var formData = new FormData();
        formData.append('file', files[0]);
        helpers.request(context.url)
          .post(formData)
          .then(function() {
            var event = new CustomEvent('complete', {});
            context.container.dispatchEvent(event);
          });
      };
    }
    
    function bindComplete(context, callback) {
      return function(event) {
        callback.call(context);
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
        bindUploadArea(this);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
	  
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      complete: function(callback) {
        this.container.removeEventListener('complete', completeHandler, false);
        
        completeHandler = bindComplete(this, callback);
        this.container.addEventListener('complete', completeHandler, false);
        return this;
      }
    };
  };
})();