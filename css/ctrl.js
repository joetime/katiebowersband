angular.module('kbbApp', [])
.controller('kbbCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.calEvents = [];
    
    function parseEvents(events) {
        // parse entries
        var lst = [];
        angular.forEach(events, function(ev, index) {
            
            var dateString = cleanDate(ev.summary.$t);
            var date = parseDate(dateString);
            
            var title = parseTitle(ev.title.$t);
            var where = parseWhere(ev.title.$t);
            
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
    
    
    function cleanDate (str) {
        return str
        .substring(0, str.indexOf(" to "))
        .replace("When:","")
        .trim();   
    }

    function parseDate (str) {
        // format is: Thu Mar 19, 2015 5pm
        var arr = str.split(" ");
        return {
            dayOfWeek: parseDayOfWeek(arr[0]),
            month: parseMonth(arr[1]),
            day: arr[2].replace(",",""),
            year: arr[3],
            time: arr[4]
        }
    }

    function parseDayOfWeek(str) {

        if (str == "Mon") return "Monday";
        if (str == "Tue") return "Tuesday";
        if (str == "Wed") return "Wednesday";
        if (str == "Thu") return "Thursday";
        if (str == "Fri") return "Friday";
        if (str == "Sat") return "Saturday";
        if (str == "Sun") return "Sunday";

        // in case it doesnt match 
        return str;
    }

    function parseMonth(str) {
        
        if (str == "Jan") return "January";
        if (str == "Feb") return "February";
        if (str == "Mar") return "March";
        if (str == "Apr") return "April";
        if (str == "May") return "May";
        if (str == "Jun") return "June";
        if (str == "Jul") return "July";
        if (str == "Aug") return "August";
        if (str == "Sep") return "September";
        if (str == "Oct") return "October";
        if (str == "Nov") return "November";
        if (str == "Dec") return "December";
        
        return str;
    }

    var url = 'https://www.google.com/calendar/feeds/6ebfnlaom2hdleqk54b6ne9adc%40group.calendar.google.com/public/basic?alt=json&orderby=starttime&sortorder=ascending&futureevents=true';

    $http.get(url)
    .success(function (resp) { 
        console.log(resp.feed.entry);

        parseEvents(resp.feed.entry);
    })
    .error(function (resp) { console.log(resp); });

}]);