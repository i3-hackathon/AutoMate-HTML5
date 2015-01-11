angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

/* TODO: Remove */
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

/* Rules Controler */
.controller('RulesCtrl', function($scope, $ionicModal, Rules) {
  $scope.rules = Rules.all();
  
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

.controller('NewRuleCtrl', function($scope, $ionicActionSheet, Rules, Stations) {

	$scope.triggerName = 'choose';
	$scope.batteryLevel = 80;
	$scope.event = "Event"
	
    $scope.stations = Stations.all();
	
	console.log($scope.stations)
	
	
	$scope.close = function() {
		$scope.modal.hide();
	}

  $scope.triggerTemplate = function() {
    return 'templates/triggers/'+$scope.triggerName+'.html';  
  };


	 /* TODO: Add a new rule  just using local storage, not this setter/getter stuff */

	$scope.save = function() {
		$scope.modal.hide();
		
		var object = { id: Rules.all().length ,	  name: 'Get Work Charger',	  event: 'Car is Near Station',	action: 'Reserve Charging Station' }
		Rules.set(object);
	}
	
  // Triggered on a button click, or some other target
  $scope.showTriggers = function() {
    //TODO: possibly put this in $scope
	var labels = {
	  'near-location' : 'Car is Near Location',
	  'battery-level' : 'Battery Level',
	  'availability': 	'Station Availability'
	}
	var icons = {
	  'near-location' : 'ion-ios7-location',
	  'battery-level' : 'ion-battery-low',
	  'availability': 	'ion-clock'
	}
	  
    var triggerButtons = [
        { text: '<i class="icon ' + icons['near-location'] + '"></i> ' + labels['near-location'], name: 'near-location' },
        { text: '<i class="icon ' + icons['battery-level'] + '"></i> ' + labels['battery-level'], name:'battery-level' },
        { text: '<i class="icon ' + icons['availability'] + '"></i> ' + labels['availability'], name:'availability'}
    ];
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: triggerButtons,
      cancelText: 'Cancel',
      cancel: function() {
           // add cancel code..
         },
      buttonClicked: function(index) {
        $scope.triggerName = triggerButtons[index].name;
		$scope.event = labels[triggerButtons[index].name];
		
        return true;
      }
    });

  };
  
})

.controller('StationsCtrl', function($scope, Stations) {
	$scope.stations = Stations.all();
})

.controller('StationDetailCtrl', function($scope, $stateParams, Stations, ConfigService) {
	$scope.station = Stations.get($stateParams.stationId);
	
	console.log("staiton: ", $scope.station.coords)
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
