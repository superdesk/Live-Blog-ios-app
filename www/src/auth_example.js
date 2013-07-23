
var req = { userName: "Janet"  };
var username="Janet";
var password="a";
var session;

$.ajax({
    url: 'http://mobile.sd-demo.sourcefabric.org/resources/Security/Authentication.json',
    type: 'POST',
    data: req,
    dataType: "json",
    success: function(data) {

        console.log(data.Token);
        login(data.Token);



    }
});


function login(token){

var username="Janet";
var password="a";

    shaPassword = new jsSHA(password, "ASCII"),
    shaStep1 = new jsSHA(shaPassword.getHash("SHA-512", "HEX"), "ASCII"),
    shaStep2 = new jsSHA(token, "ASCII"),
    hash = shaStep1.getHMAC(username, "ASCII", "SHA-512", "HEX");
    hash = shaStep2.getHMAC(hash, "ASCII", "SHA-512", "HEX");

    var req = { Token: token, HashedToken: hash , UserName: username };




    $.ajax({
        url: 'http://mobile.sd-demo.sourcefabric.org/resources/Security/Authentication/Login.json',
        type: 'POST',
        data: req,
        dataType: "json",
        success: function(data) {
            console.log(JSON.stringify(data));
            session=data.Session;
            blogList();
        }
    });

}

function blogList(){



    var req = { Authorization: session};




    $.ajax({
        url: 'http://mobile.sd-demo.sourcefabric.org/resources/LiveDesk/Blog/1/Post/Published.json',
        type: 'GET',
        headers: req,
        dataType: "json",
        success: function(data) {
            console.log(JSON.stringify(data));

        }
    });
}