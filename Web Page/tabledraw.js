function TableDraw() {

  var de_cont = selectionList("de_cont")
  var mode = selectionList("mode")
  var Source = selectionList("Source")
  var Server = selectionList("Server")
  var band = selectionList("ChartBand")
  var dx = selectionList("dx")
  var  dxcall = selectionList("dxcall").toUpperCase()
  var DeCountry = selectionList("decountry")
  console.log(DeCountry);
   //dxcall = dxcall.toUpperCase();
  var HttpClient = function() {
this.get = function(aUrl, aCallback) {
var anHttpRequest = new XMLHttpRequest();

anHttpRequest.onreadystatechange = function() { 
if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
aCallback(anHttpRequest.responseText);
}
anHttpRequest.open( "GET", aUrl, true ); 
//anHttpRequest.setRequestHeader('cache-control', 'no-cache');

anHttpRequest.send( null ); 
}
}
   
   var theurl='http://'+Server+'/rows2?id='+Source+'&decont=' + de_cont + '&mode='+mode+'&dxfrom='+dx+'&band='+band+'&dxcall='+dxcall + '&decountry='+ DeCountry;
var client = new HttpClient();
client.get(theurl, function(response) {
  // console.log(theurl);
    //console.log(response);
var response1 = JSON.parse(response);
  // console.log(response1);
constructTable('#table',response1) ;
});
  
   function constructTable(selector,response) { 
   var Table = document.getElementById("table");
Table.innerHTML = "";          
   
           // Getting the all column names 
           var cols = Headers(selector,response);   
  
           // Traversing the JSON data 
           for (var i = 0; i < response.length; i++) { 
               var row = $('<tr/>');   

                        // add bearing
                        var degree ="";
                        var distance ="";
                        if (response[i].dxcall_lat) {
                        var degree = bearing(response[i].decall_lat, response[i].decall_long, response[i].dxcall_lat, response[i].dxcall_long);
                        row.append($('<td/>').html(degree));}
                        else {row.append($('<td/>').html(degree));}
        
                        //add distance
                        if (response[i].dxcall_lat) {
                        var distance = calculateDistance(response[i].decall_lat, response[i].decall_long, response[i].dxcall_lat, response[i].dxcall_long);
                        if (distance > 4000) {
                        row.append($('<td/ style="color:red;">').html(distance));}
                        else {row.append($('<td/>').html(distance));}}
                        else {row.append($('<td/>').html(distance));}
               
               for (var colIndex = 0; colIndex < cols.length; colIndex++) 
               { 
                   var val = response[i][cols[colIndex]]; 
                     
                   // If there is any key, which is matching 
                   // with the column name 
                   if (val == null) val = "";  
                       row.append($('<td/>').html(val)); 
                                          
               } 
              
               // Adding each row to the table 
               $(selector).append(row); 
           } 
       } 
         
       function Headers(selector,response) { 
           var columns = []; 
           //console.log(response);
           var header = $('<tr/>'); 

           //add extra headers 
           header.append($('<th/>').html("Bearing"));
           header.append($('<th/>').html("Distance"));
             
           for (var i = 0; i < response.length; i++) { 
               var row = response[i]; 
               var lat = response[i].dxcall_lat;
               var long = response[i].dxcall_long;
                               
               for (var k in row) { 
                   if ($.inArray(k, columns) == -1) { 
                       columns.push(k); 
                         
                       // Creating the header 
                       header.append($('<th/>').html(k)); 
                   } 
               } 
           } 
           //columns.push("lat");
          // columns.push("long");

          
             
           // Appending the header to the table 
           $(selector).append(header); 
               return columns; 
       } 

       // Converts from degrees to radians.
function toRadians(degrees) {
   return degrees * Math.PI / 180;
 };
  
 // Converts from radians to degrees.
 function toDegrees(radians) {
   return radians * 180 / Math.PI;
 }

 function bearing(startLat, startLng, destLat, destLng){

     startLng =-(startLng);
     destLng =-(destLng);

   startLat = toRadians(startLat);
   startLng = toRadians(startLng);
   destLat = toRadians(destLat);
   destLng = toRadians(destLng);
 
   y = Math.sin(destLng - startLng) * Math.cos(destLat);
   x = Math.cos(startLat) * Math.sin(destLat) -
         Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
   brng = Math.atan2(y, x);
   brng = toDegrees(brng);
   //console.log(brng);
   return Math.floor((brng + 360) % 360);
 }

 function calculateDistance(lat1, lon1, lat2, lon2) {

   lon1 =-(lon1);
   lon2 =-(lon2);
   const R = 6371; // Radius of the Earth in kilometers
   const dLat = toRadians(lat2 - lat1);
   const dLon = toRadians(lon2 - lon1);
   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
             Math.sin(dLon / 2) * Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   const distance = Math.floor(R * c); // Distance in kilometers
   return distance;
}

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  //console.log(cname + "=" + cvalue +  expires + ";path=/");
 // console.log(decodeURIComponent(document.cookie));
}

  function getCookie(cname) {
     let name = cname + "=";
     let decodedCookie = document.cookie;
     let ca = decodedCookie.split(';');
    // console.log(ca.length);
     
     for(let i = 0; i <ca.length; i++) {
       let c = ca[i];
      // console.log(c);
       while (c.charAt(0) == ' ') {
         c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
       }
     }
     return "";
   }

   function selectionList(input) {
     let Cookie = getCookie(input);
     
     var selection = document.getElementById(input);
     
     if (Cookie = !"") {
        
                              if ( getCookie(input) != selection.value && selection.value !="xx") {
                               // if ( getCookie(input) != selection.value ) {
                                var cookie = setCookie(input, selection.value,7);
                                return selection.value
                                                     
                                }
                                 else {
                                  document.getElementById(input).value = getCookie(input);
                                       return getCookie(input);
                                  
                               
                                        
                                       }
                                            }
           else {
              var cookie = setCookie(input, selection.value,7);}
                  return selection.value;
                 
  



   }
}