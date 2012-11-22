// manages the environmental conditions and interactions
var environment = 
{
  initialize : function()
  {
    // subscribe to beat update event
    this.id = world.register( this );
  },

  // environmental data and life conditions
  conditions : {
    food : 10, // amount of nutrition globally available
    heat : 15  // temperature in degrees by Celsium
  },
  
  // describes the environment - just a prototype
  getConditions : function()
  {
    return this.conditions;
  },
  
  // apply changes to the environment
  alter : function( a_property, a_impact )
  {
    var target = this.conditions[ a_property ];
    
    // apply effect
    if( target !== undefined ){
      target += parseInt( a_impact );
    }
    
    this.conditions[ a_property ] = target;
  },
  
  update : function()
  {
    // regenerate food (8 to 12)
    this.alter( 'food', 8 + Math.ceil(Math.random()*10/3));
  }
};