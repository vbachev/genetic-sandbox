// handles cell statistics and coordination
var cellManager = 
{
  initialize : function()
  {
    // subscribe to beat update event
    this.id = world.register( this );
  },

  // will hold information for all cells
  registry : [], 

  // record reference to cells
  register : function( a_cell )
  {
    this.registry.push( a_cell );
  },
  
  update : function()
  {
    return false;
  }
};