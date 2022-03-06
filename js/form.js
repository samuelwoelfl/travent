var service, routes, ical;
let counter = 0;
let delay = 2000;
var vevents;
var veventsLoop;


var origin, destination, bufferBefore, bufferAfter, preferred



$(window).on("load", function() {
  service = new google.maps.DirectionsService;
});


function cleanRoutes(routes) {
  routesClean = [];
  for (var i in routes) {
    route = routes[i];
    leg = route["legs"][0];
    var legClean = {
      "start": leg["start_address"],
      "end": leg["end_address"],
      "departure": leg["departure_time"]["value"],
      "departureText": leg["departure_time"]["text"],
      "arrival": leg["arrival_time"]["value"],
      "arrivalText": leg["arrival_time"]["text"],
      "duration": leg["duration"]["value"],
      "durationText": leg["duration"]["text"],
    }

    stepsRaw = leg["steps"];
    stepsClean = [];
    for (var i in stepsRaw) {
      stepRaw = stepsRaw[i];
      var step = {}
      step["type"] = stepRaw["travel_mode"];
      step["description"] = stepRaw["instructions"];
      step["duration"] = stepRaw["duration"]["value"];
      step["durationText"] = stepRaw["duration"]["text"];
      step["distance"] = stepRaw["distance"]["value"];
      step["distanceText"] = stepRaw["distance"]["text"];
      if (step["type"] == "TRANSIT") {
        step["line"] = stepRaw["transit"]["line"]["short_name"];
        step["vehicleName"] = stepRaw["transit"]["line"]["vehicle"]["name"];
        step["headsign"] = stepRaw["transit"]["headsign"];
        step["end"] = stepRaw["transit"]["arrival_stop"]["name"];
        step["arrival"] = stepRaw["transit"]["arrival_time"]["value"];
        step["arrivalText"] = stepRaw["transit"]["arrival_time"]["text"];
        step["start"] = stepRaw["transit"]["departure_stop"]["name"];
        step["departure"] = stepRaw["transit"]["departure_time"]["value"];
        step["departureText"] = stepRaw["transit"]["departure_time"]["text"];
      } else if (step["type"] == "WALKING") {
        if (i == 0) {
          step["departure"] = legClean["departure"];
          step["departureText"] = legClean["departureText"];
        } else {
          step["departure"] = stepsRaw[i - 1]["transit"]["arrival_time"]["value"];
          step["departureText"] = stepsRaw[i - 1]["transit"]["arrival_time"]["text"];
        }
        step["arrival"] = new Date(new Date(step["departure"].getTime() + step["duration"]));
        arrivalHour = (String(step["arrival"].getHours()).padStart(2, "0"));
        arrivalMinute = (String(step["arrival"].getMinutes()).padStart(2, "0"));
        step["arrivalText"] = arrivalHour + ':' + arrivalMinute;
        // console.log('\n\n');
      }
      stepsClean.push(step);
    }
    legClean["steps"] = stepsClean;
    routesClean.push(legClean);
  }
  // console.log(routesClean);
  return routesClean
}


function formatToText(routesClean) {
  for (var i in routesClean) {
    route = routesClean[i];
    heading = `Fahrt von ${route["start"]} nach ${route["end"]} - ${route["departureText"]} -> ${route["arrivalText"]} - ${route["durationText"]}`;
    console.log(heading);
    for (var j in route["steps"]) {
      step = route["steps"][j];
      number = Number(j) + 1;
      if (step["type"] == 'WALKING') {
        stepText = `${number}) ${step["distanceText"]} ${step["description"]}\n${step["departureText"]} -> ${step["arrivalText"]} - ${step["durationText"]}`;
      } else {
        stepText = `${number}) ${step["line"]} ${step["headsign"]} bis '${step["end"]}'  \n${step["departureText"]} -> ${step["arrivalText"]} - ${step["durationText"]}`;
      }
      console.log(stepText);
    }
    console.log('\n');
  }
}


function secondsToText(d) {
  d = Number(d);

  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);

  if (h == 0) {
    return (String(m).padStart(2, "0")) + " Minuten";
  } else {
    return (String(h).padStart(2, "0")) + ":" + (String(m).padStart(2, "0")) + "h";
  }
}


function meterToText(d) {
  d = Number(d);

  var km = Math.floor(d / 1000);
  var m = Math.floor(d % 3600 / 60);

  if (h == 0) {
    return (String(m).padStart(2, "0")) + "min";
  } else {
    return (String(h).padStart(2, "0")) + ":" + (String(m).padStart(2, "0")) + "h";
  }
}



function sendData() {

  vevents = [];
  calURL = $("#source_cal").val();
  getIcal(calURL);
  setTimeout(function() {
    var jcalData = ICAL.parse(ical);
    for (var i in jcalData[2]) {
      veventData = jcalData[2][i];
      if (veventData[0] == "vevent") {
        veventData = veventData[1];
        vevent = {
          "start": veventData[1][3],
          "end": veventData[2][3],
          "summary": veventData[3][3],
          "location": veventData[5][3],
        }
        vevents.push(vevent);
      }
    }


    origin = $("#start").val();
    destination = $("#end").val();
    bufferBefore = $("#buffer_before").val();
    if (bufferBefore == "") {
      bufferBefore = 5;
    }
    bufferAfter = $("#buffer_after").val();
    if (bufferAfter == "") {
      bufferAfter = 5;
    }
    preferred = $("#preferred").val();
    console.log(preferred);
    if (preferred == "") {
      preferred = [];
    } else {
      preferred = [preferred];
    }
    console.log(preferred);

    try {
      veventProcess(vevents);
    } catch (e) {
      console.log(e);
      $("#debug_errors").html(e);
    }


  }, 500);

}


function veventProcess() {
  clearInterval(veventsLoop);


  counter++;
  if (counter == vevents.length) {
    clearInterval(veventsLoop);
  }

  vevent = vevents[counter - 1];
  start = new Date(vevent["start"]);
  today = new Date()
  today.setMonth(today.getMonth() + 1);
  end = new Date(vevent["end"]);
  setArrivalTime = new Date(new Date(start).getTime() - bufferBefore * 60000);
  setDepartureTime = new Date(new Date(end).getTime() + bufferAfter * 60000);
  summary = vevent["summary"];
  veventLocation = vevent["location"];
  if (destination == '') {
    destination = veventLocation;
  }
  console.log(vevent);

  // console.log(origin);
  // console.log(destination);

  if (start < today) {
    delay = 2000;
    service.route({
      origin: origin,
      destination: destination,
      travelMode: 'TRANSIT',
      provideRouteAlternatives: false,
      unitSystem: google.maps.UnitSystem.METRIC,
      transitOptions: {
        arrivalTime: start,
        modes: preferred,
        routingPreference: 'LESS_WALKING',
        // departureTime: date.now(),
      },
    }, function(response, status) {
      if (status == "OK") {
        // console.log(response["routes"]);
        routes = response["routes"];
        routesClean = cleanRoutes(routes);
        formatToText(routesClean);
      }
    });
    service.route({
      origin: destination,
      destination: origin,
      travelMode: 'TRANSIT',
      provideRouteAlternatives: false,
      unitSystem: google.maps.UnitSystem.METRIC,
      transitOptions: {
        departureTime: setDepartureTime,
        modes: preferred,
        routingPreference: 'LESS_WALKING',
        // departureTime: date.now(),
      },
    }, function(response, status) {
      if (status == "OK") {
        // console.log(response["routes"]);
        routes = response["routes"];
        routesClean = cleanRoutes(routes);
        formatToText(routesClean);
      }
    });
  } else {
    delay = 0;
  }

  veventsLoop = setInterval(veventProcess, delay)
}


function getIcal(url) {
  // read text from URL location
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader('Content-Type');
      ical = request.responseText;
      // return request.responseText;
    }
  }
}





function initMap() {
  console.log('test');
}