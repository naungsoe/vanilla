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
      dragdropHandler = function() {},
      changeHandler = function() {};
    
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
    }
    
    function getDropzoneHTML(context) {
      return '<div class="dropzone">'
        + '<button type="button" class="upload" raised>'
        + context.resource.uploadActionRequest + '</button>'
        + '</div>';
    }
    
    function bindUpload(context, callback) {
      return function(event) {
        callback.call(context);
      };
    }
    
    function bindChange(context, callback) {
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
      
      change: function(callback) {
        this.container.removeEventListener('change', changeHandler, false);
        
        changeHandler = bindChange(this, callback);
        this.container.addEventListener('change', changeHandler, false);
        return this;
      }
    };
  };
})();