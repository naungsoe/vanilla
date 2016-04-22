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
  window.UI.MatrixPicker = function(selector) {
    var matrix = '',
	  selected = '',
      toggleHandler = function() {},
      cellHandler = function() {},
      mouseEnterHandler = function() {},
      mouseLeaveHandler = function() {},
      docKeydownHandler = function() {},
      docClickHandler = function() {},
      changeHandler = function() {};
      
    function bindData(context, data) {
      context.matrix = data.matrix || '6x6';
	  context.selected = data.selected || '';
    }
    
    function bindMatrixPicker(context) {
	  if (!helpers.isEmpty(context.matrix)) {
		var plate = helpers.query(".plate", context.container);
        plate.innerHTML = getMatrixPlateHTML(context);
	  }
	  
      var toggle = helpers.query('.toggle', context.container);
      toggle.removeEventListener('click', toggleHandler, false);
      
      toggleHandler = bindToggle(context.container);
      toggle.addEventListener('click', toggleHandler, false);
      
      var cells = helpers.queryAll(
        '.plate > table > tbody > tr > td', context.container);
      helpers.toArray(cells).forEach(function(cell) {
        cell.removeEventListener('click', cellHandler, false);
        cell.removeEventListener('mouseenter', mouseEnterHandler, false);
        cell.removeEventListener('mouseleave', mouseLeaveHandler, false);
      });
      
      cellHandler = bindCell(context);
      helpers.toArray(cells).forEach(function(cell) {
        cell.addEventListener('click', cellHandler, false);
      });
      
      mouseEnterHandler = bindMouseEnter(context.container);
      helpers.toArray(cells).forEach(function(cell) {
        cell.addEventListener('mouseenter', mouseEnterHandler, false);
      });
      
      mouseLeaveHandler = bindMouseLeave(context.container);
      helpers.toArray(cells).forEach(function(cell) {
        cell.addEventListener('mouseleave', mouseLeaveHandler, false);
      });
      
      document.removeEventListener('keydown', docKeydownHandler, false);
      document.removeEventListener('click', docClickHandler, false);
      
      docKeydownHandler = bindDocKeydown(context.container);
      document.addEventListener('keydown', docKeydownHandler, false);
      
      docClickHandler = bindDocClick(context.container);
      document.addEventListener('click', docClickHandler, false);
    }
    
    function getMatrixPlateHTML(context) {
      var dimensions = context.matrix.split('x');
      var html = '<table><tbody>';
      for (var i = 0; i < dimensions[0]; i++) {
        html = html + '<tr>';
        for (var j = 0; j < dimensions[1]; j++) {
          html = html + '<td>&nbsp;</td>';
        }
        html = html + '</tr>';
      }
      
      html = html + '</tbody></table>';
      return html;
	}
	
    function bindToggle(container) {
      return function(event) {
        container.classList.toggle('open');
        triggerReflow(container);
      };
    }
    
    function triggerReflow(container) {
      var reflow = helpers.query('.reflow', container);
      if (!helpers.isEmpty(reflow)) {
        reflow.parentNode.removeChild(reflow);
      }
      
      setTimeout(function initiateReflow() {
        reflow = document.createElement('div');
        reflow.classList.add('reflow');
        container.appendChild(reflow);
      }, 100);
    }
    
    function bindDocKeydown(container) {
      return function(event) {
        event = event || window.event;
        
        var target = event.target;
        while (!target.classList.contains('matrixpicker')) {
          if (target.nodeName === "BODY") {
            break;
          }
          target = target.parentNode;
        }
        
        if ((target === container)
            && (container.classList.contains('open'))) {
          event.preventDefault();
          switch (event.keyCode) {
            case 13:
              var cells = helpers.queryAll(
                '.plate > table > tbody > tr > .highlighted', container);
              if (!helpers.isEmpty(cells)) {
                var event = new CustomEvent('click', {});
                cells[cells.length - 1].dispatchEvent(event);
                return;
              }
              break;
            
            case 37:
            case 38:
            case 39:
            case 40:
              var cell = helpers.query(
                '.plate > table > tbody > tr > td:first-child', container);
              var cells = helpers.queryAll(
                '.plate > table > tbody > tr > .highlighted', container);
              if (!helpers.isEmpty(helpers.toArray(cells))) {
                cell = cells[cells.length - 1];
                if (event.keyCode === 37) {
                  if (cell.cellIndex > 0) {
                    cell = cell.previousSibling;
                  }
                }
                else if (event.keyCode === 38) {
                  var row = cell.parentNode;
                  if (row.rowIndex > 0) {
                    row = row.previousSibling;
                    
                    var columns = helpers.queryAll('td', row);
                    columns = helpers.toArray(columns).filter(function(column) {
                      return (column.cellIndex === cell.cellIndex);
                    });
                    cell = columns[0];
                  }
                }
                else if (event.keyCode === 39) {
                  var row = cell.parentNode;
                  var columns = helpers.queryAll('td', row);
                  if (cell.cellIndex < (columns.length - 1)) {
                    cell = cell.nextSibling;
                  }
                }
                else if (event.keyCode === 40) {
                  var row = cell.parentNode;
                  var rows = helpers.queryAll('.plate > table > tbody > tr', container);
                  if (row.rowIndex < (rows.length - 1)) {
                    row = row.nextSibling;
                    
                    var columns = helpers.queryAll('td', row);
                    columns = helpers.toArray(columns).filter(function(column) {
                      return (column.cellIndex === cell.cellIndex);
                    });
                    cell = columns[0];
                  }
                }
              }
              
              helpers.toArray(cells).forEach(function(cell) {
                cell.classList.remove('highlighted');
              });
              
              var rows = helpers.queryAll('.plate > table > tbody > tr', container);
              rows = helpers.toArray(rows).filter(function(row) {
                return (row.rowIndex <= cell.parentNode.rowIndex);
              });
              
              helpers.toArray(rows).forEach(function(row) {
                var columns = helpers.queryAll('td', row);
                columns = helpers.toArray(columns).filter(function(column) {
                  return (column.cellIndex <= cell.cellIndex);
                });
                
                helpers.toArray(columns).forEach(function(column) {
                  column.classList.add('highlighted');
                });
              });
              break;
          }
        }
      };
    }
    
    function bindDocClick(container) {
      return function(event) {
        event = event || window.event;
        
        var target = event.target;
        while (target.classList
            && !target.classList.contains('matrixpicker')) {
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
    
    function updateStatus(context) {
      if (context.selected === '') {
        return;
      }
      
      var container = context.container,
        cells = helpers.queryAll(
          '.plate > table > tbody > tr > .selected', container);
      helpers.toArray(cells).forEach(function(cell) {
        cell.classList.remove('selected');
      });
      
      var dimensions = context.selected.split('x');
      var rows = helpers.queryAll('.plate > table > tbody > tr', container);
      rows = helpers.toArray(rows).filter(function(row) {
        return (row.rowIndex < dimensions[0]);
      });
      
      helpers.toArray(rows).forEach(function(row) {
        var columns = helpers.queryAll('td', row);
        columns = helpers.toArray(columns).filter(function(column) {
          return (column.cellIndex < dimensions[1]);
        });
        
        helpers.toArray(columns).forEach(function(column) {
          column.classList.add('selected');
        });
      });
    }
    
    function bindCell(context) {
      return function(event) {
        event = event || window.event;
        
        var container = context.container,
          cells = helpers.queryAll(
          '.plate > table > tbody > tr > .highlighted', container);
        helpers.toArray(cells).forEach(function(cell) {
          cell.classList.remove('highlighted');
        });
        
        var rows = helpers.queryAll('.plate > table > tbody > tr', container);
        rows = helpers.toArray(rows).filter(function(row) {
          return (row.rowIndex <= event.currentTarget.parentNode.rowIndex);
        });
        
        helpers.toArray(rows).forEach(function(row) {
          var columns = helpers.queryAll('td', row);
          columns = helpers.toArray(columns).filter(function(column) {
            return (column.cellIndex <= event.currentTarget.cellIndex);
          });
          
          helpers.toArray(columns).forEach(function(column) {
            column.classList.add('selected');
          });
        });
        
        context.selected = (event.currentTarget.parentNode.rowIndex + 1)
          + 'x' + (event.currentTarget.cellIndex + 1);
        container.classList.toggle('open');
        
        var event = new CustomEvent('change', {});
        container.dispatchEvent(event);
      };
    }
    
    function bindMouseEnter(container) {
      return function(event) {
        event = event || window.event;
        
        var cells = helpers.queryAll(
          '.plate > table > tbody > tr > .highlighted', container);
        helpers.toArray(cells).forEach(function(cell) {
          cell.classList.remove('highlighted');
        });
        
        var rows = helpers.queryAll('.plate > table > tbody > tr', container);
        rows = helpers.toArray(rows).filter(function(row) {
          return (row.rowIndex <= event.currentTarget.parentNode.rowIndex);
        });
        
        helpers.toArray(rows).forEach(function(row) {
          var columns = helpers.queryAll('td', row);
          columns = helpers.toArray(columns).filter(function(column) {
            return (column.cellIndex <= event.currentTarget.cellIndex);
          });
          
          helpers.toArray(columns).forEach(function(column) {
            column.classList.add('highlighted');
          });
        });
      };
    }
    
    function bindMouseLeave(container) {
      return function(event) {
        var cells = helpers.queryAll(
          '.plate > table > tbody > tr > .highlighted', container);
        helpers.toArray(cells).forEach(function(cell) {
          cell.classList.remove('highlighted');
        });
      };
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
      
      get matrix() {
        return matrix;
      },
      
      set matrix(value) {
        matrix = value;
        bindMatrixPicker(this);
        updateStatus(this);
      },
      
      get selected() {
        return selected;
      },
      
      set selected(value) {
        selected = value;
        updateStatus(this);
      },
      
      bind: function(data) {
        bindData(this, data);
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