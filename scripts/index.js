//TODO:
// 1. use the datatables selector plugin 
// 2. zoom to location/region on table click 
// 3. CSS !!!

function renderDeans(deans) {
  var template = document.getElementById('deans').innerHTML;
  var render = Handlebars.compile(template);
  return render(deans);
}

function renderChapterSocialMedia(social_media) {
  var template = document.getElementById('chapter_social_media').innerHTML;
  var render = Handlebars.compile(template);
  return render(social_media);
}

$(document).ready(function() {
  $.getJSON("scripts/chapterList.json", function(result){

    var table = $('#dataTable').DataTable( {
      "dom": "t",
      scroller: true,
      "scrollY": 300,
      "data": result,
      "sort": false,
      "columns": [
        { "title": "Country", "data": "country" },
        { "title": "City", "data": "city" },
        { "title": "Deans", "data": "deans", "render": renderDeans },
        { "title": "Social Media" , "data": "social_media", "render": renderChapterSocialMedia }
      ]
    });
 
    $('#searchBox').keyup(function() {
      table.search($(this).val()).draw();
    })
    var map = window['simplemaps_worldmap']; 

    $('#dataTable tbody')
     .on('mouseenter', 'tr', function () {
       var data = table.row(this).data();
       map.popup('location', data.id);
     })
    .on( 'click', 'tr', function () {
      var data = table.row(this).data();
      table.$('tr.selected').removeClass('selected');
      $(this).addClass('selected');
      map.popup('location', data.id);
    });

    simplemaps_worldmap.hooks.click_location = function(id) {
      table.$('tr.selected').removeClass('selected');
      var row = table.$('tr').eq(id);
      row.addClass('selected');
      table.row(id).scrollTo();
      map.popup('location', id);
    };
    
    function getLocations() {
      return _.map(table.data(), function(o) {
        var a = {};
        return {
          name: o.city,
          lat: o.lat,
          lng: o.lng,
          description: renderDeans(o.deans)
        };
      });
    }
    simplemaps_worldmap_mapdata.locations = getLocations();
    simplemaps_worldmap.refresh();
  });
});