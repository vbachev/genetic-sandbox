// handles object coordination and synchronisation
// implements simple pub/sub observer pattern
var World = 
{
  beatDelay : 500,  // world speed
  brake : true,     // will stop heartbeat at next beat

  idPointer : 0,
  subscribers : [], // holds all subscribers

  // starts heartbeat
  start : function()
  {
    console.log('world started');
    this.brake = false;
    this.heartbeat();
  },

  // stops hartbeat
  stop : function()
  {
    this.brake = true;
    console.log('world stopped');
  },

  // handles the continuous beating
  heartbeat : function(){
    if( World.brake ){
      return false;
    }

    World.beat();

    // settimeout instead of setinterval so very short intervals are handled better 
    // + the ability to change beatDelay in realtime
    setTimeout(
      World.heartbeat,
      World.beatDelay
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
      subscriber = this.subscribers[i];
      if( a_id === subscriber.id ){
        // remove item from array
        this.subscribers.splice( i, 1 );
        return true;
      }
    }
    
    return false;
  }
};