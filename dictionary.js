angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'ui.bootstrap', 'ngStorage'])

    .run(function($rootScope, $q, CardService){
        $rootScope.cards = []
        CardService.getWords().success(function (data) {
            $rootScope.cards = data
            $rootScope.$emit('jack');
        });
    })

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

    .controller('CardsCtrl', function ($rootScope, $scope, TDCardDelegate, CardService, $modal, $sessionStorage) {
        var fingerprint = new Fingerprint().get();

        $scope.email = $sessionStorage.email;
        if(!$scope.email){
            CardService.getEmail(fingerprint)
                .success(function(data){
                    if(data.length > 0 ){
                        $scope.email = data[0].email;
                        $sessionStorage.email = data[0].email;
                    }
                    else{
                        $modal.open({
                            templateUrl: 'popup/popup.html',
                            controller: function ($scope, $modalInstance) {
                                $scope.ok = function (email) {
                                    $modalInstance.close(email);
                                };
                            }
                        }).result.then(function (result) {
                            $scope.email = result;
                            $sessionStorage.email = $scope.email;
                            CardService.signUp(fingerprint, result)
                                .success(function(signUpRes){
                                    console.log(signUpRes)
                                })
                        });
                    }

                })
        }


        var unbindHandler = $rootScope.$on('jack', function () {
            $scope.cards = $rootScope.cards
            unbindHandler();
        });

        $scope.loadSavedWords = function () {
            document.getElementById("rightSideNav").style.width = "100%";
            document.getElementById("rightSideNav").style.display = "block";
            CardService.getSavedWords($scope.email)
                .success(function(res){
                    $scope.savedWords = res.words
                })
        }


        $scope.addCard = function () {
            CardService.getWord().success(function (data) {
                $scope.cards.unshift(angular.extend({}, data));
            });
        }

        $scope.cardSwipedLeft = function (index) {
            console.log('LEFT SWIPE');
        };
        $scope.cardSwipedRight = function (index) {
            CardService.saveWord($scope.email, $scope.cards[index])
                .success(function(signUpRes){
                    console.log(signUpRes)
                })
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

        CardService.getWords = function () {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/randomWords',
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
                data: {
                    _id: deviceId+"",
                    email: email
                }
            });
        };

        CardService.saveWord = function (email, word) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/saveWord',
                data: {
                    email: email,
                    word: [word]
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
