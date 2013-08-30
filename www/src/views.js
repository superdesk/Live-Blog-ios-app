$(function() {

	// left menu

	window.menuBlogsListItemView = Backbone.View.extend({
		template: $("#menuBlogItem_template").html(),
		model: BlogItemModel,
		tagName: "li",

		render: function () {

			this.JSONmodel = this.model.toJSON();
			var tmpl = _.template(this.template);



			$(this.el).html(tmpl(this.JSONmodel));
			return this;
		},
		events: {
			"click a":    "blogItemClick"
		},

		blogItemClick: function(){



			app.session.set("blog", this.JSONmodel.Id);
			app.session.set("blogTitle", this.JSONmodel.Title);

			app.router.navigate("someDeadRoute");
			app.router.navigate("entriesList", {trigger: true});
			app.snapper.close();
		},


	});

	window.menuBlogsListView = Backbone.View.extend({
		el: $("#menuBlogsListView"),

		initialize: function () {

			console.log("blogListView init");


			this.collection = app.blogsCollection;
			this.listenTo(this.collection, 'add', this.renderMenu);

			var self = this;


		},

		renderMenu: function () {
			console.log("menublogsListView render");
			var that = this;
			this.$el.empty();
			_.each(this.collection.models, function (item) {
				that.renderBlogItem(item);
			}, this);

		},



		renderBlogItem: function (item) {
			var menuBlogItemView = new menuBlogsListItemView({
				model: item
			});

			this.$el.append(menuBlogItemView.render().el);
		}
	});

	///////////////////


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

			app.router.navigate("entriesList", {trigger: true});
		},


	});

	window.blogsListView = Backbone.View.extend({
		el: $("#blogsListView"),

		initialize: function () {

			console.log("blogListView init");


			this.collection = app.blogsCollection;
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

		twitter: {
			link: {
				anchor: function(str)
				{
					return str.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(m)
					{
						m = m.link(m);
						m = m.replace('href="','target="_blank" href="');
						return m;
					});
				},
				user: function(str)
				{
					return str.replace(/[@]+[A-Za-z0-9-_]+/g, function(us)
					{
						var username = us.replace("@","");

						us = us.link("http://twitter.com/"+username);
						us = us.replace('href="','target="_blank" onclick="loadProfile(\''+username+'\');return(false);"  href="');
						return us;
					});
				},
				tag: function(str)
				{
					return str.replace(/[#]+[A-Za-z0-9-_]+/g, function(t)
					{
						var tag = t.replace(" #"," %23");
						t = t.link("http://summize.com/search?q="+tag);
						t = t.replace('href="','target="_blank" href="');
						return t;
					});
				},
				all: function(str)
				{
					str = this.anchor(str);
					str = this.user(str);
					str = this.tag(str);
					return str;
				}
			}
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
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					var user = '<figure class="authorImage"><img src="'+meta.user.profile_image_url+'" alt="Gravatar" /></figure>'+
					'<p class="attributes profile">'+meta.user.name+' ('+meta.user.screen_name+')'+
					'   <time>'+meta.created_at+'</time></p>';

					var text = '<p>'+this.twitter.link.all(this.model.get('Content'))+'</p>';

					var content = '<div class="service_content ">'+user+text+'</div>';
					this.model.set('Content', content);


				} else if (this.model.get('AuthorName') == 'facebook') {
					var meta = jQuery.parseJSON(this.model.get('Meta'));

					var user = '<figure class="authorImage"><img src="http://graph.facebook.com/'+meta.from.id+'/picture" alt="Gravatar" /></figure>'+
					'<p class="attributes profile">'+meta.from.name+
					'   <time>'+meta.formated_time+'</time></p>';

					var text = '<p>'+this.model.get('Content')+'</p>';

					var content = '<div class="service_content ">'+user+text+'</div>';
					this.model.set('Content', content);


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
		}


	});

window.entriesListView = Backbone.View.extend({
	el: "#entriesListView",
	isLoading: true,
	wait: 15000, // ms
	scrollPosition: 0, // 0 - top



	initialize: function () {

		console.log("##### entriesListView init");
		this.showLoadingIndicator();

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

		$(this.el).find("#entriesListContent").prepend(scrollable);

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




		this.collection = new window.entriesCollection();


		var self = this;

		this.collection.fetch({reset: true}).complete(function(){
			self.collection.updateCids();

			self.renderView();

			self.isLoading = false;
			self.timer = _.delay(self.prependResults, self.wait, self);
			self.hideLoadingIndicator();
		});




		_.bindAll(this, 'checkScroll');
		// allow checkScroll function to be fired not often than every 150ms
		var throttledCheckScroll = _.throttle(this.checkScroll, 150);
		$("#entriesListView .scrollable").unbind("scroll").bind("scroll", throttledCheckScroll);

		_.bindAll(this, 'newButtonClickHandler');
		$("#entriesListView #loadNewPosts").unbind("click").bind("click", this.newButtonClickHandler);





	},

	updateAnchorClickEvent : function () {

		$("#entriesListView .list a").unbind("click").bind("click", function(e){

			e.preventDefault();
			var url = $(e.target).attr('href');

			window.open(url, '_system');




		});
	},

	renderView: function () {
		console.log("entriesListView render");
		var that = this;

		_.each(this.collection.models, function (item) {
			that.renderItem(item,0);
		}, this);
		this.updateAnchorClickEvent();
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


				},
				error : function () {
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

		this.updateAnchorClickEvent();
		this.collection.updateCids();
		return true;
	},


	appendResults: function () {

		if( !this.collection.listEnd){
			var that = this;

			this.isLoading = true;
			this.showLoadingIndicator();
			this.collection.loadDirection="more";

			this.collection.fetch({
				reset: true,
				complete: function (item) {

					_.each(that.collection.models, function (item) {
						that.renderItem(item, 0);
					}, that);

					that.updateAnchorClickEvent();
					that.collection.updateCids();
					that.hideLoadingIndicator();
					that.isLoading = false;

				},
				error : function () {
					that.hideLoadingIndicator();
					that.isLoading = false;

				}
			});
		}

	},

	// shows loading indicator on appendResults
	showLoadingIndicator : function (){
		$(this.el).find("#appendLoadingIndicator").fadeIn();
	},

	hideLoadingIndicator : function () {
		$(this.el).find("#appendLoadingIndicator").fadeOut();
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



		if( !this.isLoading && scrollY > docHeight - triggerPoint ) {

			this.appendResults();

		}
	}




});


window.newPostView = Backbone.View.extend({
	el: "#newPost",


	initialize : function () {

		this.collection = new window.postTypesCollection();


		var that = this;



		_.bindAll(this, 'selectHandler');
		this.$el.find("#postTypeSelect").unbind("change").bind("change", this.selectHandler);

		_.bindAll(this, 'submitHandler');
		this.$el.find("#newPostForm").unbind("submit").bind("submit", this.submitHandler);

		_.bindAll(this, 'submitForm');


	},

	renderType : function (item) {
		var typeOption = '<option class="rendered" value="'+item.get('Type').Key+'" data-content="'+escape(item.get('Content'))+'">'+item.get('Name')+'</option>';
		this.$el.find("#postTypeSelect").append(typeOption);

	},

	render: function () {
		console.log("postTypeRender");
		//clear list of post types
		$(this.el).find("#postTypeSelect .rendered").remove();

		var that = this;
		this.collection.fetch({reset: true}).complete(function(){


			_.each(that.collection.models, function (item) {
				that.renderType(item);
			}, that);



		});

		return this;
	},

	selectHandler : function (e) {
		var content = unescape($(e.target).find('option:selected').data('content'));
		console.log(content);
		if( content != 'undefined'){
			this.$el.find("#postMessage").val(content);
		}

	},

	submitHandler : function (e) {
		e.preventDefault();
		this.submitForm();

	},

	showLoading : function () {
		var button = $(this.el).find("#newPostForm button");
		button.html("");
		button.addClass("loading");

	},

	hideLoading : function () {

		var button = $(this.el).find("#newPostForm button");
		button.html("Create Post");
		button.removeClass("loading");

	},

	clearForm : function () {
		this.$el.find("#postMessage").val("");
		return true;
	},

	submitForm : function () {
		var type = this.$el.find("#postTypeSelect").val();
		var message = this.$el.find("#postMessage").val();

		if(message.length < 3){
			app.alert("Please write a message");
			return false;
		}

		var req = { Meta : { }, Content: message, Type: type, Creator: app.session.get("userId") };
		this.showLoading();
		var that = this;
		try{
			$.ajax({
				url: 'http://'+app.session.get("host")+'/resources/my/LiveDesk/Blog/'+app.session.get("blog")+'/Post.json',
				type: 'POST',
				data: req,
				dataType: "json",
				beforeSend : function(xhr) {

				     // set header
				     xhr.setRequestHeader("Authorization", app.session.get("session"));
				 },

				 success: function(data) {
				 	that.hideLoading();
				 	that.clearForm();


				 	console.log("submit success");

				 },
				 error: function(jqXHR, textStatus, errorThrown, callback) {
				 	that.hideLoading();
				 	app.alert("Something went wrong. Try again");
				 	console.log("submit fail");
				 }
				});
		}
		catch(err){
			console.log(err);
			app.alert("Something went wrong. Try again");
			this.hideLoading();
		}

	}


});


});


