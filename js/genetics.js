$(document).ready(
  function()
  {
    uiManager.initialize();   // bind interface to World and DOM
    cellManager.initialize(); // bind cellmanager to World
    environment.initialize();
    new Species();
    new Cell();               // create first (Eve) cell

    world.speed = 0;
    //world.unregister(uiManager.id);
  }
);
 
 
var life = [];
var species = [{h:0,l:0}];
var currentSpecie = 0;

function play( a )
{
  for(var i = 0; i < a; i++)
  { 
    console.log('step', i);
    life.push({ 
      val : randmo, 
      sp : currentSpecie 
    });
    detectSpecies();
  }
}

function detectSpecies(){
  var i, j, k, 
  max, 
  min, 
  mid,
  len = life.length, 
  span = 10,
  units = [];
  
  console.log('num of spec', species.length);
  
  for(i = 0; i< species.length; i++)
  {
    units = getLifeBySpecies( i );
    max = min = units[0].val;
    
    for( j = 0; j<units.length; j++){
      max = Math.max(units[j].val, max);
      min = Math.min(units[j].val, min);
    }
    
    if( max - min > span ){
      mid = Math.floor((max + min)/2);
      species.push({h:max,l:mid});
      currentSpecie = species.length-1;
      species[currentSpecie-1].h=mid;
      console.log('created specie '+currentSpecie);
      for( k = 0; k<units.length; k++ ){
        if(units[k].val > mid){
          units[k].sp = currentSpecie;
        }
      }
    }
  }
  
}

function getLifeBySpecies( a ){
  var result = [],
  i;
  
  for( i in life ){
    if( life[i].sp === a ){
      result.push(life[i]);
    }
  }
  
  return result;
}

