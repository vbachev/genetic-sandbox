// handles object coordination and synchronisation
// implements simple pub/sub observer pattern
var world = 
{
  speed : 1000,  // delay in ms between beats
  brake : true,     // will stop heartbeat at next beat
  heartbeatHandle : '', // holds reference to the timeout function
  
  // if true heartbeat will use speed to delay execution; 
  // if false consecutive beats will execute as soon as the previous one is finished
  async : false, 

  subscribers : [], // holds all subscribers

  // starts heartbeat
  start : function()
  {
    world.brake = false;
    world.heartbeat();
  },

  // stops hartbeat. brake flag will stop the next beat execution
  stop : function()
  {
    this.brake = true;
  },

  // handles the continuous beating
  // since it is asynchronously called it loses its scope and 
  // must use <world> instead of <this>
  heartbeat : function()
  {
    if( world.brake ){
      return false;
    }

    world.beat();

    if( world.async ){
      // we use settimeout instead of setinterval so very short intervals are handled better 
      // + the ability to change beatDelay in realtime
      clearTimeout( world.heartbeatHandle );
      world.heartbeatHandle = setTimeout(
        world.heartbeat,
        world.speed
      );
    } else {
      // start next beat immediately
      world.heartbeat();
    }
  },

  // handles publishing the beat event and updating all subscribers
  beat : function()
  {
    var subs = this.subscribers,
    l = subs.length,
    subscriber,
    i;

    for( i = 0; i < l; i++){ 
      subscriber = subs[i];
      if( subscriber && subscriber.update ){
        subscriber.update();
      }
    }
  },

  // subscribe object for beat updates and return global id
  register : function( a_object )
  {
    this.subscribers.push( a_object );
    return _.uniqueId();
  },

  // unsubscribe
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