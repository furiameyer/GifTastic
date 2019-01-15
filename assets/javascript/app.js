// VARIABLES
/////////////////////////////////////////////////////////////////////

// Initial array of animals
var animals = ["Lion", "Zebra", "Kangaroo", "Rhino"];

// Number of records to pull
var limit = 10;

// Customized API Key
var APIKey = "uzlmBCX0wk1KITLDEsKL30BaVSPmiD2K"

//Sample URL Format (for reference only)
// https://api.giphy.com/v1/gifs/search?api_key=&q=animal&limit=10&offset=&rating=G&lang=en

// FUNCTIONS
/////////////////////////////////////////////////////////////////////

// Animate and freeze Gifs
$(document).on("click", ".gif", function() {
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });

// displayAnimalInfo function re-renders the HTML to display the appropriate content
function displayAnimalInfo() {
  $("#animals-view").empty();

  var animal = $(this).attr("data-name");
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + APIKey + "&q=" + animal + "&limit=" + limit + "&rating=G";

  // Creating an AJAX call for the specific animal button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    // Initiating loop to generate images in contained in response object
    for (var i=0; i<response.data.length; i++) {

      // Creating a div to contain the images and their respecte information
      var animalDiv = $('<div class="animal card">');

      // Retrieving the URLs for the image
      var imgURLStill = response.data[i].images.fixed_height_small_still.url;
      var imgURLAnimate = response.data[i].images.fixed_height_small.url;

      // Creating an element to hold the image
      var image = $("<img>").attr("src", imgURLStill);
      image.addClass("gif card-img-top")
      image.attr("data-still", imgURLStill);
      image.attr("data-animate", imgURLAnimate);
      image.attr("data-state", "still");

      // Appending the image to the div
      animalDiv.append(image);

      // Creating div to hold card body
      var cardBody = $('<div class="card-body">');
      
      // Sourcing rating info and appending to div
      var gifRating = response.data[i].rating;
      var gifRATING = gifRating.toUpperCase();
      var pOne = $("<p>").text("Rating: " + gifRATING);
      pOne.addClass("card-text")
      cardBody.append(pOne);

      animalDiv.append(cardBody);

      // appending div to animal-view content ID in HTML
      $("#animals-view").append(animalDiv);
    };
  });
};

// Function for displaying animal buttons
function renderButtons() {
  $("#buttons-view").empty();
  for (var i = 0; i < animals.length; i++) {
    var a = $("<button>");
    a.addClass("btn btn-primary animal-btn mr-1 mb-1");
    a.attr("data-name", animals[i]);
    a.attr("type", "button");
    a.text(animals[i]);
    $("#buttons-view").append(a);
  };
};

// This function grabs new animal from the input box and generates new button
$("#add-animal").on("click", function(event) {
  event.preventDefault();
  var animal = $("#animal-input").val().trim();
  animals.push(animal);
  $("#animals-input").value = "";

  // Calling renderButtons which handles the processing of our animals array
  renderButtons();
});

// Adding a click event listener to all elements with a class of "animal-btn"
$(document).on("click", ".animal-btn", displayAnimalInfo);

// Calling the renderButtons function to display the intial buttons
renderButtons();