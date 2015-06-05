var dashboardApp = angular.module('dashboardApp', ["chart.js"]);

dashboardApp.controller('clockWidgetCtrl', function ($scope, $filter, $interval) {
    $scope.tick = function() {
        $scope.clock = Date.now() // get the current time

        // Some modification to display french formated date
        day = $filter('date')($scope.clock, 'EEEE');
        dayNumber = $filter('date')($scope.clock, 'd');
        month = $filter('date')($scope.clock, 'M');
        year = $filter('date')($scope.clock, 'y');

        switch(day) {
            case "Monday":
                day = "Lundi";
                break;
            case "Tuesday":
                day = "Mardi";
                break;
            case "Wednesday":
                day = "Mercredi";
                break;
            case "Thursday":
                day = "Jeudi";
                break;
            case "Friday":
                day = "Vendredi";
                break;
            case "Saturday":
                day = "Samedi";
                break;
            case "Sunday":
                day = "Dimanche";
                break;

            default:
               console.log('ClockWidget cannot find the day of the week.');
        }

        switch(month) {
            case "1":
                month = "Janvier";
                break;
            case "2":
                month = "Février";
                break;
            case "3":
                month = "Mars";
                break;
            case "4":
                month = "Avril";
                break;
            case "5":
                month = "Mai";
                break;
            case "6":
                month = "Juin";
                break;
            case "7":
                month = "Juillet";
                break;
            case "8":
                month = "Août";
                break;
            case "9":
                month = "Septembre";
                break;
            case "10":
                month = "Octobre";
                break;
            case "11":
                month = "Novembre";
                break;
            case "12":
                month = "Décembre";
                break;

            default:
               console.log('ClockWidget cannot find the month.');
        }

        $scope.serializedDate = day + ' ' + dayNumber + ' ' + month + ' ' + year;
    }

    $scope.tick();
    timer = $interval(function() {
        $scope.tick();
    }, 1000)
});


dashboardApp.controller('AryaWidgetCtrl', function ($scope, $interval, $http) {
    $scope.fetch = function() {
        $http({
            method: "GET",
            url: "../api/snmp-arya.php",
        }).success(function(data, status){
            if(status == 200) {
                $scope.data = angular.fromJson(data);

                if($scope.data.temperature > 65) {
                    $scope.panelcolor = 'red';
                } else {
                    $scope.panelcolor = 'green';
                }

                if($scope.data.disk_percent_raid < 70) {
                    $scope.data.disk_percent_raid_status = 'success';
                } else {
                    $scope.data.disk_percent_raid_status = 'danger';
                }

                if($scope.data.disk_percent_hdd1 < 70) {
                    $scope.data.disk_percent_hdd1_status = 'success';
                } else {
                    $scope.data.disk_percent_hdd1_status = 'danger';
                }

                if($scope.data.backupsystem == 'OK') {
                    $scope.data.backupsystem_text = 'OK';
                    $scope.data.backupsystem_color = 'green';
                } else {
                    $scope.data.backupsystem_text = 'ERROR';
                    $scope.data.backupsystem_color = 'red';
                }
            }
        });
    }

    $scope.fetch();
    timer = $interval(function() {
        $scope.fetch();
    }, 15000)
});


dashboardApp.controller('KebabWidgetCtrl', function ($scope, $interval, $http) {
    $scope.fetch = function() {
        $http({
            method: "GET",
            url: "../api/snmp-kebab.php",
        }).success(function(data, status){
            if(status == 200) {
                $scope.data = angular.fromJson(data);

                if($scope.data.disk_percent_root < 70) {
                    $scope.data.disk_percent_root_status = 'success';
                } else {
                    $scope.data.disk_percent_root_status = 'danger';
                }

                if($scope.data.ram_percent < 70) {
                    $scope.data.ram_percent_status = 'success';
                } else {
                    $scope.data.ram_percent_status = 'danger';
                }
            }
        });
    }

    $scope.fetch();
    timer = $interval(function() {
        $scope.fetch();
    }, 15000)
});


dashboardApp.controller("PingPHDC3WidgetCtrl", function ($scope, $interval, $filter, $http) {
    $scope.pingNb = 6; // Number of points
    $scope.pingHost = 'tcardonne.fr' // Remote IP
    $scope.panicAt = 40; // in ms. If response time is > this value, panel's color will be changed.

    // Initialize
    now = $filter('date')(Date.now(), 'mm:ss');
    $scope.labels = [0, 0, 0, 0, 0, 0];
    $scope.data = [
        [0, 0, 0, 0, 0, 0],
    ];
    $scope.options = {
        animation: false,
        bezierCurve : false,
        scaleOverride: true,
        scaleSteps: 10,
        scaleStepWidth: 5,
        scaleStartValue: 0
    };

    $scope.fetch = function() {
        $http({
            method: "GET",
            url: "../api/ping.php?host=" + $scope.pingHost,
        }).success(function(rtn, status){
            if(status == 200) {
                rtn = angular.fromJson(rtn);

                $scope.labels.push($filter('date')(Date.now(), 'mm:ss'));
                if(rtn.error == true) {
                    $scope.data[0].push(50);
                    $scope.current = 'ERR';
                } else {
                    $scope.data[0].push(rtn.time);
                    $scope.current = rtn.time;
                }

                if($scope.current > $scope.panicAt || $scope.current == 'ERR') {
                    $scope.color = 'danger'
                } else {
                    $scope.color = 'default'
                }


                if($scope.data[0].length > $scope.pingNb ) {
                    $scope.labels.splice(0, 1);
                    $scope.data[0].splice(0, 1);
                }
            }
        });
    }

    $scope.fetch();
    timer = $interval(function() {
        $scope.fetch();
    }, 2000)
});