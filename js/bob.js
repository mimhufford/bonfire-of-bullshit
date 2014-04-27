var BonfireOfBullshit = (function()
{
	// "this"
	var my = {};

	// private vars
	var allPhotos = [];
	var matchPhotos = [];

	// public functions
	my.init = function()
	{
		bindUIActions();
	}

	my.connected = function()
	{
		$("#login").toggle(false);
	}

	my.populateSearch = function(victims)
	{
		$("#search").toggle(true);

		var burnBtn = $("#burn");

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
		var photos = Facebook.getPhotosContaining($("#victim-id").val());

		$("#friends").empty();

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