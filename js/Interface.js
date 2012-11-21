var Interface =
{
  // subscribe for beat updates
  id : World.register( this ),

  // must initialize after document is ready to be able 
  // to detect this dom node
  initialize : function(){
    this.cellsList = $('#cells');
  },
  
  // at each beat go through all cells and draw them
  update : function()
  {
    var cells = World.familyTree,
    i, cell, node,
    toAppend = '',
    modifier = 0;

    for( i in cells ){
      cell = cells[i];
      node = $('#cell'+cell.id);
      
      if( cell.alive ){
        // use the cell growth value as an indicator
        modifier = cell.growth;
      } else {
        node.addClass('dead');
        continue;
      }
  
      // edit an existing node or create a new one
      // font-size will affect all css properties that use em units
      if( node.length ){
        node.css('font-size', modifier+'px');
      } else {
        toAppend += '<li id="cell'+cell.id+'" style="font-size:'+modifier+'px"></li>';
      }
    },
    
    // add new items to list
    this.cellsList.append( toAppend );
  }
};