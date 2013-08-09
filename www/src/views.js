$(function() {


	window.ListView = Backbone.View.extend({
		el: $("#search_form"),
		search_twitter: function(e) {
			e.preventDefault();
			var self = this;
			$.getJSON("http://search.twitter.com/search.json?callback=?",{
				q: $("#q").val()
			}, function(data) {
				$("#tweets li").fadeOut();
				for(var i in data.results) {
					var tweet = new Tweet(data.results[i]);
					console.log(data.results[i]);
					var tweetView = new TweetView({model: TweetModel});
					tweetView.render();
				}
			});
		},
		events: {
			"submit": "search_twitter"
		}
	});

	window.blogsListItemView = Backbone.View.extend({
		template: $("#blogItem_template").html(),
		model: BlogItemModel,
		tagName: "li",

		render: function () {

			this.JSONmodel = this.model.toJSON();
			var tmpl = _.template(this.template);

			console.log("blogItem render");

			$(this.el).html(tmpl(this.JSONmodel));
			return this;
		},
		events: {
			"click a":    "blogItemClick"
		},

		blogItemClick: function(){

			app.session.set("blog", this.JSONmodel.Id);
			app.session.set("blogTitle", this.JSONmodel.Title);
			console.log(app.session.get("blog"));
			app.router.navigate("entriesList", {trigger: true});
		},


	});

	window.blogsListView = Backbone.View.extend({
		el: $("#blogsListView"),

		initialize: function () {

			console.log("blogListView init");


			this.collection = new window.blogsCollection();
		    //	this.listenTo(this.collection, 'reset', this.render);

		    var self = this;
		    this.collection.fetch().complete(function(){
		    	self.render();
		    });



	        //this.render();
	    },

	    render: function () {
	    	console.log("blogsListView render");
	    	var that = this;
	    	this.$el.find('ul').empty();
	    	_.each(this.collection.models, function (item) {
	    		that.renderBlogItem(item);
	    	}, this);
	    	$("#loading").css("display", "none");
	    	$(".page").css("display", "none");
	    	this.$el.css("display", "block");
	    },



	    renderBlogItem: function (item) {
	    	var blogItemView = new blogsListItemView({
	    		model: item
	    	});

	    	this.$el.find("ul").append(blogItemView.render().el);
	    }
	});



	window.LoginView = Backbone.View.extend({

		el: '#loginView',

		render: function() {
			$(".page").css("display", "none");
			$("#loading").css("display", "none");
			console.log("loginView render");
			this.$el.css("display", "block");
		},

		events: {
			"submit":    "loginHandler"
		},

		loginHandler: function(e){
			e.preventDefault();
			$(".page").css("display", "none");
			console.log("loginView loginHandler");
			$("#loading").css("display", "block");
			var formData = this.$el.find("form").serializeObject();

			var parsedHost = formData.host.replace("http://","");
			if (parsedHost.slice(-1)=="/") parsedHost = parsedHost.slice(0,parsedHost.length - 1);

			gap.addUser(formData.login, formData.pass, parsedHost);
			auth.login(function(){
				console.log("auth callback fired");

				app.router.navigate("someDeadRoute");
				app.router.navigate(route, {trigger: true})


			});
		}
	});



	/* entries list View */

	window.entriesListItemView = Backbone.View.extend({


		tagName: "li",

		render: function () {
			console.log(this.model.getClass());
			try {
				var tpl = _.template($('#item_' + this.model.getClass() + '_template').html());
			} catch (err) {

				console.log("No template for " + this.model.getClass() + " type.");
				var tpl = _.template($('#item_normal_template').html());
			}




			console.log("entryItem render");

			$(this.el).html(tpl(this.model.toJSON()));
			return this;
		},



	});

	window.entriesListView = Backbone.View.extend({
		el: $("#entriesListView"),

		initialize: function () {

			console.log("entriesListView init");


			this.collection = new window.entriesCollection();


			var self = this;
			this.collection.fetch().complete(function(){
				self.render();
			});




		},

		render: function () {
			console.log("entriesListView render");
			var that = this;
			this.$el.find('ul').empty();
			_.each(this.collection.models, function (item) {
				that.renderItem(item);
			}, this);
			$("#loading").css("display", "none");
			$(".page").css("display", "none");
			this.$el.find("h1.title").html(app.session.get("blogTitle"));
			this.$el.css("display", "block");
		},



		renderItem: function (item) {
			var itemView = new entriesListItemView({
				model: item
			});

			this.$el.find("ul").append(itemView.render().el);
		}
	});


});