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
      hourViewHandler = function() {},
      minuteViewHandler = function() {},
      periodHandler = function() {},
      hourHandler = function() {},
      hourMouseEnterHandler = function() {},
      hourMouseLeaveHandler = function() {},
      minuteHandler = function() {},
      minuteMouseEnterHandler = function() {},
      minuteMouseLeaveHandler = function() {},
      cancelHandler = function() {},
      proceedHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.format = data.format || 'hh:mm pp';
      context.selected = data.selected || '12:00 AM';
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
        bindHeader(context);
        bindHourClock(context);
        bindActions(context);
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
        + '<button type="button" class="'
        + ((context.period === "AM") ? 'am selected' : 'am')
        + '" flat>AM</button>'
        + '<button type="button" class="'
        + ((context.period === "PM") ? 'pm selected' : 'pm')
        + '" flat>PM</div></div>'
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
        + 'x2="66.40" y2="21.00" data-value="1"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="33.00" data-value="2"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="84.00" y2="50.00" data-value="3"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="67.00" data-value="4"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="66.40" y2="79.00" data-value="5"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="50.00" y2="84.00" data-value="6"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="33.00" y2="80.00" data-value="7"/>'
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
      var hour = parseInt(context.hour, 10),
        clock = helpers.query('.hours', context.container),
        tick = helpers.query('.tick[data-value="'
          + ((hour > 12) ? (hour - 12) : hour) + '"]', clock),
        number = helpers.query('.number[data-value="'
          + ((hour > 12) ? (hour - 12) : hour) + '"]', clock),
        hand = helpers.query('.hand[data-value="'
          + ((hour > 12) ? (hour - 12) : hour) + '"]', clock);
      
      if (!helpers.isEmpty(tick)
          && !helpers.isEmpty(number)
          && !helpers.isEmpty(hand)) {
        tick.classList.add('selected');
        number.classList.add('selected');
        hand.classList.add('selected');
      }
    }
    
    function bindHeader(context) {
      var hour = helpers.query('.header > .hour', context.container),
        minute = helpers.query('.header > .minute', context.container),
        am = helpers.query('.header > .period > .am', context.container),
        pm = helpers.query('.header > .period > .pm', context.container);
      
      hour.removeEventListener('click', hourViewHandler, false);
      
      hourViewHandler = bindHourView(context);
      hour.addEventListener('click', hourViewHandler, false);
      
      minute.removeEventListener('click', minuteViewHandler, false);
      
      minuteViewHandler = bindMinuteView(context);
      minute.addEventListener('click', minuteViewHandler, false);
      
      am.removeEventListener('click', periodHandler, false);
      pm.removeEventListener('click', periodHandler, false);
      
      periodHandler = bindPeriod(context);
      am.addEventListener('click', periodHandler, false);
      pm.addEventListener('click', periodHandler, false);
    }
    
    function bindHourView(context) {
      return function(event) {
        var hour = helpers.query('.header > .hour', context.container),
          minute = helpers.query('.header > .minute', context.container),
          hours = helpers.query('.body > .hours', context.container),
          minutes = helpers.query('.body > .minutes', context.container);
        
        hour.classList.toggle('selected');
        minute.classList.toggle('selected');
        minutes.classList.toggle('hide');
        
        hours.innerHTML = getHourClockHTML(context);
        hours.classList.toggle('hide');
        updateHourClock(context);
        bindHourClock(context);
      }
    }
    
    function bindMinuteView(context) {
      return function(event) {
        var hour = helpers.query('.header > .hour', context.container),
          minute = helpers.query('.header > .minute', context.container),
          minutes = helpers.query('.body > .minutes', context.container),
          hours = helpers.query('.body > .hours', context.container);
        
        hour.classList.toggle('selected');
        minute.classList.toggle('selected');
        hours.classList.toggle('hide');
        
        minutes.innerHTML = getMinuteClockHTML(context);
        minutes.classList.toggle('hide');
        updateMinuteClock(context);
        bindMinuteClock(context);
      }
    }
    
    function updateMinuteClock(context) {
      var clock = helpers.query('.minutes', context.container),
        tick = helpers.query('.tick[data-value="'
          + parseInt(context.minute, 10) + '"]', clock),
        number = helpers.query('.number[data-value="'
          + parseInt(context.minute, 10) + '"]', clock),
        hand = helpers.query('.hand[data-value="'
          + parseInt(context.minute, 10) + '"]', clock);
      
      if (!helpers.isEmpty(tick)
          && !helpers.isEmpty(number)
          && !helpers.isEmpty(hand)) {
        tick.classList.add('selected');
        number.classList.add('selected');
        hand.classList.add('selected');
      }
    }
    
    function bindHourClock(context) {
      var clock = helpers.query('.hours', context.container),
        ticks = helpers.queryAll('.ticks > .tick', clock),
        numbers = helpers.queryAll('.numbers > .number', clock);
      
      helpers.toArray(ticks).forEach(function(tick) {
        tick.removeEventListener('click', hourHandler, false);
        tick.removeEventListener('mouseenter', hourMouseEnterHandler, false);
        tick.removeEventListener('mouseleave', hourMouseLeaveHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.removeEventListener('click', hourHandler, false);
        number.removeEventListener('mouseenter', hourMouseEnterHandler, false);
      });
      
      hourHandler = bindHour(context);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('click', hourHandler, false);
      });
      
      hourMouseEnterHandler = bindHourMouseEnter(context.container);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('mouseenter', hourMouseEnterHandler, false);
      });
      
      hourMouseLeaveHandler = bindHourMouseLeave(context.container);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('mouseleave', hourMouseLeaveHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.addEventListener('click', hourHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.addEventListener('mouseenter', hourMouseEnterHandler, false);
      });
      
      clock.focus();
    }
    
    function bindHour(context) {
      return function(event) {
        event = event || window.event;
        
        if (event.currentTarget.classList.contains('selected')) {
          return;
        }
        
        var value = event.currentTarget.getAttribute('data-value'),
          hour = helpers.query('.header > .hour', context.container),
          clock = helpers.query('.body > .hours', context.container),
          ticks = helpers.queryAll('.ticks > .selected', clock),
          numbers = helpers.queryAll('.numbers > .selected', clock),
          hands = helpers.queryAll('.hands > .selected', clock),
          tick = helpers.query('.tick[data-value="' + value + '"]', clock),
          number = helpers.query('.number[data-value="' + value + '"]', clock),
          hand = helpers.query('.hand[data-value="' + value + '"]', clock),
          twelveHourPattern = /^hh:mm pp$/,
          twentyFourHourPattern = /^HH:mm pp$/;
        
        switch (context.period) {
          case 'AM':
            context.hour = (value.length === 1) ? '0' + value : value;
            hour.textContent = context.hour;
            break;
          
          case 'PM':
            if (twelveHourPattern.test(context.format)) {
              context.hour = (value.length === 1) ? '0' + value : value;
            }
            else {
              context.hour = (+value + 12).toString();
            }
            hour.textContent = context.hour;
            break;
        }
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('selected');
        });
        
        helpers.toArray(numbers).forEach(function(number) {
          number.classList.remove('selected');
        });
        
        helpers.toArray(hands).forEach(function(hand) {
          hand.classList.remove('selected');
        });
        
        tick.classList.add('selected');
        number.classList.add('selected');
        hand.classList.add('selected');
      };
    }
    
    function bindHourMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var clock = helpers.query('.body > .hours', container),
          ticks = helpers.queryAll('.ticks > .highlight', clock);
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('highlight');
        });
        
        if (event.currentTarget.classList.contains('tick')) {
          event.currentTarget.classList.add('highlight');
        }
        else {
          var hour = event.currentTarget.getAttribute('data-value'),
            tick = helpers.query('.tick[data-value="' + hour + '"]', clock);
          
          tick.classList.add('highlight');
        }
        
        clock.focus();
      };
    }
    
    function bindHourMouseLeave(container) {
      return function(event) {
        var clock = helpers.query('.body > .hours', container),
          ticks = helpers.queryAll('.ticks > .highlight', clock);
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('highlight');
        });
        
        clock.focus();
      };
    }
    
    function getMinuteClockHTML(context) {
      var minutes = context.resource.minutes;
      
      var html = '<svg class="clock" viewBox="0 0 100 100">'
        + '<circle class="face" cx="50" cy="50" r="50"/>'
        + '<circle class="face-center" cx="50" cy="50" r="1.5"/>'
      
      html = html + '<g class="ticks">'
        + '<circle class="tick" cx="50.00" cy="10.00" '
        + 'r="7.14" data-value="0"/>'
        + '<circle class="tick" cx="70.00" cy="15.36" '
        + 'r="7.14" data-value="5"/>'
        + '<circle class="tick" cx="84.64" cy="30.00" '
        + 'r="7.14" data-value="10"/>'
        + '<circle class="tick" cx="90.00" cy="50.00" '
        + 'r="7.14" data-value="15"/>'
        + '<circle class="tick" cx="84.64" cy="70.00" '
        + 'r="7.14" data-value="20"/>'
        + '<circle class="tick" cx="70.00" cy="84.64" '
        + 'r="7.14" data-value="25"/>'
        + '<circle class="tick" cx="50.00" cy="90.00" '
        + 'r="7.14" data-value="30"/>'
        + '<circle class="tick" cx="30.00" cy="84.64" '
        + 'r="7.14" data-value="35"/>'
        + '<circle class="tick" cx="15.36" cy="70.00" '
        + 'r="7.14" data-value="40"/>'
        + '<circle class="tick" cx="10.00" cy="50.00" '
        + 'r="7.14" data-value="45"/>'
        + '<circle class="tick" cx="15.36" cy="30.00" '
        + 'r="7.14" data-value="50"/>'
        + '<circle class="tick" cx="30.00" cy="15.36" '
        + 'r="7.14" data-value="55"/>'
        + '</g>';
      
      html = html + '<g class="numbers">';
      minutes.forEach(function(minute) {
        switch (minute.id) {
          case "0":
            html = html + '<text class="number" x="46.40" y="12.40" '
              + 'data-value="0">' + minute.name + '</text>';
            break;
          
          case "5":
            html = html + '<text class="number" x="66.80" y="17.40" '
              + 'data-value="5">' + minute.name + '</text>';
            break;
          
          case "10":
            html = html + '<text class="number" x="81.40" y="32.00" '
              + 'data-value="10">' + minute.name + '</text>';
            break;
          
          case "15":
            html = html + '<text class="number" x="86.80" y="52.40" '
              + 'data-value="15">' + minute.name + '</text>';
            break;
          
          case "20":
            html = html + '<text class="number" x="81.40" y="72.40" '
              + 'data-value="20">' + minute.name + '</text>';
            break;
          
          case "25":
            html = html + '<text class="number" x="66.80" y="87.00" '
              + 'data-value="25">' + minute.name + '</text>';
            break;
          
          case "30":
            html = html + '<text class="number" x="46.80" y="92.40" '
              + 'data-value="30">' + minute.name + '</text>';
            break;
          
          case "35":
            html = html + '<text class="number" x="26.80" y="87.40" '
              + 'data-value="35">' + minute.name + '</text>';
            break;
          
          case "40":
            html = html + '<text class="number" x="11.80" y="72.40" '
              + 'data-value="40">' + minute.name + '</text>';
            break;
          
          case "45":
            html = html + '<text class="number" x="6.80" y="52.40" '
              + 'data-value="45">' + minute.name + '</text>';
            break;
          
          case "50":
            html = html + '<text class="number" x="12.00" y="32.00" '
              + 'data-value="50">' + minute.name + '</text>';
            break;
          
          case "55":
            html = html + '<text class="number" x="26.40" y="17.40" '
              + 'data-value="55">' + minute.name + '</text>';
            break;
        }
      });
      html = html + '</g>';
      
      html = html + '<g class="hands">'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="50.00" y2="16.00" data-value="0"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="66.40" y2="21.00" data-value="5"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="33.00" data-value="10"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="84.00" y2="50.00" data-value="15"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="79.40" y2="67.00" data-value="20"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="66.40" y2="79.00" data-value="25"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="50.00" y2="84.00" data-value="30"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="33.00" y2="80.00" data-value="35"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="20.40" y2="67.00" data-value="40"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="16.00" y2="50.00" data-value="45"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="20.40" y2="33.00" data-value="50"/>'
        + '<line class="hand" x1="50.00" y1="50.00" '
        + 'x2="32.40" y2="20.00" data-value="55"/>'
        + '</g>';
      
      html = html + '</svg>';
      return html;
    }
    
    function bindMinuteClock(context) {
      var clock = helpers.query('.body > .minutes', context.container),
        ticks = helpers.queryAll('.ticks > .tick', clock),
        numbers = helpers.queryAll('.numbers > .number', clock);
      
      helpers.toArray(ticks).forEach(function(tick) {
        tick.removeEventListener('click', minuteHandler, false);
        tick.removeEventListener('mouseenter', minuteMouseEnterHandler, false);
        tick.removeEventListener('mouseleave', minuteMouseLeaveHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.removeEventListener('click', minuteHandler, false);
        number.removeEventListener('mouseenter', minuteMouseEnterHandler, false);
      });
      
      minuteHandler = bindMinute(context);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('click', minuteHandler, false);
      });
      
      minuteMouseEnterHandler = bindMinuteMouseEnter(context.container);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('mouseenter', minuteMouseEnterHandler, false);
      });
      
      minuteMouseLeaveHandler = bindMinuteMouseLeave(context.container);
      helpers.toArray(ticks).forEach(function(tick) {
        tick.addEventListener('mouseleave', minuteMouseLeaveHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.addEventListener('click', minuteHandler, false);
      });
      
      helpers.toArray(numbers).forEach(function(number) {
        number.addEventListener('mouseenter', minuteMouseEnterHandler, false);
      });
      
      clock.focus();
    }
    
    function bindMinute(context) {
      return function(event) {
        event = event || window.event;
        
        if (event.currentTarget.classList.contains('selected')) {
          return;
        }
        
        var value = event.currentTarget.getAttribute('data-value'),
          minute = helpers.query('.header > .minute', context.container),
          clock = helpers.query('.body > .minutes', context.container),
          ticks = helpers.queryAll('.ticks > .selected', clock),
          numbers = helpers.queryAll('.numbers > .selected', clock),
          hands = helpers.queryAll('.hands > .selected', clock),
          tick = helpers.query('.tick[data-value="' + value + '"]', clock),
          number = helpers.query('.number[data-value="' + value + '"]', clock),
          hand = helpers.query('.hand[data-value="' + value + '"]', clock);
        
        context.minute = (value.length === 1) ? '0' + value : value;
        minute.textContent = context.minute;
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('selected');
        });
        
        helpers.toArray(numbers).forEach(function(number) {
          number.classList.remove('selected');
        });
        
        helpers.toArray(hands).forEach(function(hand) {
          hand.classList.remove('selected');
        });
        
        tick.classList.add('selected');
        number.classList.add('selected');
        hand.classList.add('selected');
      };
    }
    
    function bindMinuteMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var clock = helpers.query('.body > .minutes', container),
          ticks = helpers.queryAll('.ticks > .highlight', clock);
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('highlight');
        });
        
        if (event.currentTarget.classList.contains('tick')) {
          event.currentTarget.classList.add('highlight');
        }
        else {
          var minute = event.currentTarget.getAttribute('data-value'),
            tick = helpers.query('.tick[data-value="' + minute + '"]', clock);
          
          tick.classList.add('highlight');
        }
        
        clock.focus();
      };
    }
    
    function bindMinuteMouseLeave(container) {
      return function(event) {
        var clock = helpers.query('.body > .minutes', container),
          ticks = helpers.queryAll('.ticks > .highlight', clock);
        
        helpers.toArray(ticks).forEach(function(tick) {
          tick.classList.remove('highlight');
        });
        
        clock.focus();
      };
    }
    
    function bindPeriod(context) {
      return function(event) {
        event = event || window.event;
        
        if (event.currentTarget.classList.contains('selected')) {
          return;
        }
        
        var hours = helpers.query('.body > .hours', context.container),
          minutes = helpers.query('.body > .minutes', context.container),
          hour = helpers.query('.header > .hour', context.container),
          am = helpers.query('.header > .period > .am', context.container),
          pm = helpers.query('.header > .period > .pm', context.container),
          twelveHourPattern = /^hh:mm pp$/,
          twentyFourHourPattern = /^HH:mm pp$/;
        
        if (event.currentTarget.classList.contains('am')) {
          context.period = 'AM';
          
          if (parseInt(context.hour, 10) > 12) {
            context.hour = (parseInt(context.hour, 10) - 12).toString();
          }
        }
        else {
          context.period = 'PM';
          
          if (parseInt(context.hour, 10) <= 12) {
            if (twentyFourHourPattern.test(context.format)) {
              context.hour =  (parseInt(context.hour, 10) + 12).toString();
            }
          }
        }
        
        hour.textContent = (context.hour.length === 1)
          ? '0' + context.hour : context.hour;
        
        am.classList.toggle('selected');        
        pm.classList.toggle('selected');
      }
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
        context.selected = context.timeString;
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
            updateHoursKeydown(container, event.keyCode);
          }
          else if (!minutes.classList.contains('hide')) {
            updateMinutesKeydown(container, event.keyCode);
          }
        }
      };
    }
    
    function updateHoursKeydown(container, keyCode) {
      var clock = helpers.query('.body > .hours', container);
      switch (keyCode) {
        case 13:
          var tick = helpers.query('.highlight', clock);
          if (!helpers.isEmpty(tick)) {
            var event = new CustomEvent('click', {});
            tick.dispatchEvent(event);
          }
          break;
        
        case 37:
        case 38:
        case 39:
        case 40:
          var tick = helpers.query('.tick.highlight', clock);
          if (helpers.isEmpty(tick)) {
            tick = helpers.query('.tick.selected', clock);
          }
          
          if (helpers.isEmpty(tick)) {
            tick = helpers.query('.tick[data-value="12"]', clock);
          }
          else {
            var value = tick.getAttribute('data-value');
            if (value === '12') {
              tick = helpers.query('.tick[data-value="1"]', clock);
            }
            else {
              tick = helpers.query('.tick[data-value="'
                + (++value) + '"]', clock);
            }
          }
          
          var event = new CustomEvent('mouseenter', {});
          tick.dispatchEvent(event);
          break;
      }
    }
    
    function updateMinutesKeydown(container, keyCode) {
      var clock = helpers.query('.body > .minutes', container);
      switch (keyCode) {
        case 13:
          var tick = helpers.query('.highlight', clock);
          if (!helpers.isEmpty(tick)) {
            var event = new CustomEvent('click', {});
            tick.dispatchEvent(event);
          }
          break;
        
        case 37:
        case 38:
        case 39:
        case 40:
          var tick = helpers.query('.tick.highlight', clock);
          if (helpers.isEmpty(tick)) {
            tick = helpers.query('.tick.selected', clock);
          }
          
          if (helpers.isEmpty(tick)) {
            tick = helpers.query('.tick[data-value="0"]', clock);
          }
          else {
            var value = tick.getAttribute('data-value');
            if (value === '0') {
              tick = helpers.query('.tick[data-value="5"]', clock);
            }
            if (value === '55') {
              tick = helpers.query('.tick[data-value="0"]', clock);
            }
            else {
              tick = helpers.query('.tick[data-value="'
                + (+value + 5) + '"]', clock);
            }
          }
          
          var event = new CustomEvent('mouseenter', {});
          tick.dispatchEvent(event);
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
      var pattern = /^(\d{2})\:(\d{2})\s(AM|PM)$/,
        twelveHourPattern = /^hh:mm pp$/,
        twentyFourHourPattern = /^HH:mm pp$/;
      
      if (pattern.test(context.selected)) {
        var matches = context.selected.match(pattern);
        if (!helpers.isEmpty(matches)) {
          context.hour = matches[1];
          context.minute = matches[2];
          context.period = matches[3];
        }
      }
      
      if (twentyFourHourPattern.test(context.format)) {
        if (context.hour === '24') {
          context.hour = '00';
          context.period = 'AM';
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
        time = time.replace('HH', this.hour);
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