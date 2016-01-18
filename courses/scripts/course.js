(function() {
  'use strict';
  
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      helpers.request('/Polymer/vanilla/coursesresource.json')
        .get({ type: "courses" })
        .then(initApplicatin);
    }
  }
  
  var pageResource = {},
    pageMessage = {},
	pageNavigation = {},
    userNodifications = {},
    userProfile = {},
    courseData = {},
    courseWizard = {},
    courseDetails = {},
    courseActivities = {},
    backHandler = function() {},
    cancelHandler = function() {},
    continueHandler = function() {};
  
  function initApplicatin(response) {
    pageResource = response;
    pageMessage = UI.Message('#pageMessage');
    pageNavigation = UI.PageNavigation('#pageNavigation');
    userNodifications = UI.Popover('#userNodifications');
    userProfile = UI.Popover('#userProfile');
    courseWizard = UI.Wizard('#courseWizard');
    courseDetails = UI.CourseDetails('#courseDetails');
    courseActivities = UI.CourseActivities('#courseActivities');
    loadNotifications();
	bindPageNavigation();
    bindUserProfile();
    bindCourseWizard();
  }
  
  function setTitle(title) {
    var header = helpers.query('#viewTitle');
    header.innerHTML = title;
  }
  
  function showMessage(message, type, delay) {
    var messageData = { message: message, type: type, delay: delay };
    pageMessage.bind(messageData);
  }
  
  function loadNotifications() {
    showMessage(pageResource.requestLoading);
    helpers.request('/Polymer/vanilla/notifications.json')
      .get({ type: "global" })
      .then(loadNotificationsSuccess)
      .catch(loadNotificationsFailed);
  }
  
  function loadNotificationsSuccess() {
    var html = '<div class="notifications">'
      + '<div class="item">Notifications loaded.</div></div>';
    userNodifications.bind({ content: html });
    showMessage('');
  }

  function loadNotificationsFailed() {
    var html = '<div class="error">'
        + pageResource.loadNotificationsFailed
		+ '<br><a href="#notifications">'
        + pageResource.tryAgainRequest + '</a></div>';
    userNodifications.bind({ content: html });
    showMessage('');
  }
  
  function bindPageNavigation() {
    pageNavigation.bind({ redirect: helpers.getQuery('redirect') });
  }
  
  function bindUserProfile() {
    userProfile.bind({ content: {}});
  }
  
  function bindCourseWizard() {
    var wizardData = { selected: 'details' };
    courseWizard.bind(wizardData)
      .change(changeCourseWizardStep);
    
    courseDetails.bind(courseData, pageResource);
    showCourseDetails();
    bindCourseDetailsActions();
  }
  
  function changeCourseWizardStep() {
    switch (courseWizard.selected) {
      case "details":
        courseDetails.validate();
        if (!courseDetails.valid) {
          return;
        }
        courseData.course = courseDetails.course;
        break;
      
      case "activities":
        courseActivities.validate();
        if (!courseActivities.valid) {
          return;
        }
        break;
    }
    
    switch (courseWizard.current) {
      case "details":
        showCourseDetails();
        bindCourseDetailsActions();
        break;
      
      case "activities":
        showCourseActivities();
        showCourseActivitiesActions();
        break;
    }
    courseWizard.proceed();
  }
  
  function showCourseDetails() {
    if (!courseDetails.hidden) {
      return;
    }
    
    courseDetails.bind(courseData, pageResource);
    courseActivities.hide();
    courseDetails.show();
  }
  
  function bindCourseDetailsActions() {
    var actions = helpers.query('#courseActions'),
      back = helpers.query('.back', actions),
      cancel = helpers.query('.cancel', actions),
      cont = helpers.query('.continue', actions);
    
    back.setAttribute('disabled', '');
    cancel.removeAttribute('disabled');
    cont.removeAttribute('disabled');
    
    back.removeEventListener('click', backHandler, false);
    cancel.removeEventListener('click', cancelHandler, false);
    cont.removeEventListener('click', continueHandler, false);
    
    cancelHandler = bindCourseDetailsCancel();
    cancel.addEventListener('click', cancelHandler, false);
    
    continueHandler = bindCourseDetailsContinue();
    cont.addEventListener('click', continueHandler, false);
  }
  
  function bindCourseDetailsCancel() {
    return function(event) {
      helpers.redirect(helpers.getQuery('redirect'));
    };
  }
  
  function bindCourseDetailsContinue() {
    return function(event) {
      courseDetails.validate();
      if (courseDetails.valid) {
        courseData.course = courseDetails.course;
        courseWizard.completed = 'details';
        courseWizard.selected = 'activities';
        showCourseActivities();
        showCourseActivitiesActions();
      }
    };
  }
  
  function showCourseActivities() {
    if (!courseActivities.hidden) {
      return;
    }
    
    courseActivities.bind(courseData, pageResource);
    courseDetails.hide();
    courseActivities.show();
  }
  
  function showCourseActivitiesActions() {
    var actions = helpers.query('#courseActions'),
      back = helpers.query('.back', actions),
      cancel = helpers.query('.cancel', actions),
      cont = helpers.query('.continue', actions);
    
    back.removeAttribute('disabled', '');
    cancel.removeAttribute('disabled');
    cont.removeAttribute('disabled');
    
    back.removeEventListener('click', backHandler, false);
    cancel.removeEventListener('click', cancelHandler, false);
    cont.removeEventListener('click', continueHandler, false);
    
    cancelHandler = bindCourseDetailsCancel();
    cancel.addEventListener('click', backHandler, false);
    
    continueHandler = bindCourseDetailsContinue();
    cancel.addEventListener('click', continueHandler, false);
  }
})();