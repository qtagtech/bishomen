var bishomen = angular.module('bishomen', ['ui.router','bishomen.controllers','bishomen.directives'])
.value('ParseConfiguration', {
        applicationId: "",
        javascriptKey: ""
    })
.factory('StateData', function () {

    var data = {
        state: 'open.gallery'
    };

    return {
        getState: function () {
            return data.state;
        },
        setState: function (_state) {
            data.state = _state;
        }
    };
})


    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'MainCtrl',
                resolve: {
                    user: function (UserService) {
                        var value = UserService.init();
                        return value;
                    }
                }
            })
            .state('open', {
                url: '/open',
                abstract: true,
                templateUrl: 'templates/open.html',
                controller: 'MainCtrl',
                /*resolve: {
                    user: function (UserService) {
                        var value = UserService.init();
                        return value;
                    }
                }*/
            })






            .state('open.homepage', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: 'templates/page/home.html',
                        controller: 'HomeCtrl'
                    },
                    'fabContent': {
                        /*template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-balanced-900 drop"><i class="icon ion-android-cart"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-gallery').classList.toggle('on');
                            }, 600);
                        }*/
                    }
                }
            })




        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/open/home');
    })
    .run(function ($rootScope, $state,StateData) {

        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                if(error != 'undefined' && null != error && null !== error){ //it means it is accessing a protected page, otherwise it's unproteceted and error would not exist
                    //every time it loads a state, that depends on app, it checks for the variable error and depending on that acts
                    var errorMsg = error && (error.debug || error.message || error);
                    console.log('$stateChangeError ' + errorMsg);

                    // if the error is "noUser" the go to login state
                    if (error && error.error === "noUser") {
                        StateData.setState(toState.name);
                        $state.go('open.signup',{});
                    }
                }



            });
    })
;