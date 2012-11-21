function Interface()
{
  if ( arguments.callee._singletonInstance ){
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;

  this.id = World.register( this );

  this.cellsList = $('#cells');

  this.update = function()
  {
    var cells = World.familyTree,
    i, cell, node,
    toAppend = '';

    for( i in cells ){
      cell = cells[i];
      node = $('#cell'+cell.id);
      
      if( cell.alive ){
        modifier = cell.growth;
      } else {
        node.addClass('dead');
        continue;
      }

      if( node.length ){
        node.css('font-size', modifier+'px');
      } else {
        toAppend += '<li id="cell'+cell.id+'" style="font-size:'+modifier+'px"></li>';
      }
    }

    this.cellsList.append( toAppend );
  };
};