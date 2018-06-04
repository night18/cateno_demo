Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'login'});
Router.route('/dashboardc', {name: 'company'});
Router.route('/dashboardi', {name: 'investor'});
Router.route('/request', {name: 'request'});