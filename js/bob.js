var BonfireOfBullshit = (function()
{
	// "this"
	var my = {};

	// private vars
	var burnBtn = $("#burn");
	var searchCtrls = $("#search");

	// public functions
	my.init = function()
	{
		searchCtrls.toggle(false);	
		bindUIActions();
	}

	my.connected = function()
	{
		$("#login").toggle(false);
	}

	my.populateSearch = function(victims)
	{
		searchCtrls.toggle(true);
		searchCtrls.addClass("animated");
		searchCtrls.addClass("fade-in-down");


		// make a value property so autocomeplete works without a ton of modding
		$.each(victims, function(index, victim)
		{
			victim.value = victim.name;
		});

		$("#victim").autocomplete(
		{
			minLength: 3,	// limit to min 3 characters so it doesn't pop up a ton of results
			source: victims,
			select: function(event, ui)
			{
				$("#victim-id").val(ui.item.id);
				$("#victim").val(ui.item.value);
				return false;
			}
		});
	}

	my.startBonfire = function()
	{
		var victimID = $("#victim-id").val();

		var statuses = Facebook.getStatusesContaining(victimID);
		var photos = Facebook.getPhotosContaining(victimID);

		$("#friends").empty();

		$.each(statuses, function(index, status)
		{
			$("#friends").append(status + "<br/>");
		});

		$.each(photos, function(index, photo)
		{
			$("#friends").append("<img src='" + photo + "' />");
		});
	}

	// private functions
	function bindUIActions()
	{
		$("#burn").click(my.startBonfire);
	}

	// return instance
	return my;
}());