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

.controller('NewRuleCtrl', function($scope, $ionicActionSheet, Rules) {

	console.log(Rules)

	$scope.close = function() {
		$scope.modal.hide();
	}


	 /* TODO: Add a new rule  just using local storage, not this setter/getter stuff */

	$scope.save = function() {
		$scope.modal.hide();
		
		var object = { id: Rules.all().length ,	  name: 'Get Work Charger',	  event: 'Car is Near Station',	action: 'Reserve Charging Station' }
		Rules.set(object);
	}
	
   // Triggered on a button click, or some other target
    $scope.showEvents = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-ios7-location"></i> Car is Near Location' },
          { text: '<i class="icon ion-battery-low"></i> Battery Level' },
          { text: '<i class="icon ion-clock"></i>  Availability' }
	    ],
        cancelText: 'Cancel',
        cancel: function() {
             // add cancel code..
           },
        buttonClicked: function(index) {
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 2000);

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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
