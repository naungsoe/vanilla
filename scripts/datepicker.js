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
  window.UI.DatePicker = function(selector) {
    var selected = new Date(),
      current = new Date(),
      today = new Date(),
      format = 'dd/MM/yyyy',
      resource = {},
      toggleHandler = function() {},
      previousHandler = function() {},
      nextHandler = function() {},
      dateHandler = function() {},
      dateMouseEnterHandler = function() {},
      dateMouseLeaveHandler = function() {},
      monthViewHandler = function() {},
      monthHandler = function() {},
      monthMouseEnterHandler = function() {},
      monthMouseLeaveHandler = function() {},
      yearViewHandler = function() {},
      yearHandler = function() {},
      yearMouseEnterHandler = function() {},
      yearMouseLeaveHandler = function() {},
      cancelHandler = function() {},
      proceedHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.format = data.format || 'DD/MM/YYYY';
      context.selected = data.selected || new Date();
      context.current = new Date(context.selected.valueOf());
      context.today = data.today || new Date();
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
        if (context.current.valueOf() !== context.selected.valueOf()) {
          context.current = new Date(context.selected.valueOf());
        }
        
        var calendar = helpers.query('.calendar', context.container);
        calendar.innerHTML = getCalendarHTML(context);
                
        context.container.classList.toggle('open');
        bindToolbar(context);
        bindDates(context);
        bindActions(context);
        triggerReflow(context);
      };
    }
    
    function getCalendarHTML(context) {
      var months = context.resource.months,
        days = context.resource.days,
        selected = context.selected,
        current = context.current,
        today = context.today;
      
      var html = '<div class="header">'
        + '<div class="year">' + selected.getFullYear() + '</div>'
        + '<div class="date">' + days[selected.getDay()].name + ', '
        + months[selected.getMonth()].name + ' '
        + selected.getDate() + '</div>'
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
      
      html = html + '<div class="dates" tabindex="0">'
        + getDatesHTML(context) + '</div>';

      html = html + '<div class="months hide" tabindex="0"></div>';
      html = html + '<div class="years hide" tabindex="0"></div>';
      
      html = html + '<nav class="actions">'
        + '<button type="button" class="cancel" flat>'
        + context.resource.cancelActionRequest + '</button>'
        + '<button type="button" class="proceed" flat primary>'
        + context.resource.okActionRequest + '</button>'
        + '</nav>';
      
      html = html + '</div>';
      return html;
    }
    
    function getDatesHTML(context) {
      var months = context.resource.months,
        days = context.resource.days,
        dates = context.resource.dates,
        selected = context.selected,
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
          if (start.valueOf() === end.valueOf()) {
            break;
          }
          html = html + '<tr>';
        }
        
        if (start.getMonth() === current.getMonth()) {
          var cssClass = (start.valueOf() === context.selected.valueOf())
            ? areDatesSame(start, context.selected) 
              ? 'selectable selected today' : 'selectable selected'
            : areDatesSame(today, start) 
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
    
    function bindToolbar(context) {
      var previous = helpers.query('.tool-bar > .previous', context.container);
      previous.removeEventListener('click', previousHandler, false);
      
      previousHandler = bindPrevious(context);
      previous.addEventListener('click', previousHandler, false);
      
      var next = helpers.query('.tool-bar > .next', context.container);
      next.removeEventListener('click', nextHandler, false);
      
      nextHandler = bindNext(context);
      next.addEventListener('click', nextHandler, false);
      
      var month = helpers.query('.tool-bar > .month', context.container);
      month.removeEventListener('click', monthViewHandler, false);
      
      monthViewHandler = bindMonthView(context);
      month.addEventListener('click', monthViewHandler, false);

      var year = helpers.query('.tool-bar > .year', context.container);
      year.removeEventListener('click', yearViewHandler, false);
      
      yearViewHandler = bindYearView(context);
      year.addEventListener('click', yearViewHandler, false);
    }
    
    function bindPrevious(context) {
      return function(event) {
        var dates = helpers.query('.body > .dates', context.container),
          years = helpers.query('.body > .years', context.container);
        
        if (!years.classList.contains('hide')) {
          context.current.setYear(context.current.getFullYear() - 15);
          setTimeout(function() {
            years.innerHTML = getYearsHTML(context);
            bindYears(context);
          }, 100);
        }
        else if (!dates.classList.contains('hide')) {
          context.current.setMonth(context.current.getMonth() - 1);
          setTimeout(function() {
            var dates = helpers.query('.dates', context.container);
            dates.innerHTML = getDatesHTML(context);
            updateMonthYear(context);
            bindDates(context);
          }, 100);
        }
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
        var dates = helpers.query('.body > .dates', context.container),
          years = helpers.query('.body > .years', context.container);
        
        if (!years.classList.contains('hide')) {
          context.current.setYear(context.current.getFullYear() + 15);
          setTimeout(function() {
            years.innerHTML = getYearsHTML(context);
            bindYears(context);
          }, 100);
        }
        else if (!dates.classList.contains('hide')) {
          context.current.setMonth(context.current.getMonth() + 1);
          setTimeout(function() {
            dates.innerHTML = getDatesHTML(context);
            updateMonthYear(context);
            bindDates(context);
          }, 100);
        }
      }
    }
    
    function bindMonthView(context) {
      return function(event) {
        var previous = helpers.query('.tool-bar > .previous', context.container),
          next = helpers.query('.tool-bar > .next', context.container),
          month = helpers.query('.tool-bar > .month', context.container),
          year = helpers.query('.tool-bar > .year', context.container),
          dates = helpers.query('.body > .dates', context.container),
          months = helpers.query('.body > .months', context.container),
          cancel = helpers.query('.actions > .cancel', context.container),
          proceed = helpers.query('.actions > .proceed', context.container);
        
        previous.setAttribute('disabled', '');
        next.setAttribute('disabled', '');
        cancel.setAttribute('disabled', '');
        proceed.setAttribute('disabled', '');
        month.classList.toggle('hide');
        year.classList.toggle('hide');
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
      var table = helpers.query('.months', context.container);
        months = helpers.queryAll('.selectable', table);
      
      helpers.toArray(months).forEach(function(month) {
        month.removeEventListener('click', monthHandler, false);
        month.removeEventListener('mouseenter', monthMouseEnterHandler, false);
        month.removeEventListener('mouseleave', monthMouseLeaveHandler, false);
      });
      
      monthHandler = bindMonth(context);
      helpers.toArray(months).forEach(function(month) {
        month.addEventListener('click', monthHandler, false);
      });
      
      monthMouseEnterHandler = bindMonthMouseEnter(context.container);
      helpers.toArray(months).forEach(function(month) {
        month.addEventListener('mouseenter', monthMouseEnterHandler, false);
      });
      
      monthMouseLeaveHandler = bindMonthMouseLeave(context.container);
      helpers.toArray(months).forEach(function(month) {
        month.addEventListener('mouseleave', monthMouseLeaveHandler, false);
      });
      
      table.focus();
    }
    
    function bindMonth(context) {
      return function(event) {
        event = event || window.event;
        
        var month = event.currentTarget.dataset.value;
        context.current.setMonth(month);
        
        var previous = helpers.query('.tool-bar > .previous', context.container),
          next = helpers.query('.tool-bar > .next', context.container),
          month = helpers.query('.tool-bar > .month', context.container),
          year = helpers.query('.tool-bar > .year', context.container),
          dates = helpers.query('.body > .dates', context.container),
          months = helpers.query('.body > .months', context.container),
          cancel = helpers.query('.actions > .cancel', context.container),
          proceed = helpers.query('.actions > .proceed', context.container);
        
        previous.removeAttribute('disabled');
        next.removeAttribute('disabled');
        cancel.removeAttribute('disabled');
        proceed.removeAttribute('disabled');
        month.classList.toggle('hide');
        year.classList.toggle('hide');
        months.classList.toggle('hide');
        
        dates.innerHTML = getDatesHTML(context);
        dates.classList.toggle('hide');
        updateMonthYear(context);
        bindDates(context);
      };
    }
    
    function bindMonthMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var table = helpers.query('.months', container),
          months = helpers.queryAll('.highlight', table);
        
        helpers.toArray(months).forEach(function(month) {
          month.classList.remove('highlight');
        });
        
        event.currentTarget.classList.add('highlight');
        table.focus();
      };
    }
    
    function bindMonthMouseLeave(container) {
      return function(event) {
        var table = helpers.query('.months', container),
          months = helpers.queryAll('.highlight', table);
        
        helpers.toArray(months).forEach(function(month) {
          month.classList.remove('highlight');
        });
        
        table.focus();
      };
    }
    
    function bindYearView(context) {
      return function(event) {
        var month = helpers.query('.tool-bar > .month', context.container),
          year = helpers.query('.tool-bar > .year', context.container),
          dates = helpers.query('.body > .dates', context.container),
          years = helpers.query('.body > .years', context.container),
          cancel = helpers.query('.actions > .cancel', context.container),
          proceed = helpers.query('.actions > .proceed', context.container);
        
        cancel.setAttribute('disabled', '');
        proceed.setAttribute('disabled', '');
        month.classList.toggle('hide');
        year.classList.toggle('hide');
        dates.classList.toggle('hide');
        
        years.innerHTML = getYearsHTML(context);
        years.classList.toggle('hide');
        bindYears(context);
      }
    }
    
    function getYearsHTML(context) {
      var start = new Date(context.current.valueOf()),
        end = new Date(context.current.valueOf());;
      
      while (start.getFullYear() > (context.current.getFullYear() - 7)) {
        start.setYear(start.getFullYear() - 1);
      }
      
      while (end.getFullYear() <= (context.current.getFullYear() + 7)) {
        end.setYear(end.getFullYear() + 1);
      }
      
      var html = '<table><tbody>';
      for (var i = 0; start.getFullYear() < end.getFullYear(); i++) {
        if ((i == 0) || (i == 3) || (i == 6)  || (i == 9)) {
          html = html + '<tr>';
        }
        
        html = html + '<td data-value="' + start.getFullYear() + '" '
          + 'class="selectable">' + start.getFullYear() + '</td>';
        
        if ((i == 2) || (i == 5) || (i == 8)  || (i == 11)) {
          html = html + '</tr>';
        }
        start.setYear(start.getFullYear() + 1);
      }
      html = html + '</tbody></table>';
      return html;
    }
    
    function bindYears(context) {
      var table = helpers.query('.years', context.container),
        years = helpers.queryAll('.selectable', context.container);
      
      helpers.toArray(years).forEach(function(year) {
        year.removeEventListener('click', yearHandler, false);
        year.removeEventListener('mouseenter', yearMouseEnterHandler, false);
        year.removeEventListener('mouseleave', yearMouseLeaveHandler, false);
      });
      
      yearHandler = bindYear(context);
      helpers.toArray(years).forEach(function(year) {
        year.addEventListener('click', yearHandler, false);
      });
      
      yearMouseEnterHandler = bindYearMouseEnter(context.container);
      helpers.toArray(years).forEach(function(year) {
        year.addEventListener('mouseenter', yearMouseEnterHandler, false);
      });
      
      yearMouseLeaveHandler = bindYearMouseLeave(context.container);
      helpers.toArray(years).forEach(function(year) {
        year.addEventListener('mouseleave', yearMouseLeaveHandler, false);
      });
      
      table.focus();
    }
    
    function bindYear(context) {
      return function(event) {
        var year = event.currentTarget.dataset.value;
        context.current.setYear(year);
        
        var month = helpers.query('.tool-bar > .month', context.container),
          year = helpers.query('.tool-bar > .year', context.container),
          dates = helpers.query('.body > .dates', context.container),
          years = helpers.query('.body > .years', context.container),
          cancel = helpers.query('.actions > .cancel', context.container),
          proceed = helpers.query('.actions > .proceed', context.container);
        
        cancel.removeAttribute('disabled');
        proceed.removeAttribute('disabled');
        month.classList.toggle('hide');
        year.classList.toggle('hide');
        years.classList.toggle('hide');
        
        dates.innerHTML = getDatesHTML(context);
        dates.classList.toggle('hide');
        updateMonthYear(context);
        bindDates(context);
      };
    }
    
    function bindYearMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var table = helpers.query('.years', container),
          years = helpers.queryAll('.highlight', table);
        
        helpers.toArray(years).forEach(function(year) {
          year.classList.remove('highlight');
        });
        
        event.currentTarget.classList.add('highlight');
        table.focus();
      };
    }
    
    function bindYearMouseLeave(container) {
      return function(event) {
        var table = helpers.query('.years', container),
          years = helpers.queryAll('.highlight', table);
        
        helpers.toArray(years).forEach(function(year) {
          year.classList.remove('highlight');
        });
        
        table.focus();
      };
    }
    
    function bindDates(context) {
      var table = helpers.query('.dates', context.container),
        dates = helpers.queryAll('.selectable', table);
      
      helpers.toArray(dates).forEach(function(date) {
        date.removeEventListener('click', dateHandler, false);
        date.removeEventListener('mouseenter', dateMouseEnterHandler, false);
        date.removeEventListener('mouseleave', dateMouseLeaveHandler, false);
      });
      
      dateHandler = bindDate(context);
      helpers.toArray(dates).forEach(function(date) {
        date.addEventListener('click', dateHandler, false);
      });
      
      dateMouseEnterHandler = bindDateMouseEnter(context.container);
      helpers.toArray(dates).forEach(function(date) {
        date.addEventListener('mouseenter', dateMouseEnterHandler, false);
      });
      
      dateMouseLeaveHandler = bindDateMouseLeave(context.container);
      helpers.toArray(dates).forEach(function(date) {
        date.addEventListener('mouseleave', dateMouseLeaveHandler, false);
      });
      
      table.focus();
    }
    
    function bindDate(context) {
      return function(event) {
        event = event || window.event;
        
        var date = event.currentTarget.dataset.value;
        context.current.setDate(date);
        
        var days = context.resource.days,
          months = context.resource.months,
          header = helpers.query('.header', context.container),
          year = helpers.query('.year', header),
          date = helpers.query('.date', header),
          table = helpers.query('.dates', context.container),
          selected = helpers.query('.selected', table);
        
        year.textContent = context.current.getFullYear();
        date.textContent = days[context.current.getDay()].name
          + ', ' + months[context.current.getMonth()].name
          + ' ' + context.current.getDate();
        
        if (!helpers.isEmpty(selected)) {
          selected.classList.remove('selected');
        }
        event.currentTarget.classList.add('selected');
      };
    }
    
    function bindDateMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var table = helpers.query('.dates', container),
          dates = helpers.queryAll('.highlight', table);
        
        helpers.toArray(dates).forEach(function(date) {
          date.classList.remove('highlight');
        });
        
        event.currentTarget.classList.add('highlight');
        table.focus();
      };
    }
    
    function bindDateMouseLeave(container) {
      return function(event) {
        var table = helpers.query('.dates', container),
          dates = helpers.queryAll('.highlight', table);
        
        helpers.toArray(dates).forEach(function(date) {
          date.classList.remove('highlight');
        });
        
        table.focus();
      };
    }
    
    function bindActions(context) {
      var cancel = helpers.query('.actions > .cancel', context.container);
      cancel.removeEventListener('click', cancelHandler, false);
      
      cancelHandler = bindCancel(context);
      cancel.addEventListener('click', cancelHandler, false);
      
      var proceed = helpers.query('.actions > .proceed', context.container);
      proceed.removeEventListener('click', proceedHandler, false);
      
      proceedHandler = bindProceed(context);
      proceed.addEventListener('click', proceedHandler, false);
    }
    
    function bindCancel(context) {
      return function(event) {
        context.container.classList.toggle('open');
      };
    }
    
    function bindProceed(context) {
      return function(event) {
        context.selected = new Date(context.current.valueOf());
        context.container.classList.toggle('open');
      }
    }
    
    function triggerReflow(context) {
      var reflow = helpers.query('.reflow', context.container);
      if (!helpers.isEmpty(reflow)) {
        reflow.parentNode.removeChild(reflow);
      }
      
      setTimeout(function initiateReflow() {
        reflow = document.createElement('div');
        reflow.classList.add('reflow');
        context.container.appendChild(reflow);
      }, 100);
    }
    
    function bindDocKeydown(container) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
		while (!target.classList.contains('datepicker')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target === container)
		    && (container.classList.contains('open'))) {
          var dates = helpers.query('.body > .dates', container),
            months = helpers.query('.body > .months', container),
            years = helpers.query('.body > .years', container);
          
          if (!dates.classList.contains('hide')) {
            updateDatesKeydown(container, event.keyCode);
          }
          else if (!months.classList.contains('hide')) {
            updateMonthKeydown(container, event.keyCode);
          }
          else if (!years.classList.contains('hide')) {
            updateYearKeydown(container, event.keyCode);
          }
        }
      };
    }
    
    function updateDatesKeydown(container, keyCode) {
      var table = helpers.query('.dates', container);
      switch (keyCode) {
        case 13:
          var cell = helpers.query('.highlight', table);
          if (!helpers.isEmpty(cell)) {
            var event = new CustomEvent('click', {});
            cell.dispatchEvent(event);
          }
          break;
        
        case 37:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('.selected', table);
          }
          
          if (helpers.isEmpty(cell)) {
            for (var i = 31; ; i--) {
              cell = helpers.query('td[data-value="' + i + '"]', table);
              if (!helpers.isEmpty(cell)) {
                break;
              }
            }
          }
          else {
            cell.classList.remove('highlight');            
            
            if (cell.dataset.value === '1') {
              for (var i = 31; ; i--) {
                cell = helpers.query('td[data-value="' + i + '"]', table);
                if (!helpers.isEmpty(cell)) {
                  break;
                }
              }
            }
            else {
              var date = +cell.dataset.value - 1;
              cell = helpers.query('td[data-value="' + date + '"]', table);
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 38:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('.selected', table);
          }
          
          if (helpers.isEmpty(cell)) {
            for (var i = 31; ; i--) {
              cell = helpers.query('td[data-value="' + i + '"]', table);
              if (!helpers.isEmpty(cell)) {
                break;
              }
            }
          }
          else {
            cell.classList.remove('highlight');            
            
            var date = +cell.dataset.value;
            if (date > 7) {
              date = date - 7;
              cell = helpers.query('td[data-value="' + date + '"]', table);
            }
            else {
              while (true) {
                date = date + 7;
                cell = helpers.query('td[data-value="' + date + '"]', table);
                if (helpers.isEmpty(cell)) {
                  date = date - 7;
                  cell = helpers.query('td[data-value="' + date + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 39:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('.selected', table);
          }
          
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="1"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            var date = +cell.dataset.value + 1;
            cell = helpers.query('td[data-value="' + date + '"]', table);
            if (helpers.isEmpty(cell)) {
              cell = helpers.query('td[data-value="1"]', table);
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 40:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('.selected', table);
          }
          
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="1"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            var date = +cell.dataset.value + 7;
            cell = helpers.query('td[data-value="' + date + '"]', table);
            if (helpers.isEmpty(cell)) {
              while (true) {
                date = date - 7;
                cell = helpers.query('td[data-value="' + date + '"]', table);
                if (helpers.isEmpty(cell)) {
                  date = date + 7;
                  cell = helpers.query('td[data-value="' + date + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
      }
    }
    
    function updateMonthKeydown(container, keyCode) {
      var table = helpers.query('.months', container);
      switch (keyCode) {
        case 13:
          var cell = helpers.query('.highlight', table);
          if (!helpers.isEmpty(cell)) {
            var event = new CustomEvent('click', {});
            cell.dispatchEvent(event);
          }
          break;
        
        case 37:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="11"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            if (cell.dataset.value === '0') {
              cell = helpers.query('td[data-value="11"]', table);
            }
            else {
              var month = +cell.dataset.value - 1;
              cell = helpers.query('td[data-value="' + month + '"]', table);
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 38:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="11"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            var month = +cell.dataset.value;
            if (month >= 3) {
              month = month - 3;
              cell = helpers.query('td[data-value="' + month + '"]', table);
            }
            else {
              while (true) {
                month = month + 3;
                cell = helpers.query('td[data-value="' + month + '"]', table);
                if (helpers.isEmpty(cell)) {
                  month = month - 3;
                  cell = helpers.query('td[data-value="' + month + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 39:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="0"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            var month = +cell.dataset.value + 1;
            cell = helpers.query('td[data-value="' + month + '"]', table);
            if (helpers.isEmpty(cell)) {
              cell = helpers.query('td[data-value="0"]', table);
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 40:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            cell = helpers.query('td[data-value="0"]', table);
          }
          else {
            cell.classList.remove('highlight');            
            
            var month = +cell.dataset.value + 3;
            cell = helpers.query('td[data-value="' + month + '"]', table);
            if (helpers.isEmpty(cell)) {
              while (true) {
                month = month - 3;
                cell = helpers.query('td[data-value="' + month + '"]', table);
                if (helpers.isEmpty(cell)) {
                  month = month + 3;
                  cell = helpers.query('td[data-value="' + month + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
      }
    }
    
    function updateYearKeydown(container, keyCode) {
      var table = helpers.query('.years', container);
      switch (keyCode) {
        case 13:
          var cell = helpers.query('.highlight', table);
          if (!helpers.isEmpty(cell)) {
            var event = new CustomEvent('click', {});
            cell.dispatchEvent(event);
          }
          break;
        
        case 37:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            var cells = helpers.queryAll('tbody > tr:last-child > td', table);
            cell = cells[cells.length - 1];
          }
          else {
            cell.classList.remove('highlight');            
            
            var year = +cell.dataset.value - 1;
            cell = helpers.query('td[data-value="' + year + '"]', table);
            if (helpers.isEmpty(cell)) {
              cells = helpers.queryAll('tbody > tr:last-child > td', table);
              cell = cells[cells.length - 1];
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 38:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            var cells = helpers.queryAll('tbody > tr:last-child > td', table);
            cell = cells[cells.length - 1];
          }
          else {
            cell.classList.remove('highlight');            
            
            var year = +cell.dataset.value - 3;
            cell = helpers.query('td[data-value="' + year + '"]', table);
            if (helpers.isEmpty(cell)) {
              while (true) {
                year = year + 3;
                cell = helpers.query('td[data-value="' + year + '"]', table);
                if (helpers.isEmpty(cell)) {
                  year = year - 3;
                  cell = helpers.query('td[data-value="' + year + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 39:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            var cells = helpers.queryAll('tbody > tr:first-child > td', table);
            cell = cells[0];
          }
          else {
            cell.classList.remove('highlight');            
            
            var year = +cell.dataset.value + 1;
            cell = helpers.query('td[data-value="' + year + '"]', table);
            if (helpers.isEmpty(cell)) {
              cells = helpers.queryAll('tbody > tr:first-child > td', table);
              cell = cells[0];
            }
          }
          cell.classList.add('highlight');
          break;
        
        case 40:
          var cell = helpers.query('.highlight', table);
          if (helpers.isEmpty(cell)) {
            var cells = helpers.queryAll('tbody > tr:first-child > td', table);
            cell = cells[0];
          }
          else {
            cell.classList.remove('highlight');            
            
            var year = +cell.dataset.value + 3;
            cell = helpers.query('td[data-value="' + year + '"]', table);
            if (helpers.isEmpty(cell)) {
              while (true) {
                year = year - 3;
                cell = helpers.query('td[data-value="' + year + '"]', table);
                if (helpers.isEmpty(cell)) {
                  year = year + 3;
                  cell = helpers.query('td[data-value="' + year + '"]', table);
                  break;
                }
              }
            }
          }
          cell.classList.add('highlight');
          break;
      }
    }
    
    function bindDocClick(datepicker) {
      return function(event) {
        event = event || window.event;
        
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
	  
	  get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
        updateDate(this);
      },

	  get current() {
        return current;
      },
      
	  set current(value) {
        current = value;
      },
      
	  get today() {
        return today;
      },
      
	  set today(value) {
        today = value;
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
        date = date.replace('DD', this.selected.getDate());
        date = date.replace('MM', this.selected.getMonth());
        date = date.replace('YYYY', this.selected.getFullYear());
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