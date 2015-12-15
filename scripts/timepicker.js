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
  window.UI.TimePicker = function(selector) {
    var selected = '',
      hour = '',
      minute = '',
      period = '',
      format = 'hh:mm pp',
      resource = {},
      toggleHandler = function() {},
      hourHandler = function() {},
      minuteHandler = function() {},
      periodHandler = function() {},
      cancelHandler = function() {},
      proceedHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.format = data.format || 'hh:mm pp';
      context.selected = data.selected || '02:00 AM';
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
        var current = context.hour + ':' + context.minute
          + ' ' + context.period;
        
        if (current !== context.selected) {
          updateTime(context);
        }
        
        var picker = helpers.query('.picker', context.container);
        picker.innerHTML = getTimePickerHTML(context);
        
        context.container.classList.toggle('open');
        updateHourClock(context);
        bindHourClock(context);
        triggerReflow(context);
      };
    }
    
    function getTimePickerHTML(context) {
      var html = '<div class="header">'
        + '<button type="button" class="hour selected" flat>'
        + context.hour + '</button>'
        + '<div class="colon">:</div>'
        + '<button type="button" class="minute" flat>'
        + context.minute + '</button>'
        + '<div class="period">'
        + '<button type="button" class="am" flat>AM</button>'
        + '<button type="button" class="pm" flat>PM</div></div>'
        + '</div>';
      
      html = html + '<div class="body">';
      html = html + '<div class="hours" tabindex="0">'
        + getHourClockHTML(context) + '</div>';
      
      html = html + '<div class="minutes hide" tabindex="0"></div>';
      
      html = html + '<nav class="actions">'
        + '<button type="button" class="cancel" flat>'
        + context.resource.cancelActionRequest + '</button>'
        + '<button type="button" class="proceed" flat primary>'
        + context.resource.okActionRequest + '</button>'
        + '</nav>';
      
      html = html + '</div>';
      return html;
    }
    
    function getHourClockHTML(context) {
      var hours = context.resource.hours;
      
      var html = '<svg class="clock" viewBox="0 0 100 100">'
        + '<circle class="face" cx="50" cy="50" r="50"/>'
        + '<circle class="face-center" cx="50" cy="50" r="1.5"/>'
      
      html = html + '<g class="ticks">'
        + '<circle class="tick" cx="50.00" cy="10.00" '
        + 'r="7.14" data-value="12"/>'
        + '<circle class="tick" cx="70.00" cy="15.36" '
        + 'r="7.14" data-value="1"/>'
        + '<circle class="tick" cx="84.64" cy="30.00" '
        + 'r="7.14" data-value="2"/>'
        + '<circle class="tick" cx="90.00" cy="50.00" '
        + 'r="7.14" data-value="3"/>'
        + '<circle class="tick" cx="84.64" cy="70.00" '
        + 'r="7.14" data-value="4"/>'
        + '<circle class="tick" cx="70.00" cy="84.64" '
        + 'r="7.14" data-value="5"/>'
        + '<circle class="tick" cx="50.00" cy="90.00" '
        + 'r="7.14" data-value="6"/>'
        + '<circle class="tick" cx="30.00" cy="84.64" '
        + 'r="7.14" data-value="7"/>'
        + '<circle class="tick" cx="15.36" cy="70.00" '
        + 'r="7.14" data-value="8"/>'
        + '<circle class="tick" cx="10.00" cy="50.00" '
        + 'r="7.14" data-value="9"/>'
        + '<circle class="tick" cx="15.36" cy="30.00" '
        + 'r="7.14" data-value="10"/>'
        + '<circle class="tick" cx="30.00" cy="15.36" '
        + 'r="7.14" data-value="11"/>'
        + '</g>';
      
      html = html + '<g class="numbers">';
      hours.forEach(function(hour) {
        switch (hour.id) {
          case "12":
            html = html + '<text class="number" x="46.40" y="12.40" '
              + 'data-value="12">' + hour.name + '</text>';
            break;
          
          case "1":
            html = html + '<text class="number" x="68.40" y="17.40" '
              + 'data-value="1">' + hour.name + '</text>';
            break;
          
          case "2":
            html = html + '<text class="number" x="83.00" y="32.00" '
              + 'data-value="2">' + hour.name + '</text>';
            break;
          
          case "3":
            html = html + '<text class="number" x="88.40" y="52.40" '
              + 'data-value="3">' + hour.name + '</text>';
            break;
          
          case "4":
            html = html + '<text class="number" x="83.00" y="72.40" '
              + 'data-value="4">' + hour.name + '</text>';
            break;
          
          case "5":
            html = html + '<text class="number" x="68.40" y="87.00" '
              + 'data-value="5">' + hour.name + '</text>';
            break;
          
          case "6":
            html = html + '<text class="number" x="48.40" y="92.40" '
              + 'data-value="6">' + hour.name + '</text>';
            break;
          
          case "7":
            html = html + '<text class="number" x="28.40" y="87.40" '
              + 'data-value="7">' + hour.name + '</text>';
            break;
          
          case "8":
            html = html + '<text class="number" x="13.40" y="72.40" '
              + 'data-value="8">' + hour.name + '</text>';
            break;
          
          case "9":
            html = html + '<text class="number" x="8.40" y="52.40" '
              + 'data-value="9">' + hour.name + '</text>';
            break;
          
          case "10":
            html = html + '<text class="number" x="12.00" y="32.00" '
              + 'data-value="10">' + hour.name + '</text>';
            break;
          
          case "11":
            html = html + '<text class="number" x="26.40" y="17.40" '
              + 'data-value="11">' + hour.name + '</text>';
            break;
        }
      });
      html = html + '</g>';
      
      html = html + '<g class="hands">'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="50.00" y2="16.00" data-value="12"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="66.40" y2="20.00" data-value="1"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="33.00" data-value="2"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="84.00" y2="50.00" data-value="3"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="67.00" data-value="4"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="66.40" y2="80.00" data-value="5"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="50.00" y2="84.00" data-value="6"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="32.40" y2="80.00" data-value="7"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="20.40" y2="67.00" data-value="8"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="16.00" y2="50.00" data-value="9"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="20.40" y2="33.00" data-value="10"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="32.40" y2="20.00" data-value="11"/>'
        + '</g>';
      
      html = html + '</svg>';
      return html;
    }
    
    function updateHourClock(context) {
      var hours = helpers.query('.hours', context.container),
        tick = helpers.query('.tick[data-value="'
          + parseInt(context.hour, 10) + '"]', hours),
        number = helpers.query('.number[data-value="'
          + parseInt(context.hour, 10) + '"]', hours),
        hand = helpers.query('.hand[data-value="'
          + parseInt(context.hour, 10) + '"]', hours);
      
      tick.classList.add('selected');
      number.classList.add('selected');
      hand.classList.add('selected');
    }
    
    function bindHourClock(context) {
      
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
        return;
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
		while (!target.classList.contains('timepicker')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target === container)
		    && (container.classList.contains('open'))) {
          var hours = helpers.query('.body > .hours', container),
            minutes = helpers.query('.body > .minutes', container);
          
          if (!hours.classList.contains('hide')) {
            updateDatesKeydown(container, event.keyCode);
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
    
    function bindDocClick(container) {
      return function(event) {
        event = event || window.event;
        
		var target = event.target;
		while (!target.classList.contains('timepicker')) {
		  if (target.nodeName === "BODY") {
		    break;
		  }
		  target = target.parentNode;
		}
		
        if ((target !== container)
		    && (container.classList.contains('open'))) {
		  container.classList.toggle('open');
        }
      };
    }
    
    function updateTime(context) {
      var pattern = /^(\d{2})\:(\d{2})\s(AM|PM)$/;
      if (pattern.test(context.selected)) {
        var matches = context.selected.match(pattern);
        if (!helpers.isEmpty(matches)) {
          context.hour = matches[1];
          context.minute = matches[2];
          context.period = matches[3];
        }
      }
      
      var time = helpers.query('.toggle > .time', context.container);
      time.textContent = context.timeString;
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
        updateTime(this);
      },

	  get hour() {
        return hour;
      },
      
	  set hour(value) {
        hour = value;
      },
      
	  get minute() {
        return minute;
      },
      
	  set minute(value) {
        minute = value;
      },
      
	  get period() {
        return period;
      },
      
	  set period(value) {
        period = value;
      },
      
	  get format() {
        return format;
      },
      
      set format(value) {
        format = value;
        updateTime(this);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      get timeString() {
        var time = this.format;
        time = time.replace('hh', this.hour);
        time = time.replace('mm', this.minute);
        time = time.replace('pp', this.period);
        return time;
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