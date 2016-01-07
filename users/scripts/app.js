(function() {
  'use strict';
  
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      helpers.request('/Polymer/vanilla/usersresource.json')
        .get({ type: "users" })
        .then(initApplicatin);
    }
  }
  
  var pageResource = {},
    pageMessage = {},
	appNavigation = {},
    sideNavigation = {},
    userNodifications = {},
    userProfile = {},
    usersSearch = {},
	usersActions = {},
    usersView = {},
    usersViewOptions = {},
    userCreateModal = {},
    usersDeleteModal = {},
    usersViewColumnsModal = {},
    usersViewColumnsCheckboxGroup = {},
    usersDefaultFields = ['id','name','email'],
    usersCriteria = {
      fields: 'id,name,email,status,accessed',
      scope: 'active',
      name: '',
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
    usersSearch = UI.Search('#usersSearch');
    usersActions = UI.Actions('#usersActions');
    usersViewOptions = UI.Dropdown('#usersViewOptions');
	loadAppNavigation();
    loadNotifications();
    bindUserProfile();
    bindUsersActions();
    bindUsersSearch();
    loadUsers();
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
    appNavigation.bind({ items: response, selected: 'users' });
    loadSideNavigation(response, 'users');
  }
  
  function loadSideNavigation(response, selected) {
    var create = helpers.query('#createUser');
    create.removeEventListener('click', loadUserCreateFormView);
    create.addEventListener('click', loadUserCreateFormView, false);

    var appNav = response.filter(function(item) {
      return (item.id === selected);
    });
    var navData = { items: appNav[0].items,
      selected: usersCriteria.scope };
    sideNavigation.bind(navData)
      .select(executeSideNavigation);
  }
  
  function executeSideNavigation() {
     helpers.locationHash = sideNavigation.selected;
     switch (sideNavigation.selected) {
       case 'active':
       case 'inactive':
       case 'deleted':
       case 'all':
         var title = helpers.query('#usersViewTitle');
         var items = sideNavigation.items.filter(function(item) {
           return (item.id === sideNavigation.selected);
         });
         title.textContent = items[0].name;
         
         usersCriteria.scope = sideNavigation.selected;
         loadUsers();
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
  
  function bindUsersSearch() {
    var searchData = { url: '/Polymer/vanilla/userssearch.json',
      fields: 'name,email,image', filter: 'name' };
    usersSearch.bind(searchData, pageResource)
      .select(searchUserSelected);
  }
  
  function searchUserSelected() {
    usersCriteria.name = '%' + usersSearch.keyword + '%';
    loadUsers();
  }
  
  function bindUsersActions() {
    var actionsData = { rights: user.rights, items: [] };
    if (!helpers.isEmpty(usersView) && (usersView.selected.length > 0)) {
      usersView.selected.forEach(function(selected) {
        var items = usersView.items.filter(function(item) {
          return (item.id === selected.id);
        });
        actionsData.items = actionsData.items.concat(items);
      });
    }
    
    usersActions.bind(actionsData)
      .select(executeUsersAction);
  }
  
  function executeUsersAction() {
    switch (usersActions.selected) {
      case "edit":
        loadUserEditFormView();
        break;
      
      case "delete":
        loadUsersDeleteModal();
        break;
    }
  }
  
  function loadUsers() {
    showMessage(pageResource.requestLoading);
    helpers.request('/Polymer/vanilla/users.json')
      .get(usersCriteria)
      .then(loadUsersSuccess)
      .catch(loadUsersFailed);
  }
  
  function loadUsersSuccess(response) {
    var view = helpers.query('#usersView');
    if (helpers.isEmpty(view)) {
      loadUsersViewTemplate(response);
    }
    else {
      bindUsersView(response);
    }
    showMessage('');
  }
  
  function loadUsersViewTemplate(response) {
    var template = helpers.query('#usersViewTemplate'),
      fragment = document.importNode(template.content, true);
      
    var view = document.createElement('div');
    view.setAttribute('id', 'usersView');
    view.appendChild(fragment);
    
    var table = helpers.query('.table', view);
    usersView = UI.Table(table);
    bindUsersView(response);
    
    template.parentNode.insertBefore(view, template);
  }
  
  function bindUsersView(response, container) {
    response.selected = usersView.selected || [];
    usersView.bind(response, pageResource)
	  .sort(sortUsers)
      .changePage(changePageUsers)
      .select(bindUsersActions);
    
    usersViewOptions.bind({})
      .change(changeUsersView);
  }
  
  function sortUsers() {
	var sort = '';
    usersView.columns.forEach(function(column) {
      if (column.sort === "ascending") {
        sort = sort + '+' + column.id;
	  }
	  else if (column.sort === "descending") {
        sort = sort + '-' + column.id;
	  }
    });
    usersCriteria.sort = sort;
	loadUsers();
  }
  
  function changePageUsers() {
    usersCriteria.offset = usersView.offset;
    usersCriteria.limit = usersView.limit;
    loadUsers();
  }
  
  function loadUserCreateFormView() {
    var view = helpers.query('#userCreateModal');
    if (helpers.isEmpty(view)) {
      loadUserCreateModalTemplate();
    }
    else {
      bindUserCreateModal();
    }
  }
  
  function loadUserCreateModalTemplate() {
    var template = helpers.query('#createUserModalTemplate'),
      fragment = document.importNode(template.content, true);

    var view = document.createElement('div');
    view.setAttribute('id', 'userCreateModal');
    view.appendChild(fragment);
    
    userCreateModal = UI.Modal(view);
    bindUserCreateModal();
    
    template.parentNode.insertBefore(view, template);
  }
  
  function bindUserCreateModal() {
	var form = helpers.query('.form', userCreateModal.container);
    var userCreateForm = UI.UserForm(form);
    userCreateForm.bind({}, pageResource);
    
    userCreateModal.bind({})
      .proceed(saveUserDetails, userCreateForm)
      .cancel(cancelSaveUserDetails);
  }
  
  function saveUserDetails(userCreateForm) {
    if (userCreateForm.valid) {
      this.container.classList.add("hide");
    }
  }
  
  function cancelSaveUserDetails() {
    this.container.classList.add("hide");
  }
  
  function loadUserEditFormView() {
    
  }
  
  function loadUsersDeleteModal() {
    var view = helpers.query('#usersDeleteModal');
    if (helpers.isEmpty(view)) {
      loadUsersDeleteTemplate();
    }
    else {
      bindUsersDeleteModal();
    }
  }
  
  function loadUsersDeleteTemplate() {
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
    var html = getUsersDeleteHTML(usersView.selected);
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
    usersView.selected.forEach(function(user) {
      userIds.push(user.id);
    });
    
    helpers.request('/Polymer/vanilla/users.json')
      .del({ users: userIds.join(',') })
      .then(deleteUsersSuccess)
      .catch(deleteUsersFailed);
  }
  
  function deleteUsersSuccess(response) {
    usersDeleteModal.container.classList.add("hide");
    usersView.selected.forEach(function(user) {
      usersView.remove(user.id);
    });
    
    var message = (usersView.selected.length === 1)
      ? pageResource.singleRecordDeleteSuccess
      : pageResource.multipleRecordsDeleteSuccess;
    message = message.replace('{{number}}', usersView.selected.length);
    showMessage(message, 'success');
    usersView.selected = [];
    usersActions.items = [];
  }
  
  function deleteUsersFailed(response) {
    usersDeleteModal.container.classList.add("hide");
    var message = usersView.selected.length
      ? pageResource.singleRecordDeleteFailed
      : pageResource.multipleRecordsDeleteFailed;
    showMessage(message, 'error');
  }
  
  function cancelDeleteUsers() {
    this.container.classList.add("hide");
  }
  
  function changeUsersView() {
    switch (usersViewOptions.selected) {
      case "columns":
        loadUsersViewColumnsModal();
        break;
      
      case "download":
        downloadUsers();
        break;
    }
  }
  
  function loadUsersViewColumnsModal() {
    var view = helpers.query('#usersViewColumnsModal');
    if (helpers.isEmpty(view)) {
      loadUsersViewColumnsTemplate();
    }
    else {
      bindUsersViewColumnsModal();
    }
  }
  
  function loadUsersViewColumnsTemplate() {
    var template = helpers.query('#usersViewColumnsModalTemplate'),
      fragment = document.importNode(template.content, true);

    var view = document.createElement('div');
    view.setAttribute('id', 'usersViewColumnsModal');
    view.appendChild(fragment);
    
    usersViewColumnsModal = UI.Modal(view);
    bindUsersViewColumnsModal();

    template.parentNode.insertBefore(view, template);
  }
  
  function bindUsersViewColumnsModal() {
    var html = '<div class="checkbox-group"></div>';
    usersViewColumnsModal.bind({ content: html })
      .proceed(changeUsersViewColumns)
      .cancel(cancelUsersViewColumns);
    
    var checkboxGroup = helpers.query(
      '.checkbox-group', usersViewColumnsModal.container);
    usersViewColumnsCheckboxGroup = UI.CheckboxGroup(checkboxGroup);
    
    var checkboxGroupData = { items: [], selected: [] };
    usersView.columns.forEach(function(column) {
      if (usersDefaultFields.indexOf(column.id) === -1) {
        checkboxGroupData.items.push(
          { id: column.id, name: column.title });
        
        if (column.hidden === 'false') {
          checkboxGroupData.selected.push(
            { id: column.id, name: column.title });
        }
      }
    });
    
    usersViewColumnsCheckboxGroup.bind(checkboxGroupData);
  }
  
  function changeUsersViewColumns() {
    usersViewColumnsModal.container.classList.add("hide");
    usersView.columns.forEach(function(column) {
      if (usersDefaultFields.indexOf(column.id) === -1) {
        var selected = usersViewColumnsCheckboxGroup.selected.filter(
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
    usersView.columns.forEach(function(column) {
      if (column.hidden === 'false') {
         fields.push(column.id);
      }
    });
    usersCriteria.fields = fields.join(',');
    usersView.refresh();
  }
  
  function cancelUsersViewColumns() {
    usersViewColumnsModal.container.classList.add("hide");
  }
  
  function downloadUsers() {
    
  }
  
  function loadUsersFailed(response) {
    showMessage('');
  }
})();