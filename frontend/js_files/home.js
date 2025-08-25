// for contact page
$(function () {
  function adjustOffsets() {
    var nh = $('.navbar.fixed-top').outerHeight() || 0;
    var fh = $('footer.fixed-bottom').outerHeight() || 0;
    $('body').css('padding-top', nh + 'px');
    $('body').css('padding-bottom', fh + 'px');
  }
  adjustOffsets();
  $(window).on('resize', adjustOffsets);
});

$(function () {
  var ENDPOINT = "https://getform.io/f/bejervqa"; 

  var $form = $("#contactForm");
  var $alert = $("#alert");
  var $btn = $("#sendBtn");

  function showAlert(type, text) {
    $alert.removeClass("d-none alert-success alert-danger")
          .addClass(type === "ok" ? "alert-success" : "alert-danger")
          .text(text);
  }

  $form.on("submit", function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    var fd = new FormData(this);
    $btn.prop("disabled", true).text("Sending...");

    $.ajax({
      url: ENDPOINT,
      method: "POST",
      data: fd,
      processData: false,       
      contentType: false,       
      headers: { "Accept": "application/json" }
    })
    .done(function () {
      showAlert("ok", "Thanks! Your message was sent.");
      $form[0].reset();
    })
    .fail(function (xhr) {
      showAlert("err", "Could not send. Please try again.");
      console.log(xhr.responseText || xhr.statusText);
    })
    .always(function () {
      $btn.prop("disabled", false).text("Send Message");
    });
  });
});
