var origin = 'Freiburg';
var destination = 'Stuttgart';


$(window).on("load", function() {
  var service = new google.maps.DistanceMatrixService;
  response = service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'TRANSIT',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
    transitOptions: {
      arrivalTime: date.now() + 3,
      // departureTime: date.now(),
      modes[]: TransitMode,
      routingPreference: TransitRoutePreference
    },
    unitSystem: google.maps.UnitSystem.IMPERIAL
  });
  console.log(response);
});

function initMap() {
  console.log('test');
}