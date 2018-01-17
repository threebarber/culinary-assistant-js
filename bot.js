//imports
const discord = require('discord.js')
const request = require('request')

//load config
const config = require("./config.json");
const prefix = config.prefix;

//inst bot
const bot = new discord.Client();

//functions

scrapeVariants = function(message, url){
  var headers = {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                  //'Accept-Encoding': 'gzip, deflate',
                  'Accept-Language': 'en-US,en;q=0.8',
                  'Connection': 'keep-alive',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0'
                }

  // Configure the request
  var options = {
      url: url + ".json",
      method: 'GET',
      headers: headers,
  }

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          const productJson = JSON.parse(body)
          console.log("Variants for " + productJson.product.title)
          productJson.product.variants.forEach(function(variant) {
          console.log("Size: " + variant.title + " ID: " + variant.id)
          message.channel.send("Size: " + variant.title + " ID: " + variant.id)
          });
      }
      else {
        console.log('could not connect')
      }
  })
  return;
}

anime = function(message, url){
  var headers = {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                  //'Accept-Encoding': 'gzip, deflate',
                  'Accept-Language': 'en-US,en;q=0.8',
                  'Connection': 'keep-alive',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0'
                }

  // Configure the request
  var options = {
      url: 'https://tv-v2.api-fetch.website/random/anime',
      method: 'GET',
      headers: headers,
  }

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          var responseJson = JSON.parse(body)
          console.log("Found anime " + responseJson.title)
          message.channel.send({embed: {
          color: 16716947,
          timestamp: new Date(),
          title: responseJson.title +"\n",
          color: 16716947,
          //description: "**"+message+"**",
          timestamp: new Date(),
          fields: [{
         name: "Year",
         value: responseJson.year
   },
   {
        name: "Genres",
        value: responseJson.genres.join(' ')
   },
   {
     name: "Seasons",
     value: responseJson.num_seasons
   },
 {
   name: "Rating",
   value: responseJson.rating.percentage +"/100"
 }]
        }});

      }
      else {
        console.log('could not connect')
      }
  })
  return;
}

gimmeProxy = function(message){

  var headers = {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                  //'Accept-Encoding': 'gzip, deflate',
                  'Accept-Language': 'en-US,en;q=0.8',
                  'Connection': 'keep-alive',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0'
                }

  // Configure the request
  var options = {
      url:'https://api.getproxylist.com/proxy',
      method: 'GET',
      headers: headers,
  }

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          const responseJson = JSON.parse(body)
          console.log("Grabbed proxy: "  + responseJson.ip + ":" + responseJson.port)
          message.channel.send("Grabbed proxy: " + responseJson.ip + ":" + responseJson.port + " protocol: " + responseJson.protocol)
      }
      else {
        console.log('could not connect')
      }
  })

  return;
}

balance = function(message, key){

    var headers = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    //'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0'
                  }

    // Configure the request
    var options = {
        url:'http://2captcha.com/res.php?key='+key+'&action=getbalance&json=1',
        method: 'GET',
        headers: headers,
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            if (body != 'ERROR_WRONG_USER_KEY'){
              const responseJson = JSON.parse(body)
              message.channel.send("2Captcha Balance: $"  + responseJson.request)
            }
            else{
              message.channel.send("Invalid Key :x:")
            }
        }
        else {
          console.log('could not connect')
        }
    })
  return;
}

bot.on('ready', () => {
    console.log("ready onii chan ^_^");
    bot.user.setGame("the bongo");
});

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'variants') {
  scrapeVariants(message, args[0])
  }
});

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'proxy') {
  gimmeProxy(message)
  }
});

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'anime') {
  anime(message)
  }
});

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'balance') {
  balance(message,args[0])
  }
});

bot.login(config.token);
