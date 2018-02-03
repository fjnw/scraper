// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p class='saved' data-toggle='modal' data-target='#notesModal' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].author + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p.saved", function() {

  // Empty the notes from the note section
  $(".modal-body").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);


      // The title of the article
      $(".modal-title").append("Title: " + data.title);

      // Existing Notes
      $(".modal-body").append(
        '<div class="card text-center" style="width: 100%;">' +
        '<div class="card-body">' +
          '<h5 class="card-title">REPLACE WITH EXISTING NOTES</h5>' +
        '</div>' +
      '</div>')


      // New Notes
      // A textarea to add a new note body
      $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");

      
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
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
