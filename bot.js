//imports
const discord = require('discord.js')
const request = require('request')
const querystring = require('querystring')

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
          const embed = new discord.RichEmbed()
            .setTitle(productJson.product.vendor + " - " + productJson.product.title + " Variants")
            .setColor(15428619)
          productJson.product.variants.forEach(function(variant) {
          console.log("Size: " + variant.title + " ID: " + variant.id)
          embed.addField(variant.title,variant.id,true)
          //message.channel.send("Size: " + variant.title + " ID: " + variant.id)
          });
          message.channel.send({embed});
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

stockxSearch = function(message, query){

  var headers = {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                  //'Accept-Encoding': 'gzip',
                  'Connection': 'keep-alive',
                  'X-Algolia-Application-Id': 'XW7SBCT9V6',
                  'X-Algolia-API-Key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3'
                }

  var postJson = {

    "params": "facets=%5B%22product_category%22%5D&filters=&hitsPerPage=20&query=" + encodeURI(query)

  }

  // Configure the request
  var options = {
      url:'https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query',
      method: 'POST',
      headers: headers,
      json: postJson
  }

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200 && body.hits[0] != null) {
          // Print out the response body
          console.log(body);
          //const responseJson = JSON.parse(body)
          message.channel.send({embed: {
          color: 3066993,
          url: "http://stockx.com/"+body.hits[0].url,
          title: "(stockX) "+body.hits[0].name,
          thumbnail:{
            url: body.hits[0].media.imageUrl
          },
          fields: [{
             name: "Highest Bid",
             value: body.hits[0].highest_bid,
             inline:true
           },{
             name: "Lowest ask",
             value:body.hits[0].lowest_ask,
             inline:true
           },
         {
           name: "Last Sale",
           value: body.hits[0].last_sale,
           inline:true
         },{
           name: "Sold in last 3 days",
           value: body.hits[0].sales_last_72,
           inline:true
         }],

         footer: {
          text: "Style Code: "+body.hits[0].style_id+" Release Date: "+body.hits[0].release_date
        }

        }});
      }
      else {
        console.log('could not connect')
        console.log(response.statusCode)
        message.channel.send("something went wrong OH CHRIST")
      }
  })

  return;
}

goatSearch = function(message, query){

  var headers = {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                  //'Accept-Encoding': 'gzip',
                  'Connection': 'keep-alive'
                }

  var postJson = {

    "params": "hitsPerPage=20&query=" + encodeURI(query)

  }

  // Configure the request
  var options = {
      url:'https://2fwotdvm2o-dsn.algolia.net/1/indexes/ProductTemplateSearch/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a',
      method: 'POST',
      headers: headers,
      json: postJson
  }

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200 && body.hits[0] != null) {
          // Print out the response body
          console.log(body);
          //const responseJson = JSON.parse(body)
          message.channel.send({embed: {
          color: 16777215,
          url: "http://goat.com/sneakers/"+body.hits[0].slug,
          title: "(GOAT) "+body.hits[0].name,
          thumbnail:{
            url: body.hits[0].picture_url
          },
          fields: [{
             name: "Lowest ask",
             value:body.hits[0].lowest_price_cents / 100,
             inline:true
           },
         {
           name: "Want",
           value: body.hits[0].want_count,
           inline:true
         },{
           name:"Want in last 3 days",
           value:body.hits[0].three_day_rolling_want_count,
           inline:true
         }],

         footer: {
          text: "Style Code: "+body.hits[0].search_sku+" Release Date: "+body.hits[0].release_date
        }

        }});
      }
      else {
        console.log('could not connect')
        console.log(response.statusCode)
        message.channel.send("something went wrong OH CHRIST")
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

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'stockx') {
  stockxSearch(message,args.join(" "))
  }
});

bot.on("message",(message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === 'goat') {
  goatSearch(message,args.join(" "))
  }
});

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`${member} JUST JOINED WADDUP`);
});


bot.login(config.token);
