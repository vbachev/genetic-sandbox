// kind of a singleton
var World = (function () 
{
  var world = 
  {
    beatSpeed : 500,
    handbrake : true, // will stop heartbeat at next beat

    idPointer : 0,
    beatSubscribers : [], // holds all subscribers
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

      for( i in this.beatSubscribers ){
        subscriber = this.beatSubscribers[i];
        if( subscriber.update ){
          subscriber.update();
        }
      }
    },

    // subscribe object for beat updates
    register : function( a_object )
    {
      this.beatSubscribers.push( a_object );
      this.idPointer++;
      return this.idPointer;
    },

    unregister : function( a_id )
    {
      var i, 
      subscriber;

      for( i in this.beatSubscribers ){
        subscriber = this.beatSubscribers[i];
        if( a_id === subscriber.id ){
          // remove item from array
          this.beatSubscribers.splice( i, 1 );
          return true;
        }
      }
      
      return false;
    },

    recordNewCell : function( a_cell )
    {
      this.familyTree.push( a_cell );
    },

    // describes the environment - just a prototype
    getEnvironment : function()
    {
      return {
        food : 5,
        heat : 0
      };
    }

  };
  return world;
})();