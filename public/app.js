// ==================  Home Tab - Render scraped articles ==================
$(document).on("click", "#home-tab", function() {

  $('#articles').empty();

  // Grab the articles as a json
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].saved === false) {
        // Display the apropos information on the page
        $("#articles").append(
          '<div class="card">' + 
            '<div class="card-body saved">' +
              data[i].title + "<br>" + data[i].author + 
              '<button type="button" class="btn btn-warning save-btn" data-id="' + data[i]._id + '" >Save</button>' +
            '<div>' +
          '<div>' 
        )
      }
    }
  });
});



// ==================  Saved Articles Tab - Render saved articles  ==================
$(document).on("click", "#saved-tab", function() {

  $('#articles').empty();

  // Grab the articles as a json
  $.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {

      if (data[i].saved === true) {

        // Display the apropos information on the page
        $("#articles").append(
          '<div class="card">' + 
            '<div class="card-body saved">' +
              data[i].title + "<br>" + data[i].author + 
              '<button type="button" class="btn btn-success save-btn" data-id="' + data[i]._id + '" >Unsave</button>' +
              '<button type="button" class="btn btn-info" data-toggle="modal"  data-target="#notesModal" data-id="' + data[i]._id + '" >Notes</button>' +
            '<div>' +
          '<div>' 
        )
      }
    }
  });

});


// ================== Scrape Tab - Scrape new articles ==================
$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function(data) {
    location.reload();
  });
});


// =============  Save - Unsave article ==================
$(document).on("click", ".save-btn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  //console.log(thisId);
  // console.log($(this).hasClass('btn-warning'))

  if ( $(this).hasClass('btn-warning') ) {

    // Run a POST request to update save status
    $.ajax({
      method: "POST",
      url: "/articles/add/" + thisId,
    }).done(function(data) {
        // Log the response
        console.log(data);
    });
    // change button color dynamically
    $(this).closest('.card').remove();

  } else if ( $(this).hasClass('btn-success') ){

    // Run a POST request to update save status
    $.ajax({
      method: "POST",
      url: "/articles/remove/" + thisId,
    }).done(function(data) {
        // Log the response
        console.log(data);
    });
    // change button color dynamically
    $(this).closest('.card').remove();
  } 

});

// ================== Render Notes ==================
$(document).on("click", ".btn-info", function() {

  $(".modal-body").empty();

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

    console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {

      //console.log(data.note.body)

      // The title of the article
      $(".modal-title").append("Title: " + data.title);

      if (data.note !== null ){
        // Existing Notes
        $(".modal-body").append(
          '<div class="card text-center" style="width: 100%;">' +
            '<div class="card-body">' +
              '<h5>' + data.note.body + '</h5>' +
              '<button type="button" class="btn btn-secondary" id="note-delete" data-id="' + data.note._id + '"> Delete </button>' +
            '</div>' +
          '</div>'
        );
      }

      // New Notes
      // A textarea to add a new note body
      $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");

      // A button to submit a new note, with the id of the article saved to it
      $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $(".modal-body").append("<button id='note-add'>Add Note</button>");

    });
});



// ================== Save Note ==================
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// ================== Add Note ==================
$(document).on("click", "#note-add", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/note/add/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});


// ================== Delete Note ==================
$(document).on("click", "#note-delete", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/note/delete/" + thisId,
  }).done(function(data) {
      // Log the response
      console.log(data);

      
      // Empty the notes section
      //$("#notes").empty();
    });

    // delete note in HTML

});



