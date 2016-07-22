'use strict';

angular.module('app.message', [])
    .controller('MessageController', ['$scope', 'ActivityManager', 'MessageService', 'COMMON_KEYS', function ($scope, ActivityManager, MessageService, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = MessageService.getTitle().title;
            if (MessageService.getMessage() == undefined) {
                MessageService.initialize().success(function (data) {
                    //bindBill();
                })
            } else {
                //bindBill();
            }
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });

    }])
    .service('MessageService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var messages,
            messageUrl = ResourceManager.getConfigurations().messageUrl(),
            configUrl,
            data = JSON.stringify({
                roomid: ResourceManager.getConfigurations().roomNum()
            });

        this.initialize = function() {
            var deferred = $q.defer();

            // cached configurations
            if (messageUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.post(messageUrl, data).success(function (configJSON) {
                configUrl = messageUrl;
                var maxVer = configJSON.messages[0];
                configJSON.messages.forEach(function(el, idx, arr) {
                    if (maxVer.versionid < el.versionid) {
                        maxVer = el;
                    }
                })
                messages = maxVer;
            })

        }

        this.getMessage = function() {
            return messages;
        }

        this.getTitle = function() {
            return ResourceManager.getLocale().message;
        }
    }]);