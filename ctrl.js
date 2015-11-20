angular.module('kbbApp', [])
.controller('kbbCtrl', ['$scope', '$http', function($scope, $http) {
    
    var apiKey = 'AIzaSyCo-_b7KEPky0Hz7gxC-H60wVRROv6BUqU';
    
    $scope.calEvents = [];
    
    function parseEvents(events) {
        // parse entries
        var lst = [];
        angular.forEach(events, function(ev, index) {
            
            //var dateString = cleanDate(ev.start.dateTime);
            var date = parseDate(ev.start.dateTime);
            
            var title = parseTitle(ev.summary);
            var where = parseWhere(ev.summary);
            
            lst.push({ date: date, title: title, where: where });
        });
        
        $scope.calEvents = lst; 
    }
    
    function parseTitle(str) {
     
        return str
            .split('@')[0].trim()
            .split(' at ')[0].trim()
            .replace("KBB", "Katie Bowers Band")
            .replace("&amp;", "&");
    }
    
    function parseWhere(str) {
        var where = {};
        if (str.toLowerCase().indexOf("leadb") >= 0) { 
            where.name = "Leadbetters Tavern";
            where.website = "http://www.leadbetterstavern.com";
            where.mapLink = "https://goo.gl/maps/nHhHp";
        }
        else if (str.toLowerCase().indexOf("cat") >= 0) { 
            where.name = "Cat's Eye Pub";
            where.website = "http://www.catseyepub.com";
            where.mapLink = "https://goo.gl/maps/HfWbR";
        }
        else if (str.toLowerCase().indexOf("admiral") >= 0) { 
            where.name = "The Admirals Cup";
            where.website = "http://www.theadmiralscup.com";
            where.mapLink = "https://goo.gl/maps/h5Fol";
        }
        else {
            where.name = str;   
        }
        
        return where;
    }
    
    function parseDate (str) {
        // format is: 2015-12-22T21:00:00-05:00
        var mom = moment(str);
        console.log('moment:', mom );
        return {
            dayOfWeek: mom.format('dddd'),
            month: mom.format('MMMM'),
            day: mom.format('D'),
            year: mom.format('YYYY'),
            time: mom.format('h:mm A')
        }
    }
    
    var calendarId = '6ebfnlaom2hdleqk54b6ne9adc@group.calendar.google.com';
    
    var timeMin = moment().subtract(6, 'hour');
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?' + 
    'key=' + apiKey + 
    '&singleEvents=true' +
    '&orderBy=starttime' + 
    '&timeMin=' + timeMin.toISOString() //'2015-11-20T00:00:01Z';
    
    $http.get(url)
    .success(function (resp) { 
     
        console.log(resp.items);

        parseEvents(resp.items);
    })
    .error(function (resp) { 
        $scope.errorMessage = "Oops, there was a problem loading our calendar, but...";
        console.log(resp); 
    });

}]);