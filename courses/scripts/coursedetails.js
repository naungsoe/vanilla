(function() {
  'user strict';
  
  window.UI = window.UI || {};
  window.UI.CourseDetails = function(selector) {
    var course = { name: '', code: '',
        subject: '', grade: '',
        start: '', summary: '' },
      resource = {},
      name = {},
      code = {},
      subject = {},
      grade = {},
      start = {},
      summary = {};
    
    function bindData(context, data, resource) {
      context.resource = resource || {};
      context.course = data.course
        || { name: '', code: '',
          subject: '', grade: '',
          start: '', summary: '' };
    }
    
    function bindForm(context) {
      var container = context.container;
      name = helpers.query('#name', container);
      code = helpers.query('#code', container);
      subject = UI.Dropdown('#subject', container);
      grade = UI.Dropdown('#grade', container);
      start = UI.DatePicker('#start', container);      
      summary = helpers.query('#summary', container);
      
      name.value = context.course.name;
      code.value = context.course.code;
      
      var subjectData = { items: context.resource.subjects,
        selected: context.course.subject };
      subject.bind(subjectData)
        .change(changeSubject, context);

      var gradeData = { items: context.resource.grades,
        selected: context.course.grade };
      grade.bind(gradeData)
        .change(changeGrade, context);
      
      var startData = {};
      start.bind(startData, context.resource)
        .change(changeStart, context);
      
      summary.value = context.course.summary;
    }
    
    function changeSubject(context) {
      context.subject = this.selected;
    }
    
    function changeGrade(context) {
      context.grade = this.selected;
    }
    
    function changeStart(context) {
      
    }
    
    function isFormValid(context) {
      var container = context.container;
      var requiredFields = helpers.queryAll('input[required]', container);
      validateRequiredFields(context, requiredFields);
      
      var errors = helpers.queryAll('.error', container);
      return (errors.length === 0);
    }
    
    function validateRequiredFields(context, fields) {
      helpers.toArray(fields).forEach(function(field) {
        if (helpers.isEmpty(field.value)) {
          addError(field, context.resource.invalidRequiredField);
        }
        else {
          clearError(field);
        }
      });
    }
    
    function addError(field, message) {
      field.parentNode.parentNode.classList.add("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (helpers.isEmpty(hint)) {
        var hint = document.createElement('div');
        hint.classList.add('hint');
        field.parentNode.appendChild(hint);
      }
      hint.innerHTML = '<div class="hint">' + message + '</div>';
    }
    
    function clearError(field) {
      field.parentNode.parentNode.classList.remove("error");
      
      var hint = helpers.query('.hint', field.parentNode);
      if (!helpers.isEmpty(hint)) {
        field.parentNode.removeChild(hint);
      }
    }
    
    return {
      get container() {
        return helpers.query(selector);
      },
      
      get resource() {
        return resource;
      },
      
      set resource(value) {
        resource = value;
      },
      
      get course() {
        return course;
      },
      
      set course(value) {
        course = value;
        bindForm(this);
      },
      
      get valid() {
        return isFormValid(this);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      toggle: function() {
        this.container.classList.toggle('hide');
        return this;
      }
    };
  };
})();