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
   route: "login",

   login: function(callback){
      //route reset
      auth.route = "login";


      gap.getUser(function(user){

        var globalCallback= callback;

        if(_.isEmpty(user)){
         globalCallback();
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

              // if there is id of blog assigned - go to entriesList. Otherwise let the user select a Blog
              if(!app.session.get("blog")){
                auth.route = "blogsList";
              }else{
                auth.route = "entriesList";
              }

              globalCallback();
          });



          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("login fail");

            var globalCallback= callback;

            globalCallback();

          }
        });
      }
      catch(err){

        console.log(err);
        globalCallback();
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

  var globalCallback= callback;




  try{
    $.ajax({
      url: 'http://'+user.host+'/resources/Security/Authentication/Login.json',
      type: 'POST',
      data: req,
      dataType: "json",
      success: function(data) {

        app.session.set("userId", data.User.Id);
        app.session.set("session", data.Session);
        globalCallback();

      },
      error: function(jqXHR, textStatus, errorThrown, callback) {

       console.log("auth fail");
       globalCallback();

     }
   });
  }
  catch(err){
    console.log(err);
    globalCallback();
  }



},

logout : function(){
  gap.deleteUser(function(){
    app.session.clear();
    app.snapper.close();
    app.router.navigate("someDeadRoute");
    app.router.navigate("login", {trigger: true});
  });
}

};


window.app = {

  router : new window.Router,
  session : new window.SessionModel,
  blogsCollection : new window.blogsCollection,
  loginView : new window.LoginView,






  init : function(){




    new FastClick(document.body);



    app.snapper = new Snap({
      element: document.getElementById('content'),
      disable: 'right'
    });


    $(".toggle-left").bind('click', function(){

      app.snapper.state().state=="left" ? app.snapper.close() : app.snapper.open('left');
    });

    $("#logout_button").bind("click", auth.logout);

    gap.initialize(function() {

      auth.login(function(){
        console.log("auth callback fired");
        console.log("auth.route: "+auth.route);
        Backbone.history.start();
        app.router.navigate("someDeadRoute");

        app.router.navigate(auth.route, {trigger: true});


      });
    });

  }

}




app.init();


//document.addEventListener("deviceready", app.init, false);
});