

$(function() {

	window.Router = Backbone.Router.extend({
		routes: {
		    "": "login",
		    "blogsList": "blogsList",
		    "login":"login",
		    "entriesList": "entriesList"
		},
		entriesList: function() {

		},

		login: function(){
			console.log("login router");

			app.loginView.render();
		},

		blogsList: function(){
			console.log("blogsList router");
			app.blogsListView = new window.blogsListView;
			app.blogsListView.render();
		}

	});



	Backbone.history.start();


});