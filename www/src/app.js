$(function() {

  window.gap =  {



   initialize: function(callback) {

     var self = this;

     this.db = window.openDatabase("mobileliveblog", "1.0", "mobileliveblog", 2 * 1024 * 1024);


     this.db.transaction(

       function(tx) {
         tx.executeSql(
           "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",

           this.txErrorHandler,

           function(tx, results) {
             if (results.rows.length != 1) {

               self.createTables();
             }
           }
           );
       }
       );

     callback();

   },

   createTables: function() {
     this.db.transaction(
       function(tx) {

         tx.executeSql('CREATE TABLE IF NOT EXISTS user(login VARCHAR(250), pass VARCHAR(500), host VARCHAR(1000))');

       },

       this.txErrorHandler
       );
   },


   getUser: function(callback) {



     this.db.transaction(
       function(tx) {
         var sql = "SELECT * FROM user LIMIT 1";


         tx.executeSql(sql, this.txErrorHandler,
           function(tx, results) {
            results.rows.length>0 ? user = results.rows.item(0) : user = {};

            callback(user);
          }
          );
       }
       );

   },

   addUser: function(login, pass, host) {
     this.db.transaction(
       function(tx) {
         var sql = "DELETE FROM user";


         tx.executeSql(sql);

       },
       this.txErrorHandler
       );

     this.db.transaction(
       function(tx) {
        var hash = new jsSHA(pass, "ASCII");
        var hashedPass = hash.getHash("SHA-512", "HEX");

        var sql = 'INSERT INTO user(login, pass, host) VALUES("'+login+'", "'+hashedPass+'", "'+host+'")';

        tx.executeSql(sql);
      },
      this.txErrorHandler
      );

   },




   deleteUser: function(callback) {


     this.db.transaction(
       function(tx) {
         var sql = 'DELETE FROM user';

         tx.executeSql(sql,
           this.txErrorHandler,

           function(tx, results) {
             callback();
           });
       },
       this.txErrorHandler
       );

   },




   txErrorHandler: function(tx) {
     alert("There was an error. Please try again");
   }
 };



 window.auth = {

   login: function(callback){

     gap.getUser(function(user){

      if(_.isEmpty(user)){
        app.router.navigate("someDeadRoute");
        app.router.navigate("login", {trigger: true});
        return false;
      }



      var req = { userName: user.login  };

      try{
        $.ajax({
          url: 'http://'+user.host+'/resources/Security/Authentication.json',
          type: 'POST',
          data: req,
          dataType: "json",
          success: function(data) {


            app.session.set("token", data.Token);
            app.session.set("host", user.host);
            auth.authorize(user, function(){
              console.log("authorization complete");
              // if there is id of blog assigned - do nothing, it means that application was "paused". Otherwise let the user select a Blog
              if(app.session.get("blog") === 0) app.router.navigate("blogsList", {trigger: true});


            });



          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("login fail");
            app.router.navigate("someDeadRoute");
            app.router.navigate("login", {trigger: true});


          }
        });
      }
      catch(err){

        app.router.navigate("someDeadRoute");
        app.router.navigate("login", {trigger: true});
      }

    });

},

authorize: function(user, callback){

  var token = app.session.get("token");

  shaPassword = user.pass;
  shaStep1 = new jsSHA(shaPassword, "ASCII");
  shaStep2 = new jsSHA(token, "ASCII");
  hash = shaStep1.getHMAC(user.login, "ASCII", "SHA-512", "HEX");
  hash = shaStep2.getHMAC(hash, "ASCII", "SHA-512", "HEX");

  var req = { Token: token, HashedToken: hash , UserName: user.login };



  try{
    $.ajax({
      url: 'http://'+user.host+'/resources/Security/Authentication/Login.json',
      type: 'POST',
      data: req,
      dataType: "json",
      success: function(data) {

        app.session.set("userId", data.User.Id);
        app.session.set("session", data.Session);
        callback();

      },
      error: function(jqXHR, textStatus, errorThrown) {

        app.router.navigate("someDeadRoute");
        app.router.navigate("login", {trigger: true});

      }
    });
  }
  catch(err){
    app.router.navigate("someDeadRoute");
    app.router.navigate("login", {trigger: true});
  }

},

logout : function(){
  gap.deleteUser(function(){
    session.clear();
  });
}

};


window.app = {

  router : new window.Router,
  session : new window.SessionModel,

  loginView : new window.LoginView,
  listView : new window.ListView,

  blogsListView : new window.blogsListView,



  init : function(){



    new FastClick(document.body);


    snapper = new Snap({
      element: document.getElementById('content'),
      disable: 'right'
    });


    $(".toggle-left").bind('click', function(){
      snapper.state().state=="left" ? snapper.close() : snapper.open('left');
    });

    gap.initialize(function() {
      auth.login();
    });

  }

}




app.init();


});