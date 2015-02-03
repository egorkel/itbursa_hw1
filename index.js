var ws = new WebSocket("ws://f2.smartjs.academy/ws");
var data = [];

(function() {
  var app = angular.module("hw1App", []);

  app.controller("mainCtrl", ["$http", function ($http) {
    this.guests = [];
    var ctrl = this;
    $http.get("http://f2.smartjs.academy/list").
      success(function (data) {
        ctrl.guests = data;
      });

    this.move = function (guest) {
      guest.inHall = !guest.inHall;
    };

    this.del = function (guest) {
      this.guests = this.guests.filter(function (elem) {
        return elem.id !== guest.id;
      });
    };
  }]);
}());

//$(function () {
//    .on('click', '.item .delete', function () {
//      var id = $(this).parents('.item').data('id');
//      data = _.reject(data, { id: id });
//
//      ws.send(JSON.stringify({
//        action: 'remove',
//        id: id
//      }));
//
//      render();
//      return false;
//  });
//
//  $('#addGuest').on('click', function(){
//    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//      return v.toString(16);
//    });
//
//    var valName = $('#name').val();
//
//    var guest = {
//      id: id,
//      name: valName,
//      inHall: false
//    };
//
//    data.push(guest);
//    ws.send(JSON.stringify({
//      action: 'add',
//      guest: guest
//    }));
//    render();
//    return false;
//  });
//
//});

ws.onmessage = function(evt){
  var addGuest = {
    id: JSON.parse(evt.data).guest.id,
    name: JSON.parse(evt.data).guest.name,
    inHall: JSON.parse(evt.data).guest.inHall
  };

  var removeGuest = JSON.parse(evt.data).remove.id;
  console.log(removeGuest);
  data.push(addGuest);

  //render();
};




