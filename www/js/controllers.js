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
