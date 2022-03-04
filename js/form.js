var origin = 'Burghaldenweg 64 Stuttgart';
var destination = 'Stuttgart Universität Vaihingen';
var arrivalTime = new Date(new Date().getTime() + 30 * 60000);

var routes;

$(window).on("load", function() {
  var service = new google.maps.DirectionsService;
  service.route({
    origin: origin,
    destination: destination,
    travelMode: 'TRANSIT',
    provideRouteAlternatives: true,
    unitSystem: google.maps.UnitSystem.METRIC,
    transitOptions: {
      arrivalTime: arrivalTime,
      // departureTime: date.now(),
    },
  }, function(response, status) {
    if (status == "OK") {
      console.log(response["routes"]);
      routes = response["routes"];
      printRoutes(routes);
    }
  });
});


function printRoutes(routes) {
  for (var i in routes) {
    route = routes[i];
    leg = route["legs"][0];
    var legClean = {
      "start": leg["start_address"],
      "end": leg["end_address"],
      "departure": leg["departure_time"]["value"],
      "arrival": leg["arrival_time"]["value"],
      "duration": leg["duration"]["value"],
    }

    stepsRaw = leg["steps"];
    stepsClean = [];
    for (var i in stepsRaw) {
      stepRaw = stepsRaw[i];

      var step = {}
      step["type"] = stepRaw["travel_mode"];
      step["description"] = stepRaw["instructions"];
      step["stepDuration"] = stepRaw["duration"]["value"];
      step["stepDistance"] = stepRaw["distance"]["value"];
      if (step["type"] == "TRANSIT") {
        step["line"] = stepRaw["transit"]["line"]["short_name"];
        step["vehicleName"] = stepRaw["transit"]["line"]["vehicle"]["name"];
        step["headsign"] = stepRaw["transit"]["headsign"];
        step["stepEnd"] = stepRaw["transit"]["arrival_stop"]["name"];
        step["stepArrival"] = stepRaw["transit"]["arrival_time"]["value"];
        step["stepStart"] = stepRaw["transit"]["departure_stop"]["name"];
        step["stepDeparture"] = stepRaw["transit"]["departure_time"]["value"];
      } else if (step["type"] == "WALKING") {
        if (i == 0) {
          step["stepDeparture"] = legClean["departure"];
        } else {
          step["stepDeparture"] = stepsRaw[i - 1]["transit"]["arrival_time"]["value"];
        }
        step["stepArrival"] = Date(Date(step["stepDeparture"]) + step["stepDuration"]);
      }
      stepsClean.push(step);
      // console.log(step);
    }
    legClean["steps"] = stepsClean;
    console.log(legClean);

    // console.log(`Verbindung ${start} -> ${end} :\n\nAbfahrt: ${departure}\nAnkunft: ${arrival}\nDauer:${duration}\n  \n\n`);
  }
}




function initMap() {
  console.log('test');
}