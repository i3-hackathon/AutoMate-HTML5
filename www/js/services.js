var URL = 'http://web-01.roadrules.io:8080';

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

.factory('Labels', function() {
	
	var labels = {
		triggers: {
			'near-location' : {
				name: 'Car is Near Location',
				icon: 'ion-ios7-location'
			},
			'battery-level' : {
				name: 'Battery Level',
				icon: 'ion-battery-low'
			},
			'availability' : {
				name: 'Station Availability',
				icon: 'ion-clock'
			}			
		},
		actions : {
	 	  'send-message' : 	{
		 	  name : 'Send Message',
		 		icon : 'ion-email'
		 	},
		 		'reserve-station' : {
		 		name: 'Reserve Station',
		 		icon: 'ion-ios7-calendar'
		 	},
		 		'send-glypse' : {
		 		name: 'Send Glympse',
		 		icon: 'ion-navigate'
		 	},
		 	  'stop-charging': {
		 	  name: 'Stop Charging',
		 		icon: 'ion-ios7-close'
		 	},
		 		'flash-lights': {
		 		name: 'Flash Hue Lights',
		 		icon: 'ion-ios7-lightbulb'
		 	} 		
		}
	}

	return labels;			
	
})

.factory('Mojio', function(ConfigService, PubNub) {
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

  var observeVehicle = function() {
    bmw_client.get(Vehicle, {}, function(err, vehicles) {
      if (err) {
        return console.log(err);
      }

      //var vehicle = new Vehicle(vehicles.Data[0]);
      var vehicle = vehicles.Objects[0];

      // observation
      bmw_client.observe(vehicle, null, function(entity) {
        //event callback
        console.log(entity);
        PubNub.publish('battery_level', entity.LastBatteryLevel);
      }, function(err, res) {
        //connection callback
        if (err) {
          console.log('observe vehicle connection error');
          console.log(err);
        } else {
          console.log('observe vehicle connection established');
        }
      });
    });
  };

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
      observeVehicle();
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
      login(function() {
        observeVehicle(); 
      });
    }
  };
})

.service('PubNub', function() {
  var pubnub = PUBNUB.init({
    publish_key: 'pub-c-7c88a9b8-5323-4d53-8256-8cd931d155d2',
    subscribe_key: 'sub-c-4248af1a-999f-11e4-91be-02ee2ddab7fe'
  });
  console.log(pubnub);
  return {
    publish: function(channel, message) {
      pubnub.publish({
        channel:channel, 
        message:message
      });
    }
  };
})

.service('Chargepoint', function($q, $http) {
  return {
    getPublicStations: function(lat, lon) {
      var deferred = $q.defer();

      $http.post(
        URL + '/chargepoint/getPublicStations',
        {lat: lat, lon: lon}
      ).success(function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  };
})

.service('SMS', function($q, $http) {
  return {
    sendSMS: function(to, message) {
      var deferred = $q.defer();

      $http.post(
        URL + '/sms',
        {to: to, message: message}
      ).success(function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  };

})

/**
 * A simple example service that returns some data.
 */
.factory('Rules', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var rules = [
		{ id : 0, "trigger" : { "name" : "near-location", "label" : "Car is Near Location", "options" : { "location" :  "Palo Alto" } }, "action": { "name" : "reserve-station", "label" : "Reserve Station" , "reserve" : { "id" : 0, "name" : "BMW Research Mt View", "price" : "Free" , "details" : "LD, J1772 6.60 kw","address":"160 E. El Camino Real, Mountain View, CA 94040","coords":[37.380644,-122.07419] }}},
		{ id : 1, "trigger": { "name" : "battery-level", "label" :"Battery Level", "options": { "level" : "82", "above" : "is Above" }},"action":{"name":"stop-charging","label": "Stop Charging", "options" : { "when" : "Now" }}}
  ];		 		

  return {
    all: function() {
      return rules;
    },
    get: function(ruleId) {
      // Simple index lookup
      return rules[ruleId];
    },
		set: function(rule) {
			console.log("new rule", rule)
			console.log(JSON.stringify(rule))
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
