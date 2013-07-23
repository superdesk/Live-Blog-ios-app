$(function() {

	var Router = Backbone.Router.extend({
		routes: {
		    "": "showList",
		    "login":"login",
		    "blogsList": "blogsList"
		},
		showList: function() {
			var listView = new window.ListView;
		},

		login: function(){
			var loginView = new window.LoginView;
		},

		blogsList: function(){
			var blogsListView = new window.blogsListView;
		}

	});


	window.router = new Router();

	Backbone.history.start();

});