var userFeed = new Instafeed({
		get: 'user',
        tagName: 'awesome',
        userId: 'prakash_natural_',
		target: "instafeed-container",
    	resolution: 'standard_resolution',
        limit: 6,
        sortBy: 'most-recent',
        debug: false,
        template: '<a href="{{link}}"><img title="{{caption}}" src="{{image}}" /><div class="image__overlay"><div class="image__title">{{caption}}</div></a>',
		accessToken: 'IGQVJXSGJNRVlmeFIwbjVFZA0dnelNVZAzhFM1liNUhPR1lldHZAZAT0Y2TFBILUdkdlhZAM0tzVF9Fb3MzVXJwZA3ZAoWG1hUmh1ZAnRlNkl0WXZAQd1k3akpEcl8zOWxqUzlQWnFkb3hPTFliYWNhYlZAoVkRtVwZDZD'
	});
   
userFeed.run();
	

// testeo instafeed
// var feed = new Instafeed({

//     transform: function(item) { //Transform receives each item as its argument
//       // Over-write the original timestamp
//       item.timestamp = new Date(item.timestamp).toLocaleString('en-AU', {
//           weekday: 'long', 
//           year: 'numeric', 
//           month: 'long', 
//           day: 'numeric'
//         });
  
//       // return the modified item
//       return item;
//     }
// });
// feed.run();