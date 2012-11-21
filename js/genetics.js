$(document).ready(
  function()
  {
    Interface.initialize();   // bind interface to World and DOM
    CellManager.initialize(); // bind cellmanager to World
    new Cell();               // create first (Eve) cell
    //World.start();            // start heartbeat
  }
);