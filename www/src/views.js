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
				app.router.navigate(auth.route, {trigger: true});


			});
		}
	});



	/* entries list View */

	window.entriesListItemView = Backbone.View.extend({


		tagName: "li",

		initialize: function() {
			this.model.bind('change', this.update, this);
			this.model.bind('remove', this.remove, this);
		},




		render: function () {


			try {
				var tpl = _.template($('#item-' + this.model.getClass() + '-template').html());
			} catch (err) {


				var tpl = _.template($('#item-normal-template').html());
			}

			if (this.model.isService()) {
				$(this.el).addClass(this.model.get('AuthorName')).removeClass('quote');

				if (this.model.get('AuthorName') == 'flickr') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					this.model.set('Content', '<div class="service_content "><img class="responsive" src="http:'+meta.imageUrls.full+'" /><p>'+this.model.get('Content')+'</p></div>');

				} else if (this.model.get('AuthorName') == 'twitter') {


				} else if (this.model.get('AuthorName') == 'instagram') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					this.model.set('Content', '<div class="service_content "><img class="responsive" src="'+meta.images.low_resolution.url+'" /></div>');

				} else if (this.model.get('AuthorName') == 'youtube') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					this.model.set('Content', '<iframe width="100%" height="200" src="http://www.youtube.com/embed/'+meta.id+'" frameborder="0" allowfullscreen></iframe>');

				} else if (this.model.get('AuthorName') == 'google') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					if(meta.GsearchResultClass == 'GwebSearch'){
						this.model.set('Content', '<a class="service_content" href="'+meta.unescapedUrl+'" target="_blank">'+this.model.get('Content')+'<span class="small_caption">'+meta.visibleUrl+'</span></a>');
					} else if(meta.GsearchResultClass == 'GnewsSearch'){
						this.model.set('Content', '<a class="service_content" href="'+meta.unescapedUrl+'" target="_blank">'+this.model.get('Content')+'<span class="small_caption">'+meta.unescapedUrl+'</span></a>');
					} else if(meta.GsearchResultClass == 'GimageSearch'){
						this.model.set('Content', '<div class="service_content "><img class="responsive" src="'+meta.unescapedUrl+'" /><p>'+this.model.get('Content')+'</p></div>');
					}

				} else if (this.model.get('AuthorName') == 'soundcloud') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					this.model.set('Content', '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F'+meta.id+'&amp;auto_play=false&amp;show_artwork=true&amp;color=ff7700"></iframe>');

				}



			}





			$(this.el).html(tpl({item: this.model})).addClass(this.model.getClass());




			return this;
		},

		// not supported yet
		update: function() {
			var view = this;
			$(this.el).fadeTo(500, '0.1', function() {
				$(view.render().el).fadeTo(500, '1');
			});
		}



	});

window.entriesListView = Backbone.View.extend({
	el: "#entriesListView",
	isLoading: false,
	wait: 15000, // ms
	scrollPosition: 0, // 0 - top



	initialize: function () {

		console.log("entriesListView init");

		// destroy scrollable element
		$('.scrollable').remove();

		// create and add new scrollable element to DOM
		var scrollable=document.createElement("DIV");
		scrollable.className="scrollable";
		var wrap = document.createElement("DIV");
		wrap.className="wrap";
		var list = document.createElement("UL");
		list.className="list";

		wrap.appendChild(list);
		scrollable.appendChild(wrap);

		$(this.el).find(".content").append(scrollable);

		// now we can init pull to refresh
		$(this.el).find('.scrollable').pullToRefresh({
			callback: function() {
				var deff = $.Deferred();

				self.prependResults(self, deff, function (deff) {
					deff.resolve();

				});


				return $.when(deff).done(function () { deff.promise(); });

			}
		});




		this.$el.find("h1.title").html(app.session.get("blogTitle"));

		this.isLoading = false;


		this.collection = new window.entriesCollection();



		var self = this;

		this.collection.fetch({reset: true}).complete(function(){

			self.render();
			self.collection.updateCids();
			self.timer = _.delay(self.prependResults, self.wait, self);
		});


		_.bindAll(this, 'checkScroll');
		$("#entriesListView .scrollable").unbind("scroll").bind("scroll", this.checkScroll);

		_.bindAll(this, 'newButtonClickHandler');
		$("#entriesListView #loadNewPosts").unbind("click").bind("click", this.newButtonClickHandler);





	},

	render: function () {
		console.log("entriesListView render");
		var that = this;

		_.each(this.collection.models, function (item) {
			that.renderItem(item,0);
		}, this);
		$("#loading").css("display", "none");
		$(".page").css("display", "none");

		this.$el.css("display", "block");

	},



	renderItem: function (item, prependFlag) {
		var itemView = new entriesListItemView({
			model: item
		});

		var rendered = itemView.render();



		if(prependFlag){
			$(rendered.el).prependTo(this.$el.find("ul")).hide().slideDown(1000);
			//	this.$el.find("ul").prepend(itemView.render().el);
		}else{
			$(rendered.el).appendTo(this.$el.find("ul")).hide().fadeIn(1000);
			//this.$el.find("ul").append(itemView.render().el);
		}

	},


	prependResults: function (that, deff, callback) {

		console.log("prependResults");

		if(!that.isLoading){

			that.isLoading = true;

			that.collection.loadDirection="new";

			that.collection.fetch({
				reset: true,
				complete: function (item) {
					if(that.collection.length){
						// check if scroll is on top

						if(that.scrollPosition - 10 < 0){
							that.prependResultsRender();
						} else {
							that.showNewButton();
						}
					}

					if(_.isFunction(callback)) callback(deff);
					that.isLoading = false;
					that.timer = _.delay(that.prependResults, that.wait, that);


				}
			});
		}else{
			if(_.isFunction(callback)) callback(deff);
		}

		return true;

	},

	prependResultsRender : function (callback) {
		_.each(this.collection.models, function (item) {
			this.renderItem(item, 1);
		}, this);
		this.collection.updateCids();
		return true;
	},


	appendResults: function () {

		if( !this.collection.listEnd){
			var that = this;

			this.isLoading = true;

			this.collection.loadDirection="more";

			this.collection.fetch({
				reset: true,
				complete: function (item) {

					_.each(that.collection.models, function (item) {
						that.renderItem(item, 0);
					}, that);

					that.collection.updateCids();
					that.isLoading = false;

				}
			});
		}

	},

	showNewButton : function () {

		var button = $(this.el).find("#loadNewPosts");
		button.find(".postsnumber").html(this.collection.length);
		button.slideDown();

	},

	newButtonClickHandler: function () {
		$(this.el).find("#loadNewPosts").slideUp();
		$("#entriesListView .scrollable").animate({ scrollTop: 0 }, "slow");
		this.prependResultsRender();


	},

	checkScroll: function () {

		var triggerPoint = 100;
		var target = $("#entriesListView .scrollable");
		var scrollY = target.scrollTop() + target.height();
		var docHeight = target.get(0).scrollHeight;


		this.scrollPosition = target.scrollTop();

		console.log(this.scrollPosition);

		if( !this.isLoading && scrollY > docHeight - triggerPoint ) {

			this.appendResults();

		}
	}




});


});