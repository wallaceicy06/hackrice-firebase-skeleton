$(document).ready(function() {
  var ENTER_KEY = 13;
  var base = new Firebase("https://hackrice2015-sharger.firebaseio.com"); 
  var tblMessages = base.child("messages");

  var messageTemplate = _.template("<div><em><%= name %></em>:<%= text %></div>");
  var currentUser = {"id": "guest", "name": "Guest", "profileImageUrl": "placeholder.jpg"};

  function displayChatMessage(name, text) {
    $('#messagesDiv').append(messageTemplate({"name": name, "text": text}));
  };

  function setUser(id, name, photoUrl) {
    currentUser = {"id": id, "name": name, "photoUrl": photoUrl}

    $('.userImage').attr({src: photoUrl});
  }

  function login() {
    base.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("There was an error logging you in.");
      } else {
        setUser(
            authData['google']['id'],
            authData['google']['displayName'],
            authData['google']['profileImageURL']);
      }
    }); 
  }

  function sendMessage(name, text) {
    tblMessages.push({"name": name, "text": text})
  }

  function setupViewHandlers() {
    $('#messageInput').keypress(function(e) {
      if (e.keyCode == ENTER_KEY) {
        var text = $('#messageInput').val(); 
        sendMessage(currentUser['name'], text);
        $('#messageInput').val('');
      }
    });

    $('#loginButton').click(function(e) {
      login();
    }); 
  }

  function setupServerHandlers() {
    tblMessages.on('child_added', function(snapshot) {
      var message = snapshot.val();

      displayChatMessage(message.name, message.text);
    });
  }

  function init() {
    setupViewHandlers();
    setupServerHandlers();
  }

  init();
})
