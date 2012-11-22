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
  this.food   = a_config.food ? a_config.food : 0;

  this.maturity   = 10; // at what growth is it capable of reproducing
};

// UPDATE
// receive world event to update cell state
Cell.prototype.update = function()
{
  if( !this.alive ){
    return false;
  }

  // get environment data
  var conditions = environment.getConditions();

  // execute cell inner processes
  this.feed( conditions );
  this.reproduce( conditions );
  this.live();
};

// LIVE
// implements cost of sustaining life
Cell.prototype.live = function()
{
  if( !this.alive ){
    return false;
  }

  // consume own food to grow and heal or starve when out of food
  if( this.food > 0 ){
    this.food -= 1;
    if( this.health < 100 ){
      // heal
      this.health += 10;
    } else {
      // grow
      this.growth += 1;
    }
  } else {
    // starve
    this.health -= 10;
  }

  // if cell survives this turn it ages or dies otherwise
  if( this.health > 0 ){
    // age
    this.age += 1;
    //console.log('cell '+this.id+' aged to '+this.age+' with health at '+this.health+', growth at '+this.growth+', food at '+this.food);
  } else {
    this.die( 'cell '+this.id+' died at age '+this.age );
  }
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
  var heritage = {
    parentId   : this.id,
    generation : this.generation + 1,
    food       : Math.floor( this.food / 2 ),
    growth     : Math.floor( this.growth / 2 )
  }

  // create two new cells inheriting half of their parent's stats
  var daughterA = new Cell( heritage );
  var daughterB = new Cell( heritage );

  // kill parent
  this.die( 'cell '+this.id+' divided into cells '+daughterA.id+' and '+daughterB.id );
};