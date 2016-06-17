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

        $scope.cards = []

        $scope.addCard = function() {
            CardService.getWord().success(function (data) {
                $scope.cards.unshift(data);
            });
        }

        var init = function(){
            for(var i=0;i<=3;i++)
            {
                $scope.addCard();
            }
        }

        init()

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };


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

        return CardService;
    }]);
