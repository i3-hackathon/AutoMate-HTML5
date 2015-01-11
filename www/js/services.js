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
