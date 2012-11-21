// cell class
function Cell ( a_config ) 
{
  // subscribe for beat updates and get cell id
  this.id = World.register( this );
  World.recordNewCell( this ); // record in family tree :)

  // default constructor configuration
  if( !a_config ){
    a_config = {};
  }

  // vital stats
  this.alive  = true;
  this.age    = 0;
  this.growth = a_config.growth ? a_config.growth : 1;
  this.health = 100;
  this.food   = a_config.food ? a_config.food : 0;

  this.parentId = a_config.parentId ? a_config.parentId : 0
  this.maturity = 10;

  this.update = function()
  {
    if( !this.alive ){
      return false;
    }

    var environment = World.getEnvironment();

    this.feed( environment );
    this.reproduce( environment );
    this.live();
  };

  this.live = function()
  {
    if( !this.alive ){
      return false;
    }

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

    if( this.health > 0 ){
      // age
      this.age += 1;
      console.log('cell '+this.id+' aged to '+this.age+' with health at '+this.health+', growth at '+this.growth+', food at '+this.food);
    } else {
      this.die( 'cell '+this.id+' starved to death at age '+this.age );
    }
  };

  this.die = function( a_message )
  {
    this.alive = false;
    World.unregister( this.id );

    if( a_message ){
      console.log( a_message );
    }
  };

  this.feed = function( a_environment )
  {
    if( a_environment.food > 0 ){
      this.food += Math.floor( this.growth / 5 ) + 1;
    }
  };

  this.reproduce = function( a_environment )
  {
    foodAvailable = a_environment.food && a_environment.food > 0 ? true : false;

    // check division conditions
    if( this.growth >= this.maturity && this.health > 50 && foodAvailable ){
      // divide
      this.divideCell();
    }
  };

  this.divideCell = function()
  {
    var heritage = {
      parentId : this.id,
      food     : Math.floor( this.food / 2 ),
      growth   : Math.floor( this.growth / 2 )
    }

    // create two new cells inheriting half of their parent's stats
    var daughterA = new Cell( heritage );
    var daughterB = new Cell( heritage );

    // kill parent
    this.die( 'cell '+this.id+' divided into cells '+daughterA.id+' and '+daughterB.id );
  };
};