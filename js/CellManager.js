// handles cell statistics and coordination
var CellManager = 
{
  initialize : function()
  {
    // subscribe to beat update event
    this.id = World.register( this );
  },

  // will hold information for all cells
  registry : [], 

  // record reference to cells
  register : function( a_cell )
  {
    this.registry.push( a_cell );
  },

  // environmental data and life conditions
  environment : {
    food : 10,
    heat : 0
  },
  
  // describes the environment - just a prototype
  getEnvironment : function()
  {
    return this.environment;
  },
  
  consumeFood : function( a_biteSize )
  {
    this.environment.food -= parseInt(a_biteSize);
    if( this.environment.food < 0 ){
      this.environment.food = 0;
    }
  },
  
  update : function()
  {
    // regenerate food (8 to 12)
    this.environment.food += 8 + Math.ceil(Math.random()*10/3);
  }
};