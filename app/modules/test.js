'use strict';

angular.module('app.test', [])
    .controller('TestController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.selectedIndex2 = 0;

        function animate(num,sel,className){
            var target = document.getElementById(sel).children[num];
            if(hasClass(target,className)){
                remove(num);
            }
            addClass(target, className);
        }

        function remove(num,sel,className){
            var target = document.getElementById(sel).children[num];
            removeClass(target,className);
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

        function clearClass(num){
            var target = document.getElementById('test').children[num];
            target.className = '';
        }

        animate(0,'test','test_animation');
        animate(0,'test1','animation');

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_DOWN:
                    if ($scope.selectedIndex2 < 2) {
                        $scope.selectedIndex2++;
                    }
                    remove($scope.selectedIndex2-1,'test1','animation');
                    animate($scope.selectedIndex2,'test1','animation');
                    break;
                case COMMON_KEYS.KEY_UP:
                    if ($scope.selectedIndex2 > 0) {
                        $scope.selectedIndex2--;
                    }
                    remove($scope.selectedIndex2+1,'test1','animation');
                    animate($scope.selectedIndex2,'test1','animation');
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if ($scope.selectedIndex > 0) {
                        $scope.selectedIndex--;
                    }
                    remove($scope.selectedIndex+1,'test','test_animation');
                    animate($scope.selectedIndex,'test','test_animation');
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if ($scope.selectedIndex < 2) {
                        $scope.selectedIndex++;
                    }
                    remove($scope.selectedIndex-1,'test','test_animation');
                    animate($scope.selectedIndex,'test','test_animation');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    clearClass($scope.selectedIndex);
                    break;
            }
        })

    }]);