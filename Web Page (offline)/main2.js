/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 function skimmerDataLoad() {
 
 
         
var HttpClient = function() {

this.get = function(aUrl, aCallback) {
var anHttpRequest = new XMLHttpRequest();

anHttpRequest.onreadystatechange = function() { 
 if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
aCallback(anHttpRequest.responseText);
}
anHttpRequest.open( "GET", aUrl, true ); 


 anHttpRequest.send( null ); 
 }
}
                var de_cont = selectionList("de_cont")
                var mode = selectionList("mode")
                var Source = selectionList("Source")
                var Server = selectionList("Server")
                var ChartBand = selectionList("ChartBand")
                var DeCountry = selectionList("decountry")
                var skimmode = selectionList("SkimMode")
                var countries= selectionList("Countries")

              
var theurl='http://'+Server+'/cumul?id='+Source+'&decont='+de_cont+'&mode='+mode+'&decountry='+DeCountry+ '&skimmode='+ skimmode+'&Countries='+countries;
var client = new HttpClient();
client.get(theurl, function(response){ 
  var response1 = JSON.parse(response);
     var labels = response1.data.map(function(e) {
      return e.label;
   });
       var data = response1.data.map(function(e) {
         return e.value;
      });
           var ctx = document.getElementById('container');
      if(Chart.getChart("container")) {
         Chart.getChart("container")?.destroy()
       }
      this.chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Last 7 hours spot count',
      data: data,
      backgroundColor: "#2b5797",
      backgroundColor: "green",
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
           y: {
        beginAtZero: true
      }
    }
  }
});
}	
);

 var theurl='http://'+Server+'/bandcount?id='+Source+'&decont=' + de_cont + '&mode='+mode +'&decountry=' +DeCountry+ '&skimmode='+ skimmode+'&Countries='+countries;
// var theurl='https://jsonplaceholder.typicode.com/todos/1';
var client = new HttpClient();
client.get(theurl, function(response) { 
    // console.log(response);
 var response1 = JSON.parse(response);
 var labels = response1.data.map(function(e) {
  return e.label;
});
  var data = response1.data.map(function(e) {
     return e.value;
  });
  var ctx = document.getElementById('container2');
  if(Chart.getChart("container2")) {
     Chart.getChart("container2")?.destroy()
   }
  this.chart = new Chart(ctx, {
type: 'bar',
data: {
labels: labels,
datasets: [{
  label: 'Last hour spots / band',
  data: data,
  backgroundColor: "#2b5797",
  backgroundColor: "green",
  borderWidth: 1
}]
},
options: {
  devicePixelRatio: 2,
responsive: false,
maintainAspectRatio: false,
scales: {
   y: {
    beginAtZero: true
  }
}
}
});
 }
);



 //google.charts.load('current', {
  //  'packages':['geochart'],
 // });
  const autocolors = window['chartjs-plugin-autocolors'];
  if (ChartBand!="%")
 {var theurl='http://'+Server+'/countrycount2?id='+Source+'&decont=' + de_cont + '&mode=' + mode + '&band=' + ChartBand +'&decountry=' + DeCountry+ '&skimmode='+ skimmode+'&Countries='+countries;}
  else {
    var theurl='http://'+Server+'/distinctCountry?id='+Source+'&decont=' + de_cont + '&mode=' + mode + '&band=' + ChartBand +'&decountry=' + DeCountry+ '&skimmode='+ skimmode+'&Countries='+countries;
  }
// var theurl='https://jsonplaceholder.typicode.com/todos/1';
var client = new HttpClient();
client.get(theurl, function(response) { 
     //console.log(response);
 var response1 = JSON.parse(response);
 var labels = response1.data.map(function(e) {
  return e.label;
});
  var data = response1.data.map(function(e) {
     return e.value;
  });
   var ctx = document.getElementById('container3');
  if(Chart.getChart("container3")) {
     Chart.getChart("container3")?.destroy()
   }
  this.chart = new Chart(ctx, {
type: 'pie',
data: {
labels: labels,
datasets: [{
  label: 'Station count from the last hour',
  data: data,
  //backgroundColor: "green",
  borderWidth: 1
}]
},
options: {
  plugins: {
       autocolors,
       legend: {
        position: 'right',
      },
       title: {
        display: true,
        position: 'top',
        //text: 'Countries'
      }
},
devicePixelRatio: 2,
  responsive: false,
maintainAspectRatio: false,
scales: {
   y: {
    display: false,
    beginAtZero: true
  },
  
  legend: {
    display: false,
    position: "right" 
  },
}


}
});
 });
     //console.log(band);
     

let wordmap = worldMap();
let tableDraw = TableDraw();


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
                               //if (getCookie(input) != selection.value  ) {
                                if (getCookie(input) != selection.value && selection.value !="xx" ) {
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

   //setInterval(myFunction(), 5000);
 }



 function worldMap(){
  var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
     if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
    aCallback(anHttpRequest.responseText);    }
    anHttpRequest.open( "GET", aUrl, true ); 
       anHttpRequest.send( null );       }
    }
  var de_cont = document.getElementById("de_cont");
   var de_cont = de_cont.value;
   var mode = document.getElementById("mode");
   var mode = mode.value;
   var ChartBand = document.getElementById("ChartBand");
   var ChartBand = ChartBand.value;
   var dx = document.getElementById("dx");
   var dx = dx.value;
   var Source = document.getElementById("Source");
   var Source = Source.value;
   var Server = document.getElementById("Server");
   var Server = Server.value;
   var DeCountry = document.getElementById("decountry");
   var DeCountry = DeCountry.value;
   var skimmode = document.getElementById("SkimMode");
   var skimmode = skimmode.value;
   var countries = document.getElementById("Countries");
   var countries = countries.value;
  

   var container = L.DomUtil.get(document.getElementById('container5'));
    if(container != null){
   container._leaflet_id = null;
   }

    var map = new L.map(document.getElementById('container5')).setView([51.505, -0.09], 13);
  //   const tiles = new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     const tiles = new L.tileLayer('Leaflettiles/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   map.setZoom(1);
   
   var iconOptions = {
     iconUrl: 'marker.png',
     iconSize: [20, 20]
     };
 
       var iconOptions2 = {
     iconUrl: 'marker2.png',
     iconSize: [20, 20]
     };

   var customIcon = L.icon(iconOptions);
   var customIcon2 = L.icon(iconOptions2);

   var theurl='http://'+Server+'/latlongcount?id='+Source+'&decont=' + de_cont + '&mode='+mode+ '&band=' + ChartBand+'&decountry='+DeCountry+ '&skimmode='+ skimmode+'&Countries='+countries;
   var client = new HttpClient();

   client.get(theurl, function(response) { 
         var response1 = JSON.parse(response);
    //var count = Object.keys(response1).length;
           for (var i = 0; i < response1.data.length; i++) {
         var markerOptions = {
         title: response1.data[i].dxcall_country +"  "  + response1.data[i].count,
         clickable: true,
         draggable: false,
         icon: customIcon
         };
            var markerOptions2 = {
         title: response1.data[i].dxcall_country +"  "  + response1.data[i].count,
         clickable: true,
         draggable: false,
         icon: customIcon2
         };
     var dxcall_lat = response1.data[i].dxcall_lat
     dxcall_lat =Number(dxcall_lat);
     var dxcall_long = response1.data[i].dxcall_long
     dxcall_long =Number(dxcall_long);
     dxcall_long =-(dxcall_long);
 
     var latlong = [];
     latlong.push(dxcall_lat);
     latlong.push(dxcall_long);
    var NewCountry2 =  response1.data[i].new_country
         if (NewCountry2 == "Yes"){
          var marker = L.marker(latlong, markerOptions2)
         }
         else {
          var marker = L.marker(latlong, markerOptions)
         }
            //var marker = L.marker(latlong, markerOptions)
              marker.addTo(map)
   }
   
      
    });
    
 }






