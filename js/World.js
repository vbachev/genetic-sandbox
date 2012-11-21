// kind of a singleton
var World = 
{
  beatSpeed : 500,
  handbrake : true, // will stop heartbeat at next beat

  idPointer : 0,
  subscribers : [], // holds all subscribers

  // will move to cell manager object
  familyTree : [], // will hold information on all cells

  // starts heartbeat
  start : function()
  {
    console.log('world started turning');
    this.handbrake = false;
    this.heartbeat();
  },

  // stops hartbeat
  stop : function()
  {
    this.handbrake = true;
    console.log('world stopped turning');
  },

  // handles the continuous beating
  heartbeat : function(){
    if( World.handbrake ){
      return false;
    }

    World.beat();

    setTimeout(
      World.heartbeat,
      World.beatSpeed
    );
  },

  // handles publishing the beat event and updating all subscribers
  beat : function()
  {
    var i, 
    subscriber;

    for( i in this.subscribers ){
      subscriber = this.subscribers[i];
      if( subscriber.update ){
        subscriber.update();
      }
    }
  },

  // subscribe object for beat updates and return global id
  register : function( a_object )
  {
    this.subscribers.push( a_object );

    this.idPointer++;
    return this.idPointer;
  },

  unregister : function( a_id )
  {
    var i, 
    subscriber;

    for( i in this.subscribers ){
      subscriber = subscribers[i];
      if( a_id === subscriber.id ){
        // remove item from array
        this.subscribers.splice( i, 1 );
        return true;
      }
    }
    
    return false;
  },

  // will move to cell manager object
  recordNewCell : function( a_cell )
  {
    this.familyTree.push( a_cell );
  },

  // will move to environment manager object
  // describes the environment - just a prototype
  getEnvironment : function()
  {
    return {
      food : 5,
      heat : 0
    };
  }
};