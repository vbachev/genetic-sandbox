// handles cell statistics and coordination
var cellManager = 
{
  initialize : function()
  {
    // subscribe to beat update event
    this.id = world.register( this );
  },

  // will hold information for all cells
  registry : [], 

  // record reference to cells
  register : function( a_cell )
  {
    this.registry.push( a_cell );
  },
  
  update : function()
  {
    return false;
  },
  
  getGeneSet : function()
  { 
    return { 
      metabolism : 1,
      regeneration : 10
      // others
    };
  },
  
  mutateGenes : function( a_genes )
  {
    var i, gene, newGenes = {};
    
    for( i in a_genes ){
      gene = a_genes[i];
      gene += Math.ceil(Math.random()*3) - 2; // (+1, 0 or -1)
      newGenes[ i ] = gene;
    }
    
    return newGenes;
  }
};