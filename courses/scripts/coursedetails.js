(function() {
  'use strict';
  
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
      startDate = {},
      startTime = {},
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
      name.value = context.course.name;
      
      code = helpers.query('#code', container);
      code.value = context.course.code;
      
      if (helpers.isEmpty(subject)) {
        subject = UI.Dropdown('#subject', container);
      }
      var subjectData = { items: context.resource.subjects,
        selected: context.course.subject };
      subject.bind(subjectData)
        .change(changeSubject, context);
      
      if (helpers.isEmpty(grade)) {
        grade = UI.Dropdown('#grade', container);
      }
      var gradeData = { items: context.resource.grades,
        selected: context.course.grade };
      grade.bind(gradeData)
        .change(changeGrade, context);
      
      if (helpers.isEmpty(startDate)) {
        startDate = UI.DatePicker('#startDate', container);
      }
      var startDateData = { format: 'DD/MM/YYYY',
        selected: new Date(), today: new Date() };
      startDate.bind(startDateData, context.resource)
        .change(changeStartDate, context);
      
      if (helpers.isEmpty(startTime)) {
        startTime = UI.TimePicker('#startTime', container);
      }
      var startTimeData = { format: 'hh:mm pp',
        selected: '07:00 AM' };
      startTime.bind(startTimeData, context.resource)
        .change(changeStartTime, context);
      
      if (helpers.isEmpty(summary)) {
        summary = UI.RichText('#summary', container);
      }
      var summaryData = { content: 'This <b>rich<i>text</i>-area</b> is a test <a href="http://www.google.com"><b>Hello,</b></a>'
        + '<img src="https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3by0wMFNhNzV2UE0/components_textfields_multiline3.png" alt="/components_textfields_multiline3.png" width="232" height="136.7578947368421" data-width="1520" data-height="896"/>'
        + '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>' };
      //var summaryData = { content: '<b>Hello,</b> world!' };
      //<iframe width="560" height="315" src="https://www.youtube.com/embed/h9jRxIicqV8" frameborder="0" allowfullscreen></iframe>
      summary.bind(summaryData, context.resource)
        .change(changeSummary, context);
    }
    
    function changeSubject(context) {
      context.subject = this.selected;
    }
    
    function changeGrade(context) {
      context.grade = this.selected;
    }
    
    function changeStartDate(context) {
      context.start = this.selected;
    }
    
    function changeStartTime(context) {
      context.start = context.start + ' ' + this.selected;
    }
    
    function changeSummary(context) {
      context.summary = this.content;
    }
    
    function populateCourse(context) {
      course.name = name.value;
      course.code = code.value;
    }
    
    function validate(context) {
      var container = context.container;
      var requireds = helpers.queryAll('input[required]', container);
      var message = context.resource.invalidRequiredField;
      formHelpers.validateRequired(context, requireds, message);
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
        populateCourse(this);
        return course;
      },
      
      set course(value) {
        course = value;
        bindForm(this);
      },
      
      get hidden() {
        return this.container.classList.contains('hide');
      },
      
      get valid() {
        return !formHelpers.hasError(this.container);
      },
      
      bind: function(data, resource) {
        bindData(this, data, resource);
        return this;
      },
      
      show: function() {
        if (this.container.classList.contains('hide')) {
          this.container.classList.remove('hide');
        }
        return this;
      },
      
      hide: function() {
        if (!this.container.classList.contains('hide')) {
          this.container.classList.add('hide');
        }
        return this;
      },
      
      validate: function() {
        validate(this);
        return this;
      }
    };
  };
})();