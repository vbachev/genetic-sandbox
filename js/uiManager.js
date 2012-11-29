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
    this.setProfileFields();
  },
  
  pause : function()
  {
    var playStart,
    playDuration;

    console.time('game');

    if( world.brake ){
      // start game
      $('#startButton').addClass('active');
      this.stats.duration = new Date();

      // use a delay to alow DOM manipulations to happen before the game starts
      setTimeout( world.start, 100 );
    } else {
      // stop game
      this.stats.duration = new Date() - this.stats.duration;
      world.stop();
      $('#startButton').removeClass('active');
      console.timeEnd('game');
    }
  },
  
  // what fields to show in controls
  stats : {
    duration : 0,
    cells : 0,
    elapsed : 0,
    food : 0
  },

  // what fields to show in profile
  cellStats : {
    'id'          : 'ID',
    'parentId'    : 'Parent',
    'children'    : 'Children',
    //'species'     : 'Species',
    'generation'  : 'Generation',
    'age'         : 'Age',
    'alive'       : 'Alive',
    'growth'      : 'Growth',
    'maturity'    : 'Maturity',
    'energy'      : 'Energy',
    'food'        : 'Food',
    'health'      : 'Health'
  },

  // at each beat go through all cells and draw them
  update : function()
  {
    if( this.stats.elapsed < 5000 && cellManager.registry.length < 10000 ){
      this.stats.elapsed++;
      return false;
    }
    this.pause();

    // represent cells state
    this.drawTree();

    // represent changes in environment
    this.stats.environment = '';
    environmentStats = environment.getConditions();
    for( i in environmentStats ){
      this.stats.environment += i+': '+environmentStats[i]+'<br/>'
    }

    // var message = 'step: '+this.stats.elapsed+'<br/>cells: '+this.stats.cells+'<br/>food: '+this.stats.food;
    $('.message-box .step').text( this.stats.elapsed );
    $('.message-box .cells').text( this.stats.cells );
    $('.message-box .environment').html( this.stats.environment );

    if( this.watched ){
      uiManager.populateProfile( cellManager.getCell( this.watched ));
    }
  },

  // loop through cells and represent generations on screen
  drawTree : function ()
  {
    var cells = cellManager.registry,
    i, cell, node,
    toAppend = '',
    modifier = 5,
    color;

    //$('.newborn').removeClass('newborn');
    this.stats.cells = 0;

    for( i in cells ){
      cell = cells[i];
      node = $('#cell'+cell.id);
      
      if( cell.alive ){
        // use the cell growth value as an indicator
        modifier = cell.growth;
        //color = (cellManager.getSpeciesById( cell.species )).color;

        this.stats.cells++;
      } else {
        //node.addClass('dead');
        //continue;
      }
  
      // edit an existing node or create a new one
      // font-size will affect all css properties that use em units
      if( node.length ){
        node.css('font-size', modifier+'px');
      } else {
        //toAppend += '<li id="cell'+cell.id+'" style="font-size:'+modifier+'px"></li>';
        
        $('#cell'+cell.parentId).append('<div id="cell'+cell.id+'" title="'+cell.id+'" class="'+(cell.alive ? '' : 'dead')+'" style="font-size:'+modifier+'px;"></div>');
      }
    }

    // add new items to list
    //this.cellsList.append( toAppend );
    //$('.dead').remove();
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
        uiManager.watched = cellId+1;

        $('#family-tree .selected').removeClass('selected');
        target.addClass('selected');
      }
    });
  },
  
  setProfileFields : function()
  {
    var dummyCell = new Cell(),
    profileHtml = '<ul>';

    for( i in this.cellStats ){
      profileHtml += '<li class="'+i+'"><label>'+this.cellStats[i]+':</label> <span>---</span></li>'
    }
    profileHtml += '<li class="genes"><label>Genes:</label> <span>---</span></li>'

    $('.profile .stats').html( profileHtml+'</ul>' );
    dummyCell.die();
    this.watched = 1;
  },

  populateProfile : function( a_cell )
  {
    var i, 
    genesHtml = '',
    value = '---';
    
    for( i in this.cellStats ){
      value = a_cell[i] === undefined ? '---' : a_cell[i];

      if( typeof value === 'number' ){
        value = Math.round(value*100)/100;
      }

      $('.profile .'+i+' span').text( value );
    }

    for( i in a_cell.genes ){
      genesHtml += i+': '+Math.round(a_cell.genes[i]*100)/100+'<br/>';
    }

    $('.profile .genes span').html( genesHtml );
  }
};