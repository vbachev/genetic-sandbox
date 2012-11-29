function Species( a_config )
{
  if( !a_config ){
    a_config = {};
  }
  
  this.id         = cellManager.registerSpecies( this );
  this.parentId   = a_config.parentId ? a_config.parentId : 0;
  this.name       = cellManager.getSpeciesName( a_config.name ? a_config.name : false );
  this.population = 0;

  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);

  this.diversity  = {
    genes    : {},
    overall  : 0,
    peak     : 0,
    peakGene : 0
  };
};

Species.prototype.update = function()
{
  if( this.population < 1 ){
    //return false;
  }
  // update population
  this.population = (cellManager.getCellsBySpecies( this.id, true )).length;
};

/* STILL UNFINISHED
  
  // will hold info for all species
  species  : [],
  speciesCounter : -1,
  diversityLimit : 5,

  registerSpecies : function( a_species )
  {
    world.register( a_species );
    this.species.push( a_species );
    

    this.speciesCounter++;
    console.log('new species', this.speciesCounter);
    return this.speciesCounter;
  },
  
  getSpeciesName : function ( a_name ) 
  {
    if( !a_name ){
      a_name = '';
    }
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return a_name + possible.charAt(Math.floor(Math.random() * possible.length));
  },
  
  getCellsBySpecies : function( a_id, a_alive )
  {
    var result = [],
    cell, 
    i;
    
    for( i in this.registry ){
      cell = this.registry[i];
      if( cell.species === a_id && ( !a_alive || ( a_alive && cell.alive ))){
        result.push( cell );
      }
    }
    
    return result;
  },

  getSpeciesById : function ( a_id )
  {
    var i;
    for( i in this.species ){
      if( this.species[i].id === a_id ){
        return this.species[i];
      }
    }
  },
  
  calculateDiversity : function()
  {
    var i, j, k, l, 
    currentSpecies, 
    currentCell,
    cells, 
    diversity,
    overallDiversity = 0,
    largestDiversity = 0,
    mostDiverseGene;

    // loop through species, get their cells, get their genes, calculate overall diversity
    for( i in this.species ){
      currentSpecies = this.species[i];
      if( currentSpecies.population < 1 ){
        continue;
      }

      cells = this.getCellsBySpecies( currentSpecies.id );
      
      diversity = { genes : {} };
      overallDiversity = 0;
      largestDiversity = 0;
      mostDiverseGene = '';

      for( j in cells ){
        currentCell = cells[j];

        for( k in currentCell.genes ){
          if( diversity.genes[k] === undefined ){
            diversity.genes[k] = { max : currentCell.genes[k], min : currentCell.genes[k] };
          }
          diversity.genes[k].max = Math.max(currentCell.genes[k], diversity.genes[k].max);
          diversity.genes[k].min = Math.min(currentCell.genes[k], diversity.genes[k].min);
        }
      }

      for( l in diversity.genes ){
        diversity.genes[l].difference = ((diversity.genes[l].max) - (diversity.genes[l].min))/this.getGeneByName(l).value;
        overallDiversity += diversity.genes[l].difference;
        
        if( largestDiversity < diversity.genes[l].difference ){
          mostDiverseGene = l;
          largestDiversity = diversity.genes[l].difference;
        }
      }
      diversity.overall  = overallDiversity;
      diversity.peak     = largestDiversity;
      diversity.peakGene = mostDiverseGene;

      // record in species instance
      this.species[i].diversity = diversity;
    }

    this.detectNewSpecies();
  },

  detectNewSpecies : function ()
  {
    var species = this.species,
    i,j,
    boundary,
    heritage,
    currentSpecies,
    speciesA,
    speciesB,
    cells;

    for( i in species ){
      currentSpecies = this.species[i];
      if( currentSpecies.population < 1 ){
        continue;
      }

      if( currentSpecies.diversity.overall > this.diversityLimit ){
        boundary = Math.ceil(currentSpecies.diversity.peak/2);
        heritage = {
          parentId : currentSpecies.id,
          name     : currentSpecies.name
        };

        speciesA = new Species( heritage );
        speciesB = new Species( heritage );

        currentSpecies.population = 0;
        cells = this.getCellsBySpecies( currentSpecies.id, true );
        for( j in cells ){
          if( cells[j].genes[ currentSpecies.diversity.peakGene ] && cells[j].genes[ currentSpecies.diversity.peakGene ] < boundary ){
            cells[j].species = speciesA.id;
          } else {
            cells[j].species = speciesB.id;
          }
        }
      }
    }
  }
  */