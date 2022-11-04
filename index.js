var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

dotenv.config()
const app = express();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

var numRequests = 350,
cur = 0;
// var max = 7200000;     
// var min = 3600000;
var max = 200000;     
var min = 50000;

function getRandomArbitrary() {
    return (Math.random() * (max - min) + min).toFixed(0);
}    

function format(inputDate) {
    let date, month, year;
  
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
  
      date = date
          .toString()
          .padStart(2, '0');
  
      month = month
          .toString()
          .padStart(2, '0');
  
    return `${date}/${month}/${year}`;
  }

function scheduleRequest() {
    if (cur > numRequests) return;
    //get from user api
    var url = 'https://randomuser.me/api/?nat=FR';
    var request = require('request');
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var date = new Date(json.results[0].dob.date);
            var data = {
                name: json.results[0].name.first,
                firstname: json.results[0].name.last,
                mail: `${json.results[0].name.first}.${json.results[0].name.last}.${getRandomArbitrary()}@gmail.com`,
                profil_picture: json.results[0].picture.large,
                tel: json.results[0].phone,
                address: json.results[0].location.city + ', ' + json.results[0].location.country,
                password: "Dreamoove@34@500@",
                birth_date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                pseudo: json.results[0].login.username
            }
            console.log("User " + cur + " sur " + numRequests + " créé " + format(new Date()) + " à " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
            // try {
            //     request.post({
            //         headers: {'content-type' : 'application/json'},
            //         url:     process.env.USER_URL,
            //         body:    JSON.stringify(data)
            //     }, function(error, response, body){
            //         console.log(body);
            //         console.log("User " + cur + " sur " + numRequests + " créé " + format(new Date()) + " à " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
            //     });
            // }catch(e){
            //     console.log(e);
            // }
        }
    });

    cur++;
    setTimeout(scheduleRequest, getRandomArbitrary())
}
scheduleRequest();

app.listen(1000, () => {
    console.log('Server started on port 1000');
    }
);