function Species( a_config )
{
  if( !a_config ){
    a_config = {};
  }
  
  this.id        = cellManager.registerSpecies( this );
  this.parentId  = a_config.parentId ? a_config.parentId : 0;
  this.name      = cellManager.getSpeciesName( a_config.name ? a_config.name : false );
}