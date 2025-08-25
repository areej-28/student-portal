//for all the pages

$(function(){
  function adjust(){
    var nh=$('.navbar.fixed-top').outerHeight()||0;
    var fh=$('footer.fixed-bottom').outerHeight()||0;
    $('body').css('padding-top',nh+'px').css('padding-bottom',fh+'px');
  }
  adjust(); $(window).on('resize',adjust);
});

