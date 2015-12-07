(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.DatePicker = function(selector) {
    var date = new Date(),
      format = 'dd/MM/yyyy',
      resource = {},
      toggleHandler = function() {},
      dayHandler = function() {},
      monthHandler = function() {},
      yearHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.format = data.format || 'dd/MM/yyyy';
      context.date = data.date || new Date();      
    }
    
    function bindDatePicker(context) {
      var toggle = helpers.query('.toggle', context.container);
      toggle.removeEventListener('click', toggleHandler, false);
      
      toggleHandler = bindToggle(context);
      toggle.addEventListener('click', toggleHandler, false);
      
      document.removeEventListener('keydown', docKeydownHandler, false);
      document.removeEventListener('click', docClickHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
    
    function bindToggle(context) {
      return function(event) {
        var calendar = helpers.query('.calendar', context.container);
        calendar.innerHTML = getCalendarHTML(context);
        
        context.container.classList.toggle('open');
      };
    }

    function getCalendarHTML(context) {
      var months = context.resource.months,
        days = context.resource.days,
        date = context.date;
      
      var html = '<div class="header">'
        + '<div class="year">' + date.getFullYear() + '</div>'
        + '<div class="date">' + days[date.getDay()].name + ', '
        + months[date.getMonth()].name + ' ' + date.getDate() + '</div>'
        + '</div>';
      
      html = html + '<nav class="tool-bar">'
        + '<button type="button" class="previous" flat-icon>'
        + '<i class="fa fa-angle-left"></i></button>'
        + '<button type="button" class="month" flat>'
        + months[date.getMonth()].name + '</button>'
        + '<button type="button" class="year" flat>'
        + date.getFullYear() + '</button>'
        + '<button type="button" class="next" flat-icon>'
        + '<i class="fa fa-angle-right"></i></button></nav>';
      
      html = html + '<table><thead><tr>';
      days.forEach(function(day) {
        html = html + '<th>' + day.name.substring(0, 1) + '</th>';
      });
      html = html + '</tr></thead>';
      
      html = html + '<tbody><tr>';
      days.forEach(function(day) {
        html = html + '<td>' + day.name.substring(0, 1) + '</td>';
      });
      html = html + '</tr></tbody>';
      html = html + '</table>';
      
      html = html + '<nav class="actions">'
        + '<button type="button" class="cancel" flat>'
        + context.resource.cancelActionRequest + '</button>'
        + '<button type="button" class="cancel" flat primary>'
        + context.resource.okActionRequest + '</button></nav>';
      
      return html;
    }
    
    function bindDocKeydown(container) {
      return function(event) {
        
      };
    }
    
    function bindDocClick(datepicker) {
      return function(event) {
		var target = event.target;
		while (!target.classList.contains('datepicker')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target !== datepicker)
		    && (datepicker.classList.contains('open'))) {
		  datepicker.classList.toggle('open');
        }
      };
    }
    
    function updateDate(context) {
      var date = helpers.query('.toggle > .date', context.container);
      date.textContent = context.dateString;
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
	  
	  get date() {
        return date;
      },
      
      set date(value) {
        date = value;
        updateDate(this);
      },
      
	  get format() {
        return format;
      },
      
      set format(value) {
        format = value;
        updateDate(this);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      get dateString() {
        var date = this.format;
        date = date.replace('dd', this.date.getDate());
        date = date.replace('MM', this.date.getMonth());
        date = date.replace('yyyy', this.date.getFullYear());
        return date;
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        bindDatePicker(this);
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