function TableDraw() {

  var de_cont = selectionList("de_cont")
  var mode = selectionList("mode")
  var Source = selectionList("Source")
  var Server = selectionList("Server")
  var band = selectionList("ChartBand")
  var dx = selectionList("dx")
  var  dxcall = selectionList("dxcall").toUpperCase()
  var DeCountry = selectionList("decountry")
  var dxcallcountry = selectionList("dxcallcountry")
  var skimmode = selectionList("SkimMode")
  var countries= selectionList("Countries")
  var Selection = '<h3> From '+Source+ ' , Band: '+band+ ',  Mode: '+mode+', Receiver continent: '+de_cont+', Station continent: '+dx+ ', skimmode: '+skimmode+ ', countries: '+countries+'</h3>'
  document.getElementById('selection').innerHTML = Selection;

  var HttpClient = function() {
this.get = function(aUrl, aCallback) {
var anHttpRequest = new XMLHttpRequest();

anHttpRequest.onreadystatechange = function() { 
if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
aCallback(anHttpRequest.responseText);
}

anHttpRequest.open( "GET", aUrl, true ); 
anHttpRequest.setRequestHeader('cache-control', 'no-cache');

anHttpRequest.send( null ); 
}
}
   
   var theurl='http://'+Server+'/rows2?id='+Source+'&decont=' + de_cont + '&mode='+mode+'&dxfrom='+dx+'&band='+band+'&dxcall='+dxcall + '&decountry='+ DeCountry+ '&dxcountry='+ dxcallcountry+ '&skimmode='+ skimmode+'&Countries='+countries;;
var client = new HttpClient();
client.get(theurl, function(response) {
 var response1 = JSON.parse(response);
  if (typeof response1[0] === "undefined") {
    element = document.getElementById('table')
    element.innerHTML ="";
   }
  else {
        var colu =createTable('#table',response1) ;
}
});


function createTable(selection,data) {
element = document.getElementById('table')
element.innerHTML ="";
const table = document.createElement('table');
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');

// Append the table head and body to table
table.appendChild(tableHead);
table.appendChild(tableBody);

// table head
var columns = []; 
let row = tableHead.insertRow();
let th1 = document.createElement('th');
th1.textContent = "BEARING";
row.appendChild(th1);
let th2 = document.createElement('th');
th2.textContent = "DISTANCE";
row.appendChild(th2);
Object.keys(data[0]).forEach(key => {
columns.push(key); 
let th = document.createElement('th');
th.textContent = key.toUpperCase();
row.appendChild(th);
});

// table body
let rownum =0;
data.forEach(item => {
  //ADDING BEARING AND DISTANCE
 rownum =rownum +1    
 let row = tableBody.insertRow();
 //row.style.color ="red";
   let dxcall_lat = data[rownum-1].dxcall_lat;
   let dxcall_long = data[rownum-1].dxcall_long;
   let decall_lat = data[rownum-1].decall_lat;
   let decall_long = data[rownum-1].decall_long;
   let newCountry = data[rownum-1].new_country;
   if (newCountry == "Yes") {
    row.style.color ="red";
   }
   var degree = bearing(decall_lat, decall_long, dxcall_lat, dxcall_long);
   var distance = calculateDistance(decall_lat, decall_long, dxcall_lat,dxcall_long);
   let cell1 = row.insertCell(); 
   cell1.textContent = degree;
   let cell2 = row.insertCell(); 
   if (distance > 4000) {
       cell2.style.color = "red";
   }
      cell2.textContent = distance;
     
   Object.values(item).forEach(value => {
  
  let cell = row.insertCell();
 if (value == null) {
     value ="";
       }

if (value.substring(0,7) == '<a href' )
    //Construct of QRZ link 
{
  let position1 = value.search("https");
  let position2 = value.search("target");
  let linkadress = value.substring(position1,position2-1);
  const link = document.createElement('a');
  //callsign:
link.textContent = linkadress.substring(23,37);
link.href = linkadress;
link.target = '_blank';
cell.appendChild(link);
}

else {
cell.textContent = value;
}
   
});
});

// Append the table to the HTML document
document.getElementById('table').appendChild(table);
return  ;
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
}

  function getCookie(cname) {
     let name = cname + "=";
     let decodedCookie = document.cookie;
     let ca = decodedCookie.split(';');
      for(let i = 0; i <ca.length; i++) {
       let c = ca[i];
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