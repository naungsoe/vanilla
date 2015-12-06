(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.DatePicker = function(selector) {
    var date = new Date(),
      format = 'dd/MM/yyyy',
      dayHandler = function() {},
      monthHandler = function() {},
      yearHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function();
      
    function bindData(context, data) {
      context.format = data.format || 'dd/MM/yyyy';
      context.date = data.date || new Date();
      
    }
    
    function bindDatePicker(context) {
      document.removeEventListener('keydown', docKeydownHandler, false);
      document.removeEventListener('click', docClickHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
	
    function bindChange(context, callback, data) {
      return function(event) {
        callback.call(context, data);
      };
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
      var date = helpers.query('.date', context.container);
      date.textContent = context.
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
      
      bind: function(data) {
        bindData(this, data);
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