// handles display and DOM manipulation functionality
var interface =
{
  initialize : function(){
    // subscribe for beat updates
    this.id = world.register( this );
    
    // must initialize after document is ready to be able 
    // to detect this dom node
    this.cellsList = $('#cells');
    this.familyTree = $('#familyTree');
  },
  
  stats : {
    cells : 0,
    elapsed : 0,
    food : 0
  },

  // at each beat go through all cells and draw them
  update : function()
  {
    var cells = cellManager.registry,
    i, cell, node,
    toAppend = '',
    modifier = 0;

    this.stats.cells = 0;

    for( i in cells ){
      cell = cells[i];
      node = $('#cell'+cell.id);
      
      if( cell.alive ){
        // use the cell growth value as an indicator
        modifier = cell.growth;

        this.stats.cells++;
      } else {
        node.addClass('dead');
        continue;
      }
  
      // edit an existing node or create a new one
      // font-size will affect all css properties that use em units
      if( node.length ){
        node.css('font-size', modifier+'px');
      } else {
        //toAppend += '<li id="cell'+cell.id+'" style="font-size:'+modifier+'px"></li>';
        
        $('#cell'+cell.parentId).append('<div id="cell'+cell.id+'" style="font-size:'+modifier+'px"></div>');
      }
    }
    
    // add new items to list
    //this.cellsList.append( toAppend );
    //$('.dead').remove();

    this.stats.elapsed++;
    this.stats.food = environment.getConditions().food;

    var message = 'step: '+this.stats.elapsed+'<br/>cells: '+this.stats.cells+'<br/>food: '+this.stats.food;
    $('.message-box').html( message );
  }
};