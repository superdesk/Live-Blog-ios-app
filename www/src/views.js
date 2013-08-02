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

			var tmpl = _.template(this.template);

			console.log("blogItem render");
			console.log(this.model.toJSON());
			$(this.el).html(tmpl(this.model.toJSON()));
			return this;
		}


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
			auth.login();
		}
	});

});