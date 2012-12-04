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
  
  // starts or stops the world heartbeat
  pause : function()
  {
    if( world.brake )
    {
      // start game
      $('#startButton').addClass('active');
      this.stats.duration = new Date();

      // use a delay to alow DOM manipulations to happen before the game starts
      setTimeout( world.start, 100 );
    } 
    else 
    {
      // stop game
      this.stats.duration = new Date() - this.stats.duration;
      world.stop();
      $('#startButton').removeClass('active');
    }
  },
  
  // what fields to show in controls
  stats : {
    duration  : 0,
    cells     : 0,
    elapsed   : 0,
    food      : 0
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
  
  // stop imediate execution when these are reached
  populationLimit : 10000,
  stepsLimit      : 5000,
  
  // at each beat go through all cells and draw them
  update : function()
  {
    var i, environmentStats;
    
    this.stats.elapsed++;
    
    if( !world.async ){
      // run cycles without drawing to increase speed and avoid needles DOM manipulation
      if( this.stats.elapsed < this.stepsLimit && cellManager.registry.length < this.populationLimit ){
        return false;
      }
    
      // stop heartbeat after limits are reached and draw cells
      this.pause();
    }
  
    // represent cells state
    this.drawTree();

    // represent changes in environment
    this.stats.environment = '';
    environmentStats = environment.getConditions();
    for( i in environmentStats ){
      this.stats.environment += i+': '+environmentStats[i]+'<br/>'
    }

    $('.message-box .step').text( this.stats.elapsed );
    $('.message-box .cells').text( this.stats.cells );
    $('.message-box .environment').html( this.stats.environment );

    // update profile for watched cell
    if( this.watched ){
      uiManager.populateProfile( cellManager.getCell( this.watched ));
    }
  },

  // loop through cells and represent generations on screen
  drawTree : function ()
  {
    var cells = cellManager.registry,
    i, cell, node,
    modifier = 5;

    $('.newborn').removeClass('newborn');
    this.stats.cells = 0;

    for( i in cells ){
      cell = cells[i];
      node = $('#cell'+cell.id);
      
      // in normal conditions draw live cells and skip dead ones
      // when cycles are executed imediately drawing happens only once at the end so no cells should be skipped
      if( cell.alive || !world.async ){
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
        
        $('#cell'+cell.parentId).append('<div id="cell'+cell.id+'" title="'+cell.id+'" class="newborn '+(cell.alive ? '' : 'dead')+'" style="font-size:'+modifier+'px;"></div>');
      }
    }
  },
  
  // bind click and delegate function to receive click on cells and display their profiles
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
  
  // initially creates html profile fields at page load
  setProfileFields : function()
  {
    var dummyCell = new Cell(),
    profileHtml = '<ul>', 
    i;

    for( i in this.cellStats ){
      profileHtml += '<li class="'+i+'"><label>'+this.cellStats[i]+':</label> <span>---</span></li>'
    }
    profileHtml += '<li class="genes"><label>Genes:</label> <span>---</span></li>'

    $('.profile .stats').html( profileHtml+'</ul>' );
    dummyCell.die();
    this.watched = 1;
  },

  // displays cell profile information from cell object
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