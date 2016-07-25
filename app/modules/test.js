'use strict';

angular.module('app.test', [])
    .controller('TestController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        function animate(){
            var target = document.getElementById('test');
            if(hasClass(target,'test_animation')){
                remove();
            };
            addClass(target, 'test_animation');

        };

        function remove(){
            var target = document.getElementById('test');
            removeClass(target,'test_animation');
        }

        function addClass(obj, cls) {
            if (!hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        };
        function hasClass(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        function removeClass(obj, cls) {
            if (hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    remove();
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    animate();
                    break;
            }
        })

    }]);