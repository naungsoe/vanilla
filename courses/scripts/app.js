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
	appNavigation = {},
    userNodifications = {},
    userProfile = {},
    sideNavigation = {},
    subjectFilter = {},
    gradeFilter = {},
    coursesSearch = {},
	coursesActions = {},
    coursesView = {},
    coursesViewOptions = {},
    usersDeleteModal = {},
    coursesViewColumnsModal = {},
    coursesColumnsCheckboxGroup = {},
    usersDefaultFields = ['id','name','start'],
    coursesCriteria = {
      fields: 'id,name,code,subject,level,start',
      scope: 'mycourses',
      name: '',
      subject: 'all',
      grade: 'all',
      offset: 1,
      limit: 20,
	  sort: "-modified"
    };
  
  function initApplicatin(response) {
    pageResource = response;
    pageMessage = UI.Message('#pageMessage');
    appNavigation = UI.AppNavigation('#appNavigation');
    userNodifications = UI.Popover('#userNodifications');
    userProfile = UI.Popover('#userProfile');
    sideNavigation = UI.Navigation('#sideNavigation');
    subjectFilter = UI.Dropdown('#coursesSubject');
    gradeFilter = UI.Dropdown('#coursesGrade');
    coursesSearch = UI.Search('#coursesSearch');
    coursesActions = UI.Actions('#coursesActions');
    coursesViewOptions = UI.Dropdown('#coursesViewOptions');
	loadAppNavigation();
    loadNotifications();
    bindUserProfile();
    bindCoursesFilters();
    bindCoursesSearch();
    bindCoursesActions();
    loadCourses();
  }
  
  function setTitle(title) {
    var header = helpers.query('#viewTitle');
    header.innerHTML = title;
  }
  
  function loadAppNavigation() {
    showMessage(pageResource.requestLoading);
    helpers.request('/Polymer/vanilla/menu.json')
      .get({ type: "global" })
      .then(loadAppNavigationSuccess);
  }
  
  function showMessage(message, type, delay) {
    var messageData = { message: message, type: type, delay: delay };
    pageMessage.bind(messageData);
  }
  
  function loadAppNavigationSuccess(response) {
    appNavigation.bind({ items: response, selected: 'courses' });
    loadSideNavigation(response, 'courses');
  }
  
  function loadSideNavigation(response, selected) {
    var create = helpers.query('#createCourse');
    create.removeEventListener('click', loadCourseCreateView);
    create.addEventListener('click', loadCourseCreateView, false);

    var appNav = response.filter(function(item) {
      return (item.id === selected);
    });
    var navData = { items: appNav[0].items,
      selected: coursesCriteria.scope };
    sideNavigation.bind(navData)
      .select(executeSideNavigation);
  }
  
  function executeSideNavigation() {
     switch (sideNavigation.selected) {
       case 'mycourses':
       case 'sharedwithme':
       case 'deleted':
       case 'all':
         var title = helpers.query('#coursesViewTitle');
         var items = sideNavigation.items.filter(function(item) {
           return (item.id === sideNavigation.selected);
         });
         title.textContent = items[0].name;
         
         coursesCriteria.scope = sideNavigation.selected;
         loadCourses();
         break;
     }
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
  }

  function loadNotificationsFailed() {
    var html = '<div class="error">'
        + pageResource.loadNotificationsFailed
		+ '<br><a href="#notifications">'
        + pageResource.tryAgainRequest + '</a></div>';
    userNodifications.bind({ content: html });
  }
  
  function bindUserProfile() {
    userProfile.bind({ content: {}});
  }
  
  function bindCoursesFilters() {
    var subjectData = { items: pageResource.subjects, selected: 'all' },
      gradeData = { items: pageResource.grades, selected: 'all' };
    
    subjectFilter.bind(subjectData)
      .change(changeSubjectFilter);
    
    gradeFilter.bind(gradeData)
      .change(changeGradeFilter);
  }
  
  function changeSubjectFilter() {
    coursesCriteria.subject = this.selected;
    loadCourses();
  }
  
  function changeGradeFilter() {
    coursesCriteria.grade = this.selected;
    loadCourses();    
  }
  
  function bindCoursesSearch() {
    var searchData = { url: '/Polymer/vanilla/coursessearch.json',
      fields: 'name,email,image', filter: 'name' };
    coursesSearch.bind(searchData, pageResource)
      .select(searchUserSelected);
  }
  
  function searchUserSelected() {
    coursesCriteria.name = '%' + coursesSearch.keyword + '%';
    loadCourses();
  }
  
  function bindCoursesActions() {
    var actionsData = { rights: user.rights, items: [] };
    if (!helpers.isEmpty(coursesView) && (coursesView.selected.length > 0)) {
      coursesView.selected.forEach(function(selected) {
        var items = coursesView.items.filter(function(item) {
          return (item.id === selected.id);
        });
        actionsData.items = actionsData.items.concat(items);
      });
    }
    
    coursesActions.bind(actionsData)
      .select(executeCoursesAction);
  }
  
  function executeCoursesAction() {
    switch (coursesActions.selected) {
      case "edit":
        loadCourseEditView();
        break;
      
      case "delete":
        loadCoursesDeleteModal();
        break;
    }
  }
  
  function loadCourses() {
    showMessage(pageResource.requestLoading);
    helpers.request('/Polymer/vanilla/courses.json')
      .get(coursesCriteria)
      .then(loadCoursesSuccess)
      .catch(loadCoursesFailed);
  }
  
  function loadCoursesSuccess(response) {
    var view = helpers.query('#coursesView');
    if (helpers.isEmpty(view)) {
      loadCoursesViewTemplate(response);
    }
    else {
      bindCoursesView(response);
    }
    showMessage('');
  }
  
  function loadCoursesViewTemplate(response) {
    var template = helpers.query('#coursesViewTemplate'),
      fragment = document.importNode(template.content, true);
      
    var view = document.createElement('div');
    view.setAttribute('id', 'coursesView');
    view.appendChild(fragment);
    
    var table = helpers.query('.table', view);
    coursesView = UI.Table(table);
    bindCoursesView(response);
    
    template.parentNode.insertBefore(view, template);
  }
  
  function bindCoursesView(response, container) {
    response.selected = coursesView.selected || [];
    coursesView.bind(response, pageResource)
	  .sort(sortCourses)
      .changePage(changePageCourses)
      .select(bindCoursesActions);
    
    coursesViewOptions.bind({})
      .change(changeUsersView);
  }
  
  function sortCourses() {
	var sort = '';
    coursesView.columns.forEach(function(column) {
      if (column.sort === "ascending") {
        sort = sort + '+' + column.id;
	  }
	  else if (column.sort === "descending") {
        sort = sort + '-' + column.id;
	  }
    });
    coursesCriteria.sort = sort;
	loadCourses();
  }
  
  function changePageCourses() {
    coursesCriteria.offset = coursesView.offset;
    coursesCriteria.limit = coursesView.limit;
    loadCourses();
  }
  
  function loadCourseCreateView() {
    helpers.redirect('course.html?redirect=' + helpers.location.href);
  }
  
  function loadCourseEditView() {
    var courseId = coursesView.selected[0].id;
    helpers.redirect('course.html?redirect=' + helpers.location.href
      + '&id=' + courseId);
  }
  
  function loadCoursesDeleteModal() {
    var view = helpers.query('#usersDeleteModal');
    if (helpers.isEmpty(view)) {
      loadCoursesDeleteTemplate();
    }
    else {
      bindUsersDeleteModal();
    }
  }
  
  function loadCoursesDeleteTemplate() {
    var template = helpers.query('#confirmDeleteModalTemplate'),
      fragment = document.importNode(template.content, true);

    var view = document.createElement('div');
    view.setAttribute('id', 'usersDeleteModal');
    view.appendChild(fragment);
    
    usersDeleteModal = UI.Modal(view);
    bindUsersDeleteModal();

    template.parentNode.insertBefore(view, template);
  }

  function bindUsersDeleteModal() {
    var html = getUsersDeleteHTML(coursesView.selected);
    usersDeleteModal.bind({ content: html })
      .proceed(deleteSeletedUsers)
      .cancel(cancelDeleteUsers);
  }
  
  function getUsersDeleteHTML(users) {
    var html = '';
    if (users.length === 1) {
      html = pageResource.singleRecordDelete
    }
    else {
      html = pageResource.multipleRecordsDelete;
      html = html.replace('{{number}}', users.length);
    }
    return html;
  }
  
  function deleteSeletedUsers() {
    var userIds = [];
    coursesView.selected.forEach(function(user) {
      userIds.push(user.id);
    });
    
    helpers.request('/Polymer/vanilla/users.json')
      .del({ users: userIds.join(',') })
      .then(deleteUsersSuccess)
      .catch(deleteUsersFailed);
  }
  
  function deleteUsersSuccess(response) {
    usersDeleteModal.container.classList.add("hide");
    coursesView.selected.forEach(function(user) {
      coursesView.remove(user.id);
    });
    
    var message = (coursesView.selected.length === 1)
      ? pageResource.singleRecordDeleteSuccess
      : pageResource.multipleRecordsDeleteSuccess;
    message = message.replace('{{number}}', coursesView.selected.length);
    showMessage(message, 'success');
    coursesView.selected = [];
    coursesActions.items = [];
  }
  
  function deleteUsersFailed(response) {
    this.container.classList.add("hide");
    var message = coursesView.selected.length
      ? pageResource.singleRecordDeleteFailed
      : pageResource.multipleRecordsDeleteFailed;
    showMessage(message, 'error');
  }
  
  function cancelDeleteUsers() {
    this.container.classList.add("hide");
  }
  
  function changeUsersView() {
    switch (coursesViewOptions.selected) {
      case "columns":
        loadCoursesViewColumnsModal();
        break;
      
      case "download":
        downloadCourses();
        break;
    }
  }
  
  function loadCoursesViewColumnsModal() {
    var view = helpers.query('#coursesViewColumnsModal');
    if (helpers.isEmpty(view)) {
      loadCoursesViewColumnsTemplate();
    }
    else {
      bindUsersViewColumnsModal();
    }
  }
  
  function loadCoursesViewColumnsTemplate() {
    var template = helpers.query('#coursesViewColumnsModalTemplate'),
      fragment = document.importNode(template.content, true);
    
    var view = document.createElement('div');
    view.setAttribute('id', 'coursesViewColumnsModal');
    view.appendChild(fragment);
    
    coursesViewColumnsModal = UI.Modal(view);
    bindUsersViewColumnsModal();
    
    template.parentNode.insertBefore(view, template);
  }
  
  function bindUsersViewColumnsModal() {
    var html = '<div class="checkbox-group"></div>';
    coursesViewColumnsModal.bind({ content: html })
      .proceed(changeUsersViewColumns)
      .cancel(cancelUsersViewColumns);
    
    var checkboxGroup = helpers.query(
      '.checkbox-group', coursesViewColumnsModal.container);
    coursesColumnsCheckboxGroup = UI.CheckboxGroup(checkboxGroup);
    
    var checkboxGroupData = { items: [], selected: [] };
    coursesView.columns.forEach(function(column) {
      if (usersDefaultFields.indexOf(column.id) === -1) {
        checkboxGroupData.items.push(
          { id: column.id, name: column.title });
        
        if (column.hidden === 'false') {
          checkboxGroupData.selected.push(
            { id: column.id, name: column.title });
        }
      }
    });
    
    coursesColumnsCheckboxGroup.bind(checkboxGroupData);
  }
  
  function changeUsersViewColumns() {
    this.container.classList.add("hide");
    coursesView.columns.forEach(function(column) {
      if (usersDefaultFields.indexOf(column.id) === -1) {
        var selected = coursesColumnsCheckboxGroup.selected.filter(
          function(item) {
            return (item.id === column.id);
          });
        
        if (selected.length === 0) {
          column.hidden = 'true';
        }
        else {
          column.hidden = 'false';
        }
      }
    });
    
    var fields = [];
    coursesView.columns.forEach(function(column) {
      if (column.hidden === 'false') {
         fields.push(column.id);
      }
    });
    coursesCriteria.fields = fields.join(',');
    coursesView.refresh();
  }
  
  function cancelUsersViewColumns() {
    this.container.classList.add("hide");
  }
  
  function downloadCourses() {
    
  }
  
  function loadCoursesFailed(response) {
    showMessage('');
  }
})();