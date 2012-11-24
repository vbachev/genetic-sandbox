// handles display and DOM manipulation functionality
var uiManager =
{
  initialize : function(){
    // subscribe for beat updates
    this.id = world.register( this );
    
    // must initialize after document is ready to be able 
    // to detect this dom node
    this.cellsList = $('#cells');
    this.familyTree = $('#familyTree');
    this.bindCellClick();
  },
  
  pause : function()
  {
    if( world.brake ){
      // start game
      world.start();
      $('#startButton').addClass('active');
    } else {
      // stop game
      world.stop();
      $('#startButton').removeClass('active');
    }
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

    $('.newborn').removeClass('newborn');
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
        
        $('#cell'+cell.parentId).append('<div id="cell'+cell.id+'" title="'+cell.id+'" class="newborn" style="font-size:'+modifier+'px;"></div>');
      }
    }
    
    // add new items to list
    //this.cellsList.append( toAppend );
    //$('.dead').remove();

    this.stats.elapsed++;
    this.stats.environment = '';
    environmentStats = environment.getConditions();
    for( i in environmentStats ){
      this.stats.environment += i+': '+environmentStats[i]+'<br/>'
    }

    var message = 'step: '+this.stats.elapsed+'<br/>cells: '+this.stats.cells+'<br/>food: '+this.stats.food;
    $('.message-box .step').text( this.stats.elapsed );
    $('.message-box .cells').text( this.stats.cells );
    $('.message-box .environment').html( this.stats.environment );

    if( this.watched ){
      uiManager.populateProfile( cellManager.getCell( this.watched ));
    }
  },
  
  bindCellClick : function()
  {
    var target, 
    cellId, 
    cell;
  
    $('#family-tree').click(function(e){
      e.cancelBubble = true;
      e.stopPropagation();

      target = $(e.target);
      if( target.is('div') ){
        cellId = parseInt( target.attr('id').split('cell')[1] );
        cell = cellManager.getCell( cellId );
        uiManager.populateProfile( cell );
        uiManager.watched = cellId;

        $('#family-tree .selected').removeClass('selected');
        target.addClass('selected');
      }
    });
  },
  
  populateProfile : function( a_cell )
  {
    var message = 'Cell profile:',
    adminStats = {
      'id'          : 'ID',
      'parentId'    : 'Parent',
      'generation'  : 'Generation',
      'age'         : 'Age'
    },
    lifeStats = {
      'alive'       : 'Alive',
      'growth'      : 'Growth',
      'maturity'    : 'Maturity',
      'energy'      : 'Energy',
      'food'        : 'Food',
      'health'      : 'Health'
    };
    
    // cell properties
    message += '<ul class="adminStats">';
    for( i in adminStats ){
      message += '<li><dt>'+adminStats[i]+'</dt><dd>'+a_cell[i]+'</dd></li>';
    }
    message += '</ul>';
    
    message += '<ul class="lifeStats">';
    for( i in lifeStats ){
      message += '<li><dt>'+lifeStats[i]+'</dt><dd>'+a_cell[i]+'</dd></li>';
    }
    message += '</ul>';
    
    message += '<ul class="genes">';
    // cell genes
    for( i in a_cell.genes ){
      message += '<li><dt>'+i+'</dt><dd>'+a_cell.genes[i]+'</dd></li>';
    }
    message += '</ul>';
    
    $('.profile').html(message);
  }
};