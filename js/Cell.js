// class describing a single cell 
function Cell ( a_config ) 
{
  // subscribe for beat updates and get cell id
  this.id = world.register( this );
  
  // register cell in cellmanager so it is globally accessible
  cellManager.register( this );

  // default constructor configuration
  if( !a_config ){
    a_config = {};
  }

  this.alive      = true;
  this.age        = 0; // age (measured in the amount of world beats)
  this.generation = a_config.generation ? a_config.generation : 0;
  this.parentId   = a_config.parentId ? a_config.parentId : 0;
  
  // vital stats
  this.growth = a_config.growth ? a_config.growth : 1;
  this.health = 100; // like 100%
  this.energy = 0;
  this.food   = a_config.food ? a_config.food : 0;

  this.maturity   = 10; // at what growth is it capable of reproducing
  
  this.genes = a_config.genes ? a_config.genes : cellManager.getGeneSet();
};

// UPDATE
// receive world event to update cell state
Cell.prototype.update = function()
{
  if( this.alive ){
    // execute cell inner processes
    this.live();
  }
};

// LIVE
// implements cost of sustaining life
Cell.prototype.live = function()
{
  // get environment data
  var conditions = environment.getConditions();
  
  // gather food from environment
  this.feed( conditions );
  
  // if conditions and stats allow it - reproduce
  this.reproduce( conditions );
  
  // metabolism
  // consume own food to grow and heal or starve when out of food
    
  // catabolism - breakdown stored nutrients
  this.digest();

  // anabolism - grow and regenerate
  this.heal();
  this.grow();

  // if cell survives this cycle it ages or otherwise dies
  if( this.health > 0 ){
    // age
    this.age += 1;
    //console.log('cell '+this.id+' aged to '+this.age+' with health at '+this.health+', growth at '+this.growth+', food at '+this.food);
  } else {
    this.die( 'cell '+this.id+' died at age '+this.age );
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
  // @gene may affect food to energy ratio
  this.starve( toStarve );
  this.food   -= toBurn;
  this.energy += toBurn;
};

// HEAL
// use up any available energy to heal and regenerate
Cell.prototype.heal = function()
{
  // amount of health per unit of energy
  var healthAmount = 10;
  if( this.genes.regeneration ){
    healthAmount = this.genes.regeneration;
  }
  
  // use energy to heal until energy runs out or at full health
  while( this.energy > 0 && this.health < 100 )
  { 
     // @gene may affect health to energy ratio
     this.health += healthAmount;
     this.energy--;
  }
};

// GROW
// use energy to build and grow cell
Cell.prototype.grow = function()
{
  var toGrow = 1;
  if( this.genes.metabolism ){
    toGrow = this.genes.metabolism;
  }
  
  // cant grow more than theres energy available
  if( toGrow > this.energy ){
    // @gene may affect energy to growth ratio
    toGrow = this.energy;
  }
  
  this.growth += toGrow;
};

// STARVE
// when out of food autolysis breaks down cell tissue to sustain life
Cell.prototype.starve = function( a_amount )
{
  var toStarve = a_amount ? a_amount : 0,
  damage = 10;
  // @gene may affect damage=
  this.health -= toStarve * damage;
};

// DIE
// handles administrative tasks concerning cell death :)
Cell.prototype.die = function( a_message )
{
  this.alive = false;
  world.unregister( this.id );

  if( a_message ){
    //console.log( a_message );
  }
};

// FEED
// handles absorbing food from the environment
Cell.prototype.feed = function( a_conditions )
{
  var bite = 0; // how much food will the cell eat
  
  if( a_conditions.food > 0 ){
    // some simple way to make larger cells aquire more food from the environment
    // will be modified by genes
    bite = Math.floor( this.growth / 5 ) + 1;
    
    // bite cant be larger than food available
    if( bite > a_conditions.food ){
      bite = a_conditions.food;
    }
  }
  
  // apply bite to cell and environment
  environment.alter( 'food', (0 - bite) );
  this.food += bite;
};

// REPRODUCE
// check conditions and reproduce if possible
Cell.prototype.reproduce = function( a_conditions )
{
  var foodAvailable = a_conditions.food && a_conditions.food > 0 ? true : false;

  // check division conditions
  if( this.growth >= this.maturity && this.health > 50 && foodAvailable ){
    // divide
    this.divideCell();
  }
};

// DIVIDE
// handles division and stats inheritance
Cell.prototype.divideCell = function()
{
  var heritageA = {
    parentId   : this.id,
    generation : this.generation + 1,
    food       : Math.floor( this.food / 2 ),
    growth     : Math.floor( this.growth / 2 )
  },
  heritageB = heritageA;
  
  // mutations
  heritageA.genes = cellManager.mutateGenes( this.genes );
  heritageB.genes = cellManager.mutateGenes( this.genes );

  // create two new cells inheriting half of their parent's stats
  var daughterA = new Cell( heritageA );
  var daughterB = new Cell( heritageB );

  // kill parent
  this.die( 'cell '+this.id+' divided into cells '+daughterA.id+' and '+daughterB.id );
};