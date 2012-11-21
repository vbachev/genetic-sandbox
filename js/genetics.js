/*cell = {
  stats : {
    age    : 0, // number of steps old
    size   : 0, // size, maturity, growth
    health : 0, // fitness, good shape, illness
    food   : 0  // used as building blocks and energy
  },
  processes : {
    live   : function(){}, // use food to sustain life
    heal   : function(){}, // use food to restore health
    grow   : function(){}, // use food to gain size
    divide : function(){}  // use food to divide
  },
  genes : {
    metabolism : 0, // food to size mod
    healing    : 0, // food to health mod
    efficiency : 0  // life sustainability mod
  }
};*/

$(document).ready(function(){
  Interface.initialize(); // bind interface to World and DOM
  new Cell();             // create first (Eve) cell
  World.start();          // start heartbeat
});