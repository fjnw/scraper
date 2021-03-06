
//  ====================
//       AJAX Calls
//  ====================
//  1.  Home tab:  Render scraped articles
//  2.  Saved tab - Render saved articles 
//  3.  Scrape Tab - Scrape new articlesArticles (GET)
//  4.  Dump Tab - Dumps article/note data
//  5.  Article: Save/Unsave
//  6.  Notes: Render
//  7.  Notes: Add
//  8.  Notes: Delete

// ==================  1. Home Tab - Render scraped articles ==================
$(document).on("click", "#home-tab", function() {

  $('#articles').empty();

  $.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {
      if (data[i].saved === false) {
        $("#articles").append(
          '<div class="card">' +
            '<div class="card-body saved">' +
              '<strong>' + data[i].title + '</strong>' + 
              '<br>' + 
              '<i>' + data[i].author + '</i>' +
              '<div class="text-center btn-options">' +
                '<button type="button" class="btn btn-success save-btn" data-id="' + data[i]._id + '" >Save</button>' +
              '</div>' +
            '<div>' +
          '<div>'
        )
      }
    }

  });
});



// ==================  2. Saved tab - Render saved articles  ==================
$(document).on("click", "#saved-tab", function() {

  $('#articles').empty();

  $.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {

      if (data[i].saved === true) {

        $("#articles").append(
          '<div class="card">' +
            '<div class="card-body saved">' +
              '<strong>' + data[i].title + '</strong>' + 
              '<br>' + 
              '<i>' + data[i].author + '</i>' +
              '<div class="text-center btn-options">' +
                '<button type="button" class="btn btn-warning save-btn" data-id="' + data[i]._id + '" >Unsave</button>' +
                '<button type="button" class="btn btn-info" data-toggle="modal"  data-target="#notesModal" data-id="' + data[i]._id + '" >Notes</button>' +
              '</div>' +
            '<div>' +
          '<div>'
        )

      }
    }       
  });
});


// ================== 3. Scrape Tab - Scrape new articles ==================
$(document).on("click", "#scrape", function() {
  
  // clears articles & notes before scraping new
  // $.ajax({
  //   method: "DELETE",
  //   url: "/dump",
  // })
  
  // scrapes new articles
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function(data) {

    setTimeout(
      function() {
        $("#home-tab").click();
        $('#scrape').removeClass("active");
      }, 1000);
      
  });
});


// // =============  4. Dump Tab - Dumps article/note data  ==================
$(document).on("click", "#dump", function() {
  $.ajax({
    method: "DELETE",
    url: "/dump",
  })

  setTimeout(
    function() {
      $("#home-tab").click();
      $('#dump').removeClass("active");
    }, 1000);

});


// =============  5. Article: Save/Unsave  ==================
$(document).on("click", ".save-btn", function() {

  var thisId = $(this).attr("data-id");

  if ( $(this).hasClass('btn-success') ) {

    $.ajax({
      method: "POST",
      url: "/articles/add/" + thisId,
    }).done(function(data) {
        // console.log(data);
    });

    $(this).closest('.card').remove();

  } else if ( $(this).hasClass('btn-warning') ){

    $.ajax({
      method: "POST",
      url: "/articles/remove/" + thisId,
    }).done(function(data) {
      // console.log(data);
    });

    $(this).closest('.card').remove();

  }
});



// ================== 6. Notes: Render  ==================
var thisId;

$(document).on("click", ".btn-info", function() {

  thisId = $(this).attr("data-id");
  $(".modal-body").empty();

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).done(function(data) {

      $(".modal-title").append("Title: " + data.title);
      
      if (data.note.length > 0) {
        for (i=data.note.length-1; i>=0; i--) {
          $(".modal-body").append(
            '<div class="card note-card">' +
              '<div class="card-body">' +
                '<h5>' + data.note[i].body + '</h5>' +
                '<button type="button" class="btn btn-secondary" id="note-delete" data-id="' + data.note[i]._id + '"> Delete </button>' +
              '</div>' +
            '</div>'
          );
        }
      }

      $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".modal-body").append("<button class='btn btn-outline-primary btn-block' id='note-add' data-id=" + thisId + ">Add Note</button>");

    });
});


// ================== 7. Notes: Add  ==================
$(document).on("click", "#note-add", function() {

  thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/note/add/" + thisId,
    data: {
      body: $("#bodyinput").val()
    }
  }).done(function(data) {

    $('.modal-body').prepend(
      '<div class="card text-center note-card">' +
        '<div class="card-body">' +
          '<h5>' + data.body + '</h5>' +
          '<button type="button" class="btn btn-secondary" id="note-delete" data-id="' + data._id + '"> Delete </button>' +
        '</div>' +
      '</div>'
    )

  });

  $("#bodyinput").val("");

});


// ================== 8. Note: Delete ==================
$(document).on("click", "#note-delete", function() {

  thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/note/delete/" + thisId,
  })
  
  $(this).closest('.card').remove();

});



