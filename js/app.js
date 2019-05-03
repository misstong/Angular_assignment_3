(function () {
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems',FoundItemsDirective)

  NarrowItDownController.$inject=["MenuSearchService"]
  function NarrowItDownController(MenuSearchService){
    var ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found = [];
    ctrl.clicked = false;
    ctrl.narrowDown = function(){
      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function(data){
        ctrl.found = data;
        ctrl.clicked = true;
      });
    };
    ctrl.remove = function(index){
      ctrl.found.splice(index,1);
    };


  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){
    var srv = this;

    srv.getMatchedMenuItems = function(searchTerm){
      return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json').then(function(result){
        var value = searchTerm.trim();
        var foundItems = [];
        if(value.length){
          var items = result.data.menu_items;
          for(var i = 0; i<items.length; i++){
            if(items[i].description.includes(value))
              foundItems.push(items[i]);
          }
        }
        return foundItems;
      });
    }
  }

  function FoundItemsDirective(){
    var ddo={
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        remove: '&'
      }
    }
    return ddo;
  }
})();
