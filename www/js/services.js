angular.module('starter.services', [])

.factory('ConfigService', function() {

	var configs = {
			platform : new H.service.Platform({
				'app_id': 'pWzT1cYjvJrV8Fyqc4SJ',
				'app_code': 'oCAePpgSoO6_Ny1VvB4f0Q'
			})
	}

	return configs;
			
	
})

.factory('Mojio', function(ConfigService) {
  console.log('Mojio');
  console.log(BMWClient);
  var BMWClient = window.BMWClient;
  var portNumber = window.location.protocol == "https:" ? 443 : 80;
  var theScheme = window.location.protocol == "https:" ? 'https' : 'http';

  var config = {
      application: 'c6aefa95-6f1e-4355-8f70-e497d8a56143',
      secret: '8ec6a53a-b1da-4a78-aba4-265016716ea7',
      hostname: 'data.api.hackthedrive.com',
      port: portNumber,
      scheme: theScheme,
      version: 'v1'
  };

  var bmw_client = new BMWClient(config);
  var Observer = bmw_client.model('Observer');
  var Vehicle = bmw_client.model('Vehicle');
  var App = bmw_client.model('App');

  var login = function mojioLogin(callback) {
    bmw_client.login(localStorage.mojioUsername, localStorage.mojioPassword, function(err, res) {
      if (err)
        console.log("Login error");
      else 
        console.log("Login success");
      if (callback) {
        return callback();
      }
    });
  };

  if (localStorage.getItem('mojioPassword') && localStorage.getItem('mojioUsername')) {
    login(function() {
      bmw_client.get(Vehicle, {}, function(err, vehicles) {
        if (err)
          return console.log(err);
        //var vehicle = new Vehicle(vehicles.Data[0]);
        var vehicle = vehicles.Objects[0];
        bmw_client.observe(vehicle, null, function(entity) {
          console.log(entity);
        }, function(err, res) {
          if (err) {
            console.log('observe connection error');
            console.log(err);
          } else {
            console.log('observe connection established');
          }
        });
      });
    });
  }

  return {
    username: function() {
      return localStorage.getItem('mojioUsername');
    },
    password: function() {
      return localStorage.getItem('mojioPassword');
    },
    login: function(username, password) {
      localStorage.setItem('mojioUsername', username);
      localStorage.setItem('mojioPassword', password);
      login();
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})


/**
 * A simple example service that returns some data.
 */
.factory('Rules', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var rules = [{
	  id: 0,
	  name: 'Find Station',
	  event: 'Battery Level',
	  action: 'Find Nearest Station'
  }];


  return {
    all: function() {
      return rules;
    },
    get: function(ruleId) {
      // Simple index lookup
      return rules[ruleId];
    },
	set: function(rule) {
		rules.push(rule);
		return;
	}
  }
})

.factory('Stations', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var stations = [{
	  id: 0,
	  name: 'BMW Research Mt View',
	  price: 'Free',
	  details: 'LD, J1772 6.60 kw',
	  address: '160 E. El Camino Real, Mountain View, CA 94040',
	  coords: [37.380644, -122.074190]
  }];


  return {
    all: function() {
      return stations;
    },
    get: function(stationId) {
      // Simple index lookup
      return stations[stationId];
    },
	set: function(station) {
		statios.push(station);
		return;
	}
  }
});
