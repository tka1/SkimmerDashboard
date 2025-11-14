var express = require('express');
var app = express();
var fs = require("fs");
var pg = require('pg');

app.get('/people', function (req, res) {
  res.send('hello');
})

var conString = "postgres://cluster:password@host.docker.internal:5432/postgres";
//var conString = "postgres://cluster:password@192.168.1.39:5432/postgres";
var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    console.log('error');
    return console.error('could not connect to postgres', err);
  }



  app.get('/distinctCountry', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id2 = req.query.id;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
    var decountry = req.query.decountry;
    
   // client.query("SELECT country as label, kountti as value from cluster.country_count where title =$1 and de_continent = $2 and mode =$3  order by 2 desc", [id2, de_cont, mode], function (err, result) {
      client.query("SELECT country as label, count(DISTINCT clustertable.dxcall) as value from cluster.clustertable where title =$1 and de_continent = $2 and mode =$3 and clustertable.insert_time >= (now() - '01:00:00'::interval) and de_country like $4 GROUP BY clustertable.country, clustertable.title, clustertable.de_continent, clustertable.mode order by 2 desc", [id2, de_cont, mode, decountry], function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
      var chart = { "caption": "DISTINCT COUNT OF COUNTRIES FROM LAST HOUR", "showValues": "1", "theme": "fint" };
      querydata.chart = chart;
      var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata =
        res.json(querydata);
    });
  });



  app.get('/bandcount', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id2 = req.query.id;
    var de_cont = req.query.decont
    var mode = req.query.mode;
    var decountry = req.query.decountry;
    //client.query("SELECT band as label, kountti as value from cluster.band_count where title = $1 and de_continent = $2 and mode =$3 order by 2 desc", [id2, de_cont, mode], function (err, resul
      client.query("SELECT band as label, count(DISTINCT clustertable.dxcall) as value from cluster.clustertable where title =$1 and de_continent = $2 and mode =$3 and clustertable.insert_time >= (now() - '01:00:00'::interval) and de_country like $4 GROUP BY clustertable.band, clustertable.title, clustertable.de_continent, clustertable.mode order by 2 desc", [id2, de_cont, mode, decountry], function (err, result)  {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
      var chart = { "caption": "LAST HOUR DISTINCT CALLSIGNS / BAND", "xAxisname": "BAND", "showValues": "1", "theme": "zune" };
      querydata.chart = chart;
      var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata =
        res.json(querydata);
    });
  });

  app.get('/countrycount2', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id2 = req.query.id;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
    var band = req.query.band;
    var decountry = req.query.decountry;
    //client.query("SELECT country as label, kountti as value from cluster.country_count2 where title =$1 and de_continent = $2 and mode =$3 and band like $4  order by 2 desc", [id2, de_cont, mode, band], function (err, result) {
      client.query("SELECT country as label, count(DISTINCT clustertable.dxcall) as value from cluster.clustertable where title =$1 and de_continent = $2 and mode =$3 and band like $4 and clustertable.insert_time >= (now() - '01:00:00'::interval) AND clustertable.skimmode = 'CQ' and de_country like $5 GROUP BY clustertable.country, clustertable.title, clustertable.de_continent, clustertable.mode, clustertable.band  order by 2 desc", [id2, de_cont, mode, band, decountry], function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
      var chart = { "caption": "COUNTRIES FROM LAST HOUR", "showValues": "1", "theme": "fint" };
      querydata.chart = chart;
      var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata =
        res.json(querydata);
    });
  });



  app.get('/cumul', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id2 = req.query.id;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
    var decountry = req.query.decountry;
    //console.log("cumul");
   // client.query("SELECT day_hour as label, spot_count as value from cluster.cumul_spot_count where title = $1 and de_continent = $2 and mode =$3 ", [id2, de_cont, mode, decountry], function (err, result) {
      client.query("SELECT to_char(clustertable.insert_time, 'dd/HH24'::text) as label, count(DISTINCT clustertable.dxcall) as value from cluster.clustertable where title = $1 and de_continent = $2 and mode =$3 and de_country like $4 and clustertable.insert_time >= (now() - '06:00:00'::interval) GROUP BY (to_char(clustertable.insert_time, 'dd/HH24'::text)), clustertable.title, clustertable.de_continent, clustertable.mode ORDER BY (to_char(clustertable.insert_time, 'dd/HH24'::text)); ", [id2, de_cont, mode, decountry], function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
      var chart = { "caption": "DISTINCT CALLSIGNS FROM LAST 7 HOURS", "xAxisname": "DAY/HOUR", "showValues": "1", "theme": "zune" };
      querydata.chart = chart;
      var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata =
        res.json(querydata);
    });
  });



  app.get('/latlongcount', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id = req.query.id;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
     var band = req.query.band;
     var decountry = req.query.decountry;
    client.query("SELECT count(distinct dxcall),concat(dxcall_lat,', ',dxcall_long) as latlong, dxcall_country,dxcall_lat,dxcall_long FROM cluster.latestrows_new where title =$1  and de_continent =$2 and mode = $3  and skimmode ='CQ'and band like $4 and decall_country like $5 group by concat(dxcall_lat,', ',dxcall_long),dxcall_country,dxcall_lat,dxcall_long ", [id, de_cont, mode,  band, decountry], function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
     var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata = 
        res.json(querydata);
        
        
      //console.log(retdata);
    });
  });

  app.get('/rows2', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id = req.query.id;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
    var dx_from = req.query.dxfrom;
    var band = req.query.band;
    var dxcall = req.query.dxcall;
    var decountry = req.query.decountry;
    var dxcountry = req.query.dxcountry;
    //console.log(dxcall);
    if (dxcall) {
      client.query("SELECT * from cluster.latestrows_new where title =$1  and de_continent =$2 and mode = $3 and dx_continent != $4 and skimmode ='CQ'and band like $5 and dxcall like $6 and decall_country like $7 and dxcall_country like $8  limit 300 ", [id, de_cont, mode, dx_from, band, dxcall,decountry,dxcountry], function (err, result) {
       // console.log(client.query);
        if (err) {
          return console.error('error running query', err);
        }
        var querydata = [];

        var obj = result.rows;
        //console.log(obj.length);
        for (i = 0; i < obj.length; i++) {
          querydata.push(obj[i]);
                 }
        //console.log(querydata);
        retdata =
          res.json(querydata);
          
      })
    }
    else {
      client.query("SELECT * from cluster.latestrows_new where title =$1  and de_continent =$2 and mode = $3 and dx_continent != $4 and band like $5 and decall_country like $6 and dxcall_country like $7   limit 300 ", [id, de_cont, mode, dx_from, band,decountry,dxcountry], function (err, result) {
      //client.query("SELECT datetime,insert_time from cluster.clustertable where title =$1 and de_continent = $2 and mode =$3 and band like $4 and clustertable.insert_time >= (now() - '01:00:00'::interval) AND clustertable.skimmode = 'CQ' and de_country like $5   order by 1 desc limit 10 ", [id, de_cont, mode, band, decountry], function (err, result) {  
      if (err) {
          return console.error('error running query', err);
        }
        var querydata = [];
            var obj = result.rows;
        for (i = 0; i < obj.length; i++) {
                   querydata.push(obj[i]);
                   //console.log(obj[i]);
        }
       // console.log(obj[1]);
       //console.log (res.json(querydata));
        retdata =
          res.json(querydata);
             })
    }

    ;
  });

  app.get('/dxrows', function (req, res, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Cache-Control', 'public, max-age=30');
    var id = req.query.id;
    var dxcall = req.query.dxcall;
    var de_cont = req.query.decont;
    var mode = req.query.mode;
    var decountry = req.query.decountry;
    client.query("SELECT * from cluster.dxrows where title =$1 and dxcall like $2 and de_continent =$3 and mode = $4 and decall_country like $5 order by insert_time desc limit 30", [id, dxcall.substring(0, 10), de_cont, mode,decountry], function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      var querydata = {};
      var data = []
      querydata.data = data;
      var obj = result.rows;
      for (i = 0; i < obj.length; i++) {
        querydata.data.push(obj[i]);
      }
      retdata =
        res.json(querydata);
    });
  });
}
)

var server = app.listen(54000, function (req, res) {
  var port = server.address().port
  console.log('Listening to ', port);
});

