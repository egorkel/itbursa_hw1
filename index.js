var ws = new WebSocket("ws://f2.smartjs.academy/ws");
var data = [];

function render() {

  var $invited = $('.invited');
  var $inHall = $('.in-hall');

  function renderItem(record) {
    var $item = $('<div class="item">').text(record.name)
        .data('id', record.id)
      ;

    if (!record.inHall) {
      $item.prepend($('<div class="delete"><a class="btn btn-danger" href="#" role="button"><span class="glyphicon glyphicon-remove"></span></a></div>'));
    }

    return $item;close
  }

  $invited.html('');
  $inHall.html('');

  _(data).filter('inHall').forEach(function (record) {
    $inHall.append(renderItem(record));
  });

  _(data).reject('inHall').forEach(function (record) {
    $invited.append(renderItem(record));
  });


}


$(function () {

  $.ajax('http://f2.smartjs.academy/list').then(function (dataFromServer) {
    data = dataFromServer;
    render();
  });

  render();

  $('.invited, .in-hall')
    .on('click', '.item', function () {

      var item = _.find(data, {id: $(this).data('id')});
      item.inHall = !item.inHall;
      ws.send(JSON.stringify({
        action: 'update',
        guest: item
      }));

      render();
    })
    .on('click', '.item .delete', function () {
      var id = $(this).parents('.item').data('id');
      data = _.reject(data, { id: id });

      ws.send(JSON.stringify({
        action: 'remove',
        id: id
      }));

      render();
      return false;
  });

  $('#addGuest').on('click', function(){
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    var valName = $('#name').val();

    var guest = {
      id: id,
      name: valName,
      inHall: false
    };

    data.push(guest);
    ws.send(JSON.stringify({
      action: 'add',
      guest: guest
    }));
    render();
    return false;
  });

});

ws.onmessage = function(evt){
  var addGuest = {
    id: JSON.parse(evt.data).guest.id,
    name: JSON.parse(evt.data).guest.name,
    inHall: JSON.parse(evt.data).guest.inHall
  };

  var removeGuest = JSON.parse(evt.data).remove.id;
  console.log(removeGuest);
  data.push(addGuest);

  render();
};




