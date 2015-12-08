(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.DatePicker = function(selector) {
    var date = new Date(),
      current = new Date(),
      format = 'dd/MM/yyyy',
      resource = {},
      toggleHandler = function() {},
      previousHandler = function() {},
      nextHandler = function() {},
      dateHandler = function() {},
      monthHandler = function() {},
      monthCellHandler = function() {},
      yearHandler = function() {},
      yearCellHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.format = data.format || 'dd/MM/yyyy';
      context.date = data.date || new Date();
      context.current = new Date(context.date.valueOf());
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
        if (context.current.valueOf() !== context.date.valueOf()) {
          context.current = new Date(context.date.valueOf());
        }
        
        var calendar = helpers.query('.calendar', context.container);
        calendar.innerHTML = getCalendarHTML(context);
                
        context.container.classList.toggle('open');
        bindCalendar(context);
        triggerReflow(context);
      };
    }
    
    function getCalendarHTML(context) {
      var months = context.resource.months,
        days = context.resource.days,
        date = context.date,
        current = context.current,
        today = new Date();
      
      var html = '<div class="header">'
        + '<div class="year">' + date.getFullYear() + '</div>'
        + '<div class="date">' + days[date.getDay()].name + ', '
        + months[date.getMonth()].name + ' ' + date.getDate() + '</div>'
        + '</div>';
      
      html = html + '<div class="body"><nav class="tool-bar">'
        + '<button type="button" class="previous" flat-icon>'
        + '<i class="fa fa-angle-left"></i></button>'
        + '<button type="button" class="month" flat>'
        + months[current.getMonth()].name + '</button>'
        + '<button type="button" class="year" flat>'
        + current.getFullYear() + '</button>'
        + '<button type="button" class="next" flat-icon>'
        + '<i class="fa fa-angle-right"></i></button></nav>';
      
      html = html + '<div class="dates">'
        + getDatesHTML(context) + '</div>';

      html = html + '<div class="months hide"></div>';
      html = html + '<div class="years hide"></div>';
      
      html = html + '</div>';
      return html;
    }
    
    function getDatesHTML(context) {
      var months = context.resource.months,
        days = context.resource.days,
        dates = context.resource.dates,
        date = context.date,
        current = context.current,
        today = new Date();
      
      var html = '<table><thead><tr>';
      days.forEach(function(day) {
        html = html + '<th>' + day.name.substring(0, 1) + '</th>';
      });
      html = html + '</tr></thead>';
      
      html = html + '<tbody>';
      var start = new Date(current.valueOf()),
        end = new Date(current.valueOf());
      
      start.setDate(1);
      while (start.getDay() !== 0) {
        start.setDate(start.getDate() - 1);
      }
      
      end.setDate(1);
      end.setMonth(end.getMonth() + 1);
      if (end.getDay() !== 0) {
        while (end.getDay() !== 6) {
          end.setDate(end.getDate() + 1);
        }
      }
      
      while (start <= end) {
        if (start.getDay() === 0) {
          html = html + '<tr>';
        }
        
        if (start.getMonth() === current.getMonth()) {
          var cssClass = (start.valueOf() === context.date.valueOf())
            ? 'selected' : areDatesSame(today, start)
              ? 'selectable today' : 'selectable';
          html = html + '<td data-value="' + start.getDate() + '" '
            + 'class="' + cssClass + '">'
            + dates[start.getDate() - 1].name + '</td>';
        }
        else {
          html = html + '<td>&nbsp;</td>';
        }
        
        if (start.getDay === 6) {
          html = html + '</tr>';
        }
        start.setDate(start.getDate() + 1);
      }
      html = html + '</tbody></table>';
      return html;
    }
    
    function areDatesSame(date1, date2) {
      return ((date1.getDate() === date2.getDate())
        && (date1.getMonth() === date2.getMonth())
        && (date1.getFullYear() === date2.getFullYear()))
    }
    
    function bindCalendar(context) {
      var previous = helpers.query('.tool-bar > .previous', context.container);
      previous.removeEventListener('click', previousHandler, false);
      
      previousHandler = bindPrevious(context);
      previous.addEventListener('click', previousHandler, false);
      
      var next = helpers.query('.tool-bar > .next', context.container);
      next.removeEventListener('click', nextHandler, false);
      
      nextHandler = bindNext(context);
      next.addEventListener('click', nextHandler, false);
      
      var month = helpers.query('.tool-bar > .month', context.container);
      month.removeEventListener('click', monthHandler, false);
      
      monthHandler = bindMonth(context);
      month.addEventListener('click', monthHandler, false);
      
      bindDates(context);
    }
    
    function bindDates(context) {
      var dates = helpers.queryAll(
        '.dates > table > tbody > tr > .selectable', context.container);
      helpers.toArray(dates).forEach(function(date) {
        date.removeEventListener('click', dateHandler, false);
      });
      
      dateHandler = bindDate(context);
      helpers.toArray(dates).forEach(function(date) {
        date.addEventListener('click', dateHandler, false);
      });
    }
    
    function triggerReflow(context) {
      var reflow = helpers.query('.reflow', context.container);
      if (!helpers.isEmpty(reflow)) {
        return;
      }
      
      setTimeout(function initiateReflow() {
        reflow = document.createElement('div');
        reflow.classList.add('reflow');
        context.container.appendChild(reflow);
      }, 100);
    }
    
    function bindPrevious(context) {
      return function(event) {
        context.current.setMonth(context.current.getMonth() - 1);
        setTimeout(function() {
          var dates = helpers.query('.dates', context.container);
          dates.innerHTML = getDatesHTML(context);
          updateMonthYear(context);
          bindDates(context);
        }, 100);
      }
    }
    
    function updateMonthYear(context) {
      var months = context.resource.months,
        month = helpers.query('.tool-bar > .month', context.container),
        year = helpers.query('.tool-bar > .year', context.container);
      
      month.textContent = months[context.current.getMonth()].name;
      year.textContent = context.current.getFullYear();
    }
    
    function bindNext(context) {
      return function(event) {
        context.current.setMonth(context.current.getMonth() + 1);
        setTimeout(function() {
          var dates = helpers.query('.dates', context.container);
          dates.innerHTML = getDatesHTML(context);
          updateMonthYear(context);
          bindDates(context);
        }, 100);
      }
    }
    
    function bindMonth(context) {
      return function(event) {
        var toolbar = helpers.query('.body > .tool-bar', context.container),
          dates = helpers.query('.body > .dates', context.container),
          months = helpers.query('.body > .months', context.container);
        
        toolbar.classList.toggle('hide');
        dates.classList.toggle('hide');
        
        months.innerHTML = getMonthsHTML(context);
        months.classList.toggle('hide');
        bindMonths(context);
      }
    }
    
    function getMonthsHTML(context) {
      var months = context.resource.months;
      var html = '<table><tbody>';
      months.forEach(function(month, index) {
        if ((index == 0) || (index == 3)
            || (index == 6)  || (index == 9)) {
          html = html + '<tr>';
        }
        
        html = html + '<td data-value="' + month.id + '" '
          + 'class="selectable">' + month.name + '</td>';
        
        if ((index == 2) || (index == 5)
            || (index == 8)  || (index == 11)) {
          html = html + '</tr>';
        }
      });
      html = html + '</tbody></table>';
      return html;
    }
    
    function bindMonths(context) {
      var months = helpers.queryAll(
        '.months > table > tbody > tr > .selectable', context.container);
      helpers.toArray(months).forEach(function(month) {
        month.removeEventListener('click', monthCellHandler, false);
      });
      
      monthCellHandler = bindMonthCell(context);
      helpers.toArray(months).forEach(function(month) {
        month.addEventListener('click', monthCellHandler, false);
      });
    }
    
    function bindMonthCell(context) {
      return function(event) {
        
      };
    }
    
    function bindDate(context) {
      return function(event) {
        var date = event.currentTarget.dataset.value;
        context.current.setDate(date);
        context.date = new Date(context.current.valueOf());
        context.container.classList.toggle('open');
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

	  get current() {
        return current;
      },
      
	  set current(value) {
        current = value;
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