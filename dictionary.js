angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'ui.bootstrap'])

    .directive('noScroll', function ($document) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $document.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })

    .controller('CardsCtrl', function ($scope, TDCardDelegate, CardService, $modal) {
        var fingerprint = new Fingerprint().get();

        CardService.getEmail(fingerprint)
            .success(function(data){

                //TODO: data not found or not available in session
                $modal.open({
                    templateUrl: 'popup/popup.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.ok = function (email) {
                            $modalInstance.close(email);
                        };
                    }
                }).result.then(function (result) {
                    $scope.email = result;
                    CardService.signUp(fingerprint, result)
                });

            });


        $scope.cards = []

        $scope.addCard = function () {
            CardService.getWord().success(function (data) {
                alert(data.word)
                $scope.cards.unshift(angular.extend({}, data));
            });
        }
        var init = function () {
            for (var i = 0; i <= 3; i++) {
                $scope.addCard()
            }
        }

        init()


        $scope.cardSwipedLeft = function (index) {
            console.log('LEFT SWIPE');
        };
        $scope.cardSwipedRight = function (index) {
            console.log('RIGHT SWIPE');
            console.log($scope.cards[index])
            CardService.saveWord($scope.email, $scope.cards[index])
        };

        $scope.cardDestroyed = function (index) {
            console.log('cardDestroyed');
            $scope.cards.splice(index, 1);
            $scope.addCard();
        };
    })
    .factory('CardService', ["$http", function ($http) {
        var CardService = {};
        CardService.getWord = function () {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/random',
            });
        };

        CardService.getEmail = function (deviceId) {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/getEmail?deviceId=' + deviceId,
            });
        };

        CardService.signUp = function (deviceId, email) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/signup',
                headers: {
                    'Content-Type': "content/json"
                },
                data: {
                    deviceId: deviceId,
                    emailId: email
                }
            });
        };

        CardService.saveWord = function (email, word) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/saveWord',
                headers: {
                    'Content-Type': "content/json"
                },
                data: {
                    emailId: email,
                    word: word
                }
            });
        };

        CardService.getSavedWords = function (email) {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/getSavedWords?email=' + email,
            });
        };

        return CardService;
    }]);
