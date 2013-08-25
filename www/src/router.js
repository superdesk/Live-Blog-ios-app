

$(function() {

	window.Router = Backbone.Router.extend({
		routes: {
		    "": "login",
		    "blogsList": "blogsList",
		    "login":"login",
		    "entriesList": "entriesList"
		},
		entriesList: function() {
			console.log("entriesList router");
			if (app.entriesListView != undefined) app.entriesListView.unbind();
			app.entriesListView = new window.entriesListView();
			app.entriesListView.render();
		},

		login: function(){
			console.log("login router");

			app.loginView.render();
		},

		blogsList: function(){
			console.log("blogsList router");
			if (app.menuBlogsListView == undefined) app.menuBlogsListView = new window.menuBlogsListView;

			if (app.blogsListView == undefined) app.blogsListView = new window.blogsListView;
			app.blogsListView.render();



		}

	});






});