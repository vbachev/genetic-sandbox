// class describing a single cell 
function Cell ( a_config ) 
{
  // default constructor configuration if cell has no parents
  if( !a_config ){
    a_config = {};
  }
  
  // register cell in cellmanager so it is globally accessible
  cellManager.register( this );
  
  // administrative properties
  this.id = world.register( this ); // subscribe for beat updates and get cell id
  this.parentId   = a_config.parentId   ? a_config.parentId   : 0;
  this.generation = a_config.generation ? a_config.generation : 0;
  this.age        = 0; // age (measured in the amount of world beats)
  
  // vital stats
  this.alive  = true;
  this.energy = 0; // used to power all inner processes. created by digesting food
  this.health = 100; // like 100%. will cause death if it reaches 0
  this.food   = a_config.food   ? a_config.food   : 0; // stored nutrients
  this.growth = a_config.growth ? a_config.growth : 1; // represents cell size
  this.genes  = a_config.genes  ? a_config.genes  : cellManager.getGeneSet(); // contains the cell's gene set in key-value pairs
  
  // @todo: heat, toxins
  
  // at what growth is it capable of reproducing
  this.maturity = 10 + ( this.genes.maturity ? this.genes.maturity : 0 );
};

// UPDATE
// receive world beat event to update cell state
Cell.prototype.update = function()
{
  if( this.alive ){
    // execute cell inner processes
    this.live();
  }
};

// LIVE
// run cell inner processes to sustain life and reproduce
Cell.prototype.live = function()
{
  // get environment data
  var conditions = environment.getConditions();
  
  // @todo: genes may affect inner process priorities
  
  // Intake
  // gather resources from environment
  this.feed( conditions );
  
  // Metabolism
  // consume own food to grow and heal or starve when out of food
  // - Catabolism - breakdown stored nutrients
  // - Anabolism - grow and regenerate
  this.digest();
  this.heal();
  this.grow();

  // Outtake
  // @todo: excess energy is lost as heat to the environment
  // @todo: throw away toxins from digestion into environment

  // Reproduction
  // after survival is ensured comes life continuation
  this.reproduce();
  
  // if cell survives this cycle it ages or otherwise dies
  if( this.health > 0 ){
    this.age += 1;
  } else {
    this.die( /*'cell '+this.id+' died at age '+this.age*/ );
  }
};

// DIGEST
// burn up stored nutrients to get energy
Cell.prototype.digest = function()
{
  var availableFood = this.food,
  toBurn   = 1,
  toStarve = 0;
  
  if( this.genes.metabolism ){
    toBurn = this.genes.metabolism;
  }
  
  // if not enough stored food the cell will digest its own tissue
  if( toBurn > availableFood ){
    toStarve = toBurn - availableFood;
    toBurn = availableFood;
  }
  
  // turn food or tissue to energy ( 1 to 1 for now )
  // @todo: gene may affect food to energy ratio
  this.starve( toStarve );
  this.food   -= toBurn;
  this.energy += toBurn;
  // @todo: generate heat and toxins as byproduct of digestion
};

// HEAL
// use up any available energy to heal and regenerate
Cell.prototype.heal = function()
{
  // amount of health per unit of energy modified by regeneration gene
  var healthAmount = 10;
  if( this.genes.regeneration ){
    healthAmount += this.genes.regeneration;
  }
  
  // use energy to heal until energy runs out or at full health
  while( this.energy > 0 && this.health < 100 )
  { 
     this.health += healthAmount;
     this.energy--;
  }
};

// GROW
// use energy to build and grow cell
Cell.prototype.grow = function()
{
  // growth stops after reaching maturity
  // @todo: wont this cause anomalies?
  if( this.growth >= this.maturity ){
    return false;
  }
  
  var toGrow = 1;
  
  // metabolism gene modifies growth rate
  if( this.genes.metabolism ){
    toGrow = this.genes.metabolism;
  }
  
  // cant grow more than theres energy available
  if( toGrow > this.energy ){
    toGrow = this.energy;
  }
  
  // grow at the expense of energy
  this.energy -= toGrow;
  this.growth += toGrow;
};

// STARVE
// when out of food autolysis breaks down cell tissue to sustain life
Cell.prototype.starve = function( a_amount )
{
  var toStarve = a_amount ? a_amount : 0,
  starveDamage = 10;
  
  // resilience gene lowers starve damage
  if( this.genes.resilience ){
    starveDamage -= this.genes.resilience;
  }
  
  this.health -= toStarve * starveDamage;
};

// DIE
// handles administrative tasks concerning cell death :)
Cell.prototype.die = function( a_message )
{
  this.alive = false;
  world.unregister( this.id );

  if( a_message ){
    console.log( a_message );
  }
};

// FEED
// handles absorbing food from the environment
Cell.prototype.feed = function( a_conditions )
{
  if( a_conditions.food < 1 ){
    return false;
  }
  
  var biteSize = 1; // how much food will the cell eat
  if( this.genes.gluttony ){
    biteSize = this.genes.gluttony;
  }
  
  // some simple way to make larger cells aquire more food from the environment
  biteSize += Math.floor( this.growth / 5 );

  // bite cant be larger than food available
  if( biteSize > a_conditions.food ){
    biteSize = a_conditions.food;
  }
  
  // apply bite to cell and to environment
  environment.alter( 'food', (0 - biteSize) );
  this.food += biteSize;
};

// REPRODUCE
// check conditions and reproduce if possible
Cell.prototype.reproduce = function()
{
  //var foodCost   = 4;
  var energyCost = 5;
  // @todo: gene may affect cost and efficiency of reproduction
  var foodAvailable   = true;//this.food >= foodCost;
  var energyAvailable = this.energy >= energyCost;

  // check division conditions
  if( this.growth >= this.maturity && this.health > 50 && foodAvailable && energyAvailable ){
    
    // pay the price for reproduction
    //this.food   -= foodCost;
    this.energy -= energyCost;
    
    // divide
    this.divideCell();
  }
};

// DIVIDE
// handles division, stats inheritance and "administrative tasks"
Cell.prototype.divideCell = function()
{
  var heritageA = {
    parentId   : this.id,
    generation : this.generation + 1,
    food       : Math.floor( this.food / 2 ),
    growth     : Math.floor( this.growth / 2 )
  },
  heritageB = heritageA;
  
  // inherit and mutate daughter genes
  heritageA.genes = cellManager.mutateGenes( this.genes );
  heritageB.genes = cellManager.mutateGenes( this.genes );

  // create two new cells inheriting half of their parent's stats
  var daughterA = new Cell( heritageA );
  var daughterB = new Cell( heritageB );

  // save a reference to children and kill cell
  this.children = [ daughterA.id, daughterB.id ];
  this.die( /*'cell '+this.id+' divided into cells '+daughterA.id+' and '+daughterB.id*/ );
};