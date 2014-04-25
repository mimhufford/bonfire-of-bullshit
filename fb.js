window.fbAsyncInit = function() {
  FB.init({
    appId      : '274830309223357',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  FB.Event.subscribe('auth.authResponseChange', function(response)
  {
    if (response.status === 'connected')
    {
      $("#login").remove(); 

      getFriendList();
    }
  });
};

// Load the SDK asynchronously
(function(d){var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];if (d.getElementById(id)) {return;}js = d.createElement('script'); js.id = id; js.async = true;js.src = "//connect.facebook.net/en_US/all.js";ref.parentNode.insertBefore(js, ref);}(document));


function getFriendList()
{
  getData('/me/friends', function(friends)
  {
    populateVictimSearch(friends);
  });
}


function doStuff(victimID) {
  var photosOfBoth = [];

  $("#friends").empty();

  // get photos
  getData('/me/photos', function(photos) {
    $.each(photos, function(index, photo)
    {
      $.each(photo.tags.data, function(index, tag)    // TODO tags paging?
      {
        if(tag.id == victimID)
        {
          $("#friends").append("<img src='" + photo.source + "' />");
          photosOfBoth.push(photo.source);
          return false;
        }
      });
    });
  });
}

function getData(path, callback)
{
  var photos = [];

  FB.api(path, function(response)
  {
    getPagedItems(photos, response, callback);
  });
}

function getPagedItems(data, response, callback)
{
  $.each(response.data, function(index, item)
  {
    data.push(item);
  });

  if (response.paging && response.paging.next)
  {
    $.getJSON(response.paging.next, function(response)
    {
      getPagedItems(data, response, callback);
    });
  }
  else
  {
    callback(data);
  } 
}