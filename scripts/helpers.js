(function() {
  'user strict';
  
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
          return (value.match(/[^\s]+/) === null);
          
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
      var pattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      return (value.match(pattern) === null);
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
      
      for (i = 0; i < keyValues.length; i++) {
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