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
  
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString;
    
  function formQuery(obj) {
    var query = [];
    for (var property in obj) {
      if (hasOwnProperty.call(obj, property)) {
        query.push(property + '=' + obj[property]);
      }
    }
    return query.join('&');
  }
  
  function formPayload(obj) {
    var form = new FormData();
    for (var property in obj) {
      if (hasOwnProperty.call(obj, property)) {
        form.append(property, obj[property]);
      }
    }
    return form;
  }
  
  var helpers = {
    get location() {
      return window.location;
    },
    
    query: function(selector, container) {
      if (helpers.isString(selector)) {
        var node = (container || document).querySelector(selector);
        return helpers.isNull(node) ? {} : node;  
      }
      return selector;
    },
    
    queryAll: function(selector, container) {
      if (helpers.isString(selector)) {
        var nodes = (container || document).querySelectorAll(selector);
        return helpers.isEmpty(nodes) ? [] : nodes;
      }
      return selector;
    },
    
    isNull: function(value) {
      return (value === null);
    },
    
    isUndefined: function(value) {
      return (value === undefined);
    },
    
    isEmpty: function(value) {
      if (helpers.isNull(value) 
          || helpers.isUndefined(value)) {
        return true;
      }
      
      switch (toString.call(value)) {
        case '[object String]':
          var pattern = /[^\s]+/;
          return !pattern.test(value);
          
        case '[object Array]':
          return (value.length === 0);
          
        case '[object Object]':
          for (var name in value) {
            if (hasOwnProperty.call(value, name)) {
              return false;
            }
          }
          return true;
      }
    },
    
    isString: function(value) {
      return (toString.call(value) === '[object String]');
    },
    
    isEmail: function(value) {
      var pattern = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
      return pattern.test(value);
    },
    
    isURL: function(value) {
      var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      return pattern.test(value);
    },
    
    toArray: function(value) {
      return Array.prototype.slice.call(value);
    },
    
    mixin: function(base, extend) {
      for (var name in extend) {
        if (!hasOwnProperty.call(extend, name) 
            || hasOwnProperty.call(base, name)) {
          continue;
        }
        base[name] = extend[name];
      }
      return base;
    },
    
    getQuery: function(key) {
      var url = window.location.href,
        keyValues = url.split(/[\?&]+/),
		keyValue = [];
      
      for (var i = 0; i < keyValues.length; i++) {
        keyValue = keyValues[i].split("=");
        if (keyValue[0] == key) {
          return keyValue[1];
        }
      }
      return "";
    },
    
    redirect: function(url) {
      window.location.href = url;
    },
    
    refresh: function() {
      window.location.reload();
    },
    
    request: function(url) {
      function sendRequest(method, url, payload) {
        return new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.onload = function () {
            if ((this.status >= 200) && (this.status < 300)) {
              try {
                resolve(JSON.parse(this.response));
              }
              catch (e) {
                resolve(this.response);
              }
            }
            else {
              reject(this.response);
            }
          };
          request.onerror = function () {
            reject(this.response);
          };
          
          if (method === 'GET') {
            url = url + '?' + formQuery(payload);
            payload = null;
          }
          else {
            payload = formPayload(payload);
          }
          request.open(method, url);
          request.send(payload);
        });
      }
      
      return {
        get: function(payload) {
          return sendRequest('GET', url, payload);
        },
        del: function(payload) {
          return sendRequest('GET', url, payload);
        }
      };
    }
  };
  
  window.helpers = helpers;
})();