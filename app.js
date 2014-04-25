$(function()
{
	$("#search").toggle(false);


	$("#burn").click(function()
	{
		burn($("#victim-id").val());
	});
});

// outside of document ready so that it exists straight away
function populateVictimSearch(victims)
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

function burn(victimID)
{
	doStuff(victimID);
}