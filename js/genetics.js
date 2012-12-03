$(document).ready(
  function()
  {
    // initialization for global objects
    uiManager.initialize();   // bind interface to World and DOM
    cellManager.initialize(); // bind cellmanager to World
    environment.initialize();
    //new Species();
    new Cell();               // create first (Eve) cell
  }
);