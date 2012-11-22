$(document).ready(
  function()
  {
    uiManager.initialize();   // bind interface to World and DOM
    cellManager.initialize(); // bind cellmanager to World
    environment.initialize();
    new Cell();               // create first (Eve) cell
    //World.start();            // start heartbeat
  }
);