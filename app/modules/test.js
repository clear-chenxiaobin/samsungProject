'use strict';

angular.module('app.test', [])
    .controller('TestController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        $scope.selectedIndex = 0;

        function animate(num){
            var target = document.getElementById('test').children[num];
            if(hasClass(target,'test_animation')){
                remove(num);
            }
            addClass(target, 'test_animation');
        }

        function remove(num){
            var target = document.getElementById('test').children[num];
            removeClass(target,'test_animation');
        }

        function addClass(obj, cls) {
            if (!hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        }
        function hasClass(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        function removeClass(obj, cls) {
            if (hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

        animate(0);

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_DOWN:
                    remove();
                    break;
                case COMMON_KEYS.KEY_UP:
                    animate();
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if ($scope.selectedIndex > 0) {
                        $scope.selectedIndex--;
                    }
                    remove($scope.selectedIndex+1);
                    animate($scope.selectedIndex);
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if ($scope.selectedIndex < 2) {
                        $scope.selectedIndex++;
                    }
                    remove($scope.selectedIndex-1);
                    animate($scope.selectedIndex);
                    break;
            }
        })

    }]);