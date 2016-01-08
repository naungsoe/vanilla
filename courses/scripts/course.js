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
    courseWizard = {},
    courseDetails = {},
    courseActivities = {};
  
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
    
    var detailsData = {};
    courseDetails.bind(detailsData, pageResource);
  }
  
  function changeCourseWizardStep() {
    switch (courseWizard.selected) {
      case "details":
        if (courseDetails.hidden) {
          var detailsData = {};
          courseDetails.bind(detailsData);
          courseDetails.toggle();
          courseActivities.toggle();
        }
        break;
      
      case "resources":
        if (courseActivities.hidden) {
          var courseData = {};
          courseActivities.bind(courseData);
          courseDetails.toggle();
          courseActivities.toggle();
        }
        break;
    }
  }
})();