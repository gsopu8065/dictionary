angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])

    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    })

    .controller('CardsCtrl', function($scope, TDCardDelegate, CardService) {
        console.log('CARDS CTRL');

        CardService.getWords().success(function (data) {
            console.log(data)
            $scope.cards = data
        });

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            CardService.getWord().success(function (data) {
                $scope.cards.unshift(data);
            });
        }

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            //$scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            //$scope.addCard();
        };

        $scope.cardDestroyed = function(index) {
            console.log('cardDestroyed');
            $scope.addCard();
        };
    })
    .controller('CardCtrl', function($scope, TDCardDelegate) {
        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            $scope.addCard();
        };
    })

    .factory('CardService', ["$http", function($http) {
        var CardService = {};
        CardService.getWord = function(){
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/random',
            });
        };
        CardService.getWords = function(){
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/randomWords',
            });
        };
        return CardService;
    }]);
