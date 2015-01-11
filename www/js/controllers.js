angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $stateParams, $ionicPopup, ConfigService, Stations, Chargepoint, Mojio) {

	// Obtain the default map types from the platform object:
	var maptypes = ConfigService.platform.createDefaultLayers();    
	var mapID = document.getElementById('map');
	var current;
	markers = [];
	var options = {
		zoom: 12,
	    center: { lat: 37.774011, lng: -122.403264 }
	}

	map = new H.Map(document.getElementById('map'), maptypes.terrain.map, options);
	
  Chargepoint.getPublicStations(37.774011, -122.403264).then(function(results) {
				
		current = results[0]
		
		for (var i = 0; i < results.length; i++) {
		
			var lat = results[i].Port[0].Geo[0].Lat;
			var long = results[i].Port[0].Geo[0].Long;
			var coords = {lat: lat, lng: long};
      marker = new H.map.Marker(coords);
			markers.push(marker)

			map.addObject(marker);
		}
  });
	
				
	$scope.showMessage =  function() {
		$ionicPopup.show({
		    template: 'Your battery is low do you want to reserve the nearest charging station?',
		    title: 'Reserve Station',
		    subTitle: '(BMW Research Mt View)',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel',	
						onTap: function(e) { close() }
					},
		      {
		        text: '<b>Reserve</b>',
		        type: 'button-positive',
		        onTap: function(e) {
							// Clear the Map
							for (var i = 0; i < markers.length; i++) {
								map.removeObject(markers[i]);
							}
							
							var lat = current.Port[0].Geo[0].Lat;
							var long = current.Port[0].Geo[0].Long;
							var coords = {lat: lat, lng: long};
				      marker = new H.map.Marker(coords);
							map.setCenter(marker.getPosition())
							map.setZoom(16);
							
							map.addObject(marker);
							
							// TODO: Do the Charge Point Reservation.
		        }
		      }
		    ]
		  });
	}
	

	$scope.data = Mojio.data;
	$scope.$watch('data.findChargePoint', function(newVal, oldVal, scope) {
	  if (newVal > 0) {
	    $scope.showMessage();
    }
	  console.log('data changed! '+ newVal);
	  scope.findChargePoint = 0;
  });
  
	
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

// Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.wifi">',
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };
 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Don\'t eat that!',
     template: 'It might taste good'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
})

/* Rules Controler */
.controller('RulesCtrl', function($scope, $ionicModal, Rules, Labels) {
  $scope.rules = Rules.all();
	$scope.labels = Labels;
	
	console.log($scope.labels)
	
	$ionicModal.fromTemplateUrl('templates/newRule.html', function(modal) {
    	$scope.settingsModal = modal;
	});
	
  $scope.close = function() {
	  $scope.modal.hide();
  };

	$scope.newRule = function() {
		$scope.settingsModal.show();
	};
})

.controller('RuleDetailCtrl', function($scope, $stateParams, Rules) {
  $scope.rule = Rules.get($stateParams.ruleId);
})

.controller('NewRuleCtrl', function($scope, $ionicActionSheet, Rules, Stations, Labels) {

	/* Store and Rest the form */
  $scope.master = {};

  $scope.update = function(rule) {
    $scope.master = angular.copy(rule);
  };

  $scope.reset = function() {
    $scope.rule = angular.copy($scope.master);
  };

  $scope.reset();
	$scope.rule = { trigger : { name : 'choose', label : 'Event' }, action : { name : 'choose', label : 'Action'} };	
	
	/* Just show that a label shows before the type is choosen */
	//$scope.trigger = "Event";
	//$scope.action = "Action";
	
	$scope.stations = Stations.all();
	$scope.labels = Labels;
	
	$scope.close = function() {
		$scope.modal.hide();
	}

  $scope.triggerTemplate = function() {
    return 'templates/triggers/'+ $scope.rule.trigger.name +'.html';  
  };
	
  $scope.actionsTemplate = function() {
    return 'templates/actions/'+ $scope.rule.action.name +'.html';  
  };
	

	/* TODO: Add a new rule  just using local storage, not this setter/getter stuff */

	$scope.save = function() {
		$scope.modal.hide();
		
		/* TODO: Save current form to Local Storage */
		Rules.set($scope.rule);
	}
	
  // Triggered on a button click, or some other target
  $scope.showTriggers = function() {
		var labels = 	$scope.labels;
    var triggerButtons = [];
				
		for (x in labels.triggers) {
			var item = { text: '<i class="icon event-icon ' + labels.triggers[x].icon + '"></i> ' + labels.triggers[x].name, name: x }
			triggerButtons.push(item);
		}
	
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: triggerButtons,
      cancelText: 'Cancel',
      cancel: function() {
           // add cancel code..
      },
      buttonClicked: function(index) {
				var which = triggerButtons[index].name
      	$scope.rule.trigger.name = which;
				$scope.rule.trigger.label = labels.triggers[which].name;
				$scope.triggerLogo = labels.triggers[which].icon;
				
        return true;
      }
    });
  };
	
  $scope.showActions = function() {
		var labels = 	$scope.labels;
		var actionButtons = [];
		
		for (x in labels.actions) {
			var item = { text: '<i class="icon action-icon ' + labels.actions[x].icon + '"></i> ' + labels.actions[x].name, name: x }
			actionButtons.push(item);
		}
			
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: actionButtons,
      cancelText: 'Cancel',
      cancel: function() {
           // add cancel code..
      },
      buttonClicked: function(index) {
				var which = actionButtons[index].name
				
      	$scope.rule.action.name = which;
				$scope.rule.action.label = labels.actions[which].name;
				$scope.actionLogo = labels.actions[which].icon;

        return true;
      }
    });
  };
	
  
})

.controller('StationsCtrl', function($scope, Stations, Chargepoint) {
	$scope.stations = Stations.all();
  
  Chargepoint.getPublicStations(37.380644,-122.07419).then(function(results) {
    console.log(results);
  });
})

.controller('StationDetailCtrl', function($scope, $stateParams, Stations, ConfigService) {
	$scope.station = Stations.get($stateParams.stationId);
	
	// Obtain the default map types from the platform object:
	var maptypes = ConfigService.platform.createDefaultLayers();    
	var mapID = document.getElementById('map');
	var options = {
		zoom: 15,
	    center: { lng: $scope.station.coords[1], lat: $scope.station.coords[0] }
	}

	map = new H.Map(document.getElementById('detail-map'), maptypes.terrain.map, options);	
	
})

.controller('AccountCtrl', function($scope, Mojio, ConfigService) {
  console.log(Mojio.username());
  $scope.username = Mojio.username() || '';
  $scope.password = Mojio.password() || '';

  $scope.login = function() {
    Mojio.login(this.username, this.password);
  };
});
