$(function() {



    window.blogsCollection = Backbone.Collection.extend({
        model: BlogItemModel,
        url: function() {

            return 'http://'+app.session.get("host")+'/resources/HR/User/'+app.session.get("userId")+'/Blog/Live.json?X-Filter=Id,Title, Description';
          },
          parse: function(response) {
                  console.log('parsing ...');
                  console.log(JSON.stringify(response.BlogList));
                  return response.BlogList;
              }
    });

    window.entriesCollection = Backbone.Collection.extend({
        model: EntryItemModel,
        url: function() {
            console.log('http://'+app.session.get("host")+'/resources/LiveDesk/Blog/'+app.session.get("blog")+'/Post/Published.json?x-filter=*');
            return 'http://'+app.session.get("host")+'/resources/LiveDesk/Blog/'+app.session.get("blog")+'/Post/Published.json?x-filter=*';
          },
          parse: function(response) {
                  console.log('parsing ...');
                  console.log(JSON.stringify(response.PostList));
                  return response.PostList;
              }
    });

});

