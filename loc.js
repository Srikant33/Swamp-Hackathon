function showLocation(position) {
  var latitude = position.coords.latitude;
  console.log(position.coords.latitude);
  var longitude = position.coords.longitude;
  var latlongvalue = position.coords.latitude + "," + position.coords.longitude;
  var location = {};
  location.latitude = latitude;
  location.longitude = longitude;


  



$.ajax({
  type: 'POST',
  data: JSON.stringify(location),
      contentType: 'application/json',
              url: 'http://localhost:3002/endpoint',						
              success: function(data) {
                  console.log('success');
                  console.log(JSON.stringify(data));
              }
          });
  
//       $.ajax({
// 				type: 'POST',
// 				data: latitude,
// 		        contentType: 'application/json',
//                   url: 'http://localhost:3002/endpoint',						
//                   success: function(data) {
//                       console.log('success');
//                       console.log(JSON.stringify(data));
//                   },
//   error: function (xhr, status, error) {
//       console.log('Error: ' + error.message);
//       $('#lblResponse').html('Error connecting to the server.');
//   },
// });


//          $.ajax({
//      url: 'http://localhost:3002/endpoint',
//     // dataType: "jsonp",
//      data: '{"data": latitiude}',   
//      type: 'POST',
//      jsonpCallback: 'callback', // this is not relevant to the POST anymore
//      success: function () {
//         // var ret = jQuery.parseJSON(data);
//          //$('#lblResponse').html(ret.msg);
//          console.log('Success: ')
//      },
//      error: function (xhr, status, error) {
//          console.log('Error: ' + error.message);
//          $('#lblResponse').html('Error connecting to the server.');
//      },
//  });

 
  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlongvalue+"&zoom=14&size=400x300&key=AIzaSyAa8HeLH2lQMbPeOiMlM9D1VxZ7pbGQq8o";
  document.getElementById("mapholder").innerHTML ="<img src='"+img_url+"'>";
}
function errorHandler(err) {
  if(err.code == 1) {
     alert("Error: Access is denied!");
  } else if( err.code == 2) {
     alert("Error: Position is unavailable!");
  }
}
function getLocation(){
  if(navigator.geolocation){
     // timeout at 60000 milliseconds (60 seconds)
     var options = {timeout:60000};
     navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
  } else{
     alert("Sorry, browser does not support geolocation!");
  }
}