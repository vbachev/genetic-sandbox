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
    // @todo: categorize cells by generations and alive state
  },
  
  update : function()
  {
    return;
  },
  
  // return a cell by id
  getCell : function( a_id )
  {
    if( !a_id ){
      return {};
    }
    
    var i,
    cells = this.registry;
    
    if( a_id === 'first' ){
      return cells[0];
    }
    if( a_id === 'last' ){
      return cells[ cells.length - 1 ];
    }
    
    for( i in cells ){
      if( cells[i].id === a_id ){
        return cells[i];
      }
    }
    
    return {};
  },
  
  // defines all possible genes
  genePool : [
    { 
      name   : 'metabolism',
      info   : 'alters how fast nutrients are burned out; faster metabolism means more energy and faster development but also quicker death when starving',
      value  : 1,
      active : true
    },
    { 
      name   : 'regeneration',
      info   : 'alters healing speed by the amount of health regenerated for each unit of energy; biologically defined by the efficiency of organel regeneration',
      value  : 10,
      active : true
    },
    { 
      name   : 'gluttony',
      info   : 'modifies the amount of food a cell absorbs from the environment',
      value  : 1,
      active : true
    },
    { 
      name   : 'resilience',
      info   : 'modifies the amount of health lost when starving (higher values decrease health loss); biologically defined by the efficiency of autolysis (will the cell efficiently handle destroying needless tissue first)',
      value  : 10,
      active : true
    },
    { 
      name   : 'maturity',
      info   : 'modifies the growth amount at which the cell becomes mature and can reproduce',
      value  : 10,
      active : true
    }
  ],
  
  // returns a random set of genes
  generateGeneSet : function()
  { 
    var geneSet = {};
    // once for now
    this.addRandomGene( geneSet );
    return geneSet;
  },

  getGeneByName : function( a_name )
  {
    var i, 
    genes = this.genePool;
    
    for( i in genes ){
      if( genes[i].name === a_name ){
        return genes[i];
      }
    }

    return false;
  },
  
  // Pass some cell's genes and add a random one to them. If cell's gene count 
  // is close to the number of all genes chances of adding a new one will be 
  // very slim. The object passed is edited direclty
  addRandomGene : function( a_cellGenesObj )
  {
    var gene, 
    genePoolCount = this.genePool.length;
    
    // get random gene from gene pool
    gene = this.genePool[ Math.floor( Math.random() * genePoolCount ) ];

    // add gene if it is active and if is not present among cell's genes
    if( !a_cellGenesObj[ gene.name ] && gene.active ){
      a_cellGenesObj[ gene.name ] = gene.value;
    }
  },
  
  // receives a set of genes, loops through them and modifies their values slightly
  mutateGenes : function( a_genes )
  {
    var i, 
    gene, 
    modifier,
    newGenes = {};
    
    // loop through genes and alter them slightly
    for( i in a_genes ){
      gene = a_genes[i];
      modifier = 1+(Math.round(Math.random())*2-1)/10; // either 1.1 or 0.9
      gene = gene*modifier; // modify value by +/- 10%
      newGenes[ i ] = gene;
    }
    
    // add a new one
    this.addRandomGene( newGenes );
    
    return newGenes;
  }
};