

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
			if (typeof app.entriesListView === 'object'){
				clearTimeout(app.entriesListView.timer);
				app.entriesListView.unbind();
				delete app.entriesListView;
				console.log("delete poszło");
			}
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