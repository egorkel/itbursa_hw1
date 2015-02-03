(function() {
  var app = angular.module("hw1App", []);

  app.controller("mainCtrl", ["$http", "$scope", function ($http, $scope) {
    this.guests = [];
    var ctrl = this;
    $http.get("http://f2.smartjs.academy/list").
      success(function (data) {
        ctrl.guests = data;
      });

    var ws = new WebSocket("ws://f2.smartjs.academy/ws");
    ws.onmessage = function(evt){
      switch (JSON.parse(evt.data).action)
      {
        case "add":
          var addGuest = {
            id: JSON.parse(evt.data).guest.id,
            name: JSON.parse(evt.data).guest.name,
            inHall: JSON.parse(evt.data).guest.inHall
          };
          ctrl.guests.push(addGuest);
          break;
        case "remove":
          ctrl.guests = ctrl.guests.filter(function (elem) {
            return elem.id !== JSON.parse(evt.data).id;
          });
          break;
        case "update":
          ctrl.guests.forEach(function (guest) {
            if (guest.id === JSON.parse(evt.data).guest.id) {
              guest.inHall = JSON.parse(evt.data).guest.inHall;
            }
          });
          break;
      }
      $scope.$apply();
    };

    this.move = function (guest) {
      guest.inHall = !guest.inHall;

      ws.send(JSON.stringify({
        action: 'update',
        guest: guest
      }));
    };

    this.del = function (guest) {
      this.guests = this.guests.filter(function (elem) {
        return elem.id !== guest.id;
      });

      ws.send(JSON.stringify({
        action: 'remove',
        id: guest.id
      }));
    };

    this.add = function (newName) {
      var newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });

      var guest = {
        id: newId,
        name: newName,
        inHall: false
      };

      this.guests.push(guest);

      ws.send(JSON.stringify({
        action: 'add',
        guest: guest
      }));
    };
  }]);
}());
