var querystring = require('querystring');
var https = require('https');


var apiKey = '03247e3243346fde40e43e8f337a6a3f';
var util = require('util');

function performRequest(host, endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  console.log('REQ : ' + host + endpoint);
  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log('* OK End');

      var responseObject = JSON.parse(responseString);
      // console.log(util.inspect(responseObject, {showHidden: false, depth: null}));

      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

Date.prototype.yymmdd = function() {
  //var yr = this.getYear() - 100;
  var yr = this.getFullYear();
  var mm = this.getMonth() + 1;
  var dd = this.getDate()-1;

  console.log('year : ' + yr);

  return [yr, !mm[1] && '0', mm, !dd[1] && '0', dd].join('');
}


function prettify(data) {
  var overall = data.boxOfficeResult;
  var list = overall.dailyBoxOfficeList;
  console.log("-------------------------");
  
  console.log("Title : " + overall.boxofficeType);
  console.log("Date : " + overall.showRange);
  
  for (var i=0; i < list.length; i++) {
    console.log(list[i].rank, list[i].movieNm);
  }

  console.log("-------------------------");
}

function prettify2(data) {
  var channel = data.channel;
  console.log("-------------------------");
  
  console.log("Title : " + channel.title);
  console.log("result : " + channel.result);
  console.log("query string : " + channel.q);

  var list = channel.item;
  
  for (var i=0; i < list.length; i++) {
    console.log("Thumbnail : " + list[i].thumbnail[0].content);
    console.log("Story : " + list[i].story[0].content);
  }

  console.log("-------------------------");
}

function getDailyBoxOffice() {
  var host = 'www.kobis.or.kr';
  var today = new Date();
  console.log('today is ' + today.yymmdd());
  performRequest(host, '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json', 
    'GET', 
    {
      key : apiKey,
      targetDt : today.yymmdd()
    }, function(data) {
      // console.log('Fetched ' + data);
      prettify(data);
  });
}

function getMovieInfoByName(name) {
  var host = 'apis.daum.net';
  var daumKey = '1897b74982e1e8f01c2848ebe4a94cce';
  performRequest(host, '/contents/movie', 
    'GET', 
    {
      apiKey : daumKey,
      q : name,
      output : 'json'
    }, function(data) {
      // console.log('Fetched ' + data);
      prettify2(data);
  });
}

getDailyBoxOffice();
getMovieInfoByName('부산행');