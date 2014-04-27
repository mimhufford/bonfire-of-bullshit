var Facebook = (function()
{
    // "this"
    var my = {};

    // private vars
    var friends;
    var photos;
    var statuses;

    // public functions
    my.init = function()
    {
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
                BonfireOfBullshit.connected();
                getFriends();
                getPhotos();
                getStatuses();
            }
          });
        };

        // Load the SDK asynchronously
        (function(d){var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];if (d.getElementById(id)) {return;}js = d.createElement('script'); js.id = id; js.async = true;js.src = "//connect.facebook.net/en_US/all.js";ref.parentNode.insertBefore(js, ref);}(document));
    }

    my.getPhotosContaining = function(friendID)
    {
        var photosOfBoth = [];

        $.each(photos, function(index, photo)
        {
            $.each(photo.tags.data, function(index, tag)    // TODO tags paging?
            {
                if(tag.id === friendID)
                {
                    photosOfBoth.push(photo.source);
                    return false;
                }
            });
        });

        return photosOfBoth;
    }

    my.getStatusesContaining = function(friendID)
    {
        var statusesWithBoth = [];

        $.each(statuses, function(index, status)
        {
            if (status.from.id === friendID)
            {
                statusesWithBoth.push(status.message || status.story);
            }
            else if(status.with_tags)
            {
                $.each(status.with_tags.data, function(index, tagged)
                {
                    if (tagged.id === friendID)
                    {
                        statusesWithBoth.push(status.message || status.story)
                        return false;
                    }
                });
            }
        });

        return statusesWithBoth;
    }

    // private functions
    function getFriends()
    {
        getData('/me/friends', function(data)
        {
            friends = data;
            BonfireOfBullshit.populateSearch(friends);
        });
    }

    function getPhotos()
    {
        getData('/me/photos', function(data)
        {
            photos = data;
        });
    }

    function getStatuses()
    {
        getData('/me/tagged', function(data)
        {
            statuses = data;
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

    // return instance
    return my;
}());