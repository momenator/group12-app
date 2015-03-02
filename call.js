var unirest = require('unirest');
unirest.post("https://camfind.p.mashape.com/image_requests")
.header("X-Mashape-Key", "0PHOUEsrVsmsh4kV3i9X5FFqfof4p1maU5Vjsn62WwTuW8AIxn")
.header("Content-Type", "application/x-www-form-urlencoded")
.header("Accept", "application/json")
.send("focus[x]", "480")
.send("focus[y]", "640")
.send("image_request[altitude]", "27.912109375")
.send("image_request[language]", "en")
.send("image_request[latitude]", "35.8714220766008")
.send("image_request[locale]", "en_US")
.send("image_request[longitude]", "14.3583203002251")
.send("image_request[remote_image_url]", "http://upload.wikimedia.org/wikipedia/en/2/2d/Mashape_logo.png")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});
