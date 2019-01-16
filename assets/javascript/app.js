// VARIABLES
/////////////////////////////////////////////////////////////////////

// Number of maximum records to display
var limit = 100;

// Number of records to display in each pull
var eachPull = 10;

// Starting point for number of pulls
var displayCount = 0;

// Setup global variable
var dataPull;

// Store customized API Key
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

// Generating new animal data pull and storing into variable
function callGiphy () {
  
  // Clear DOM and reset displayCount before pulling to display new animal
  $("#animals-view").empty();
  displayCount=0;

  // Set paremeters of search
  var animal = $(this).attr("data-name");
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + APIKey + "&q=" + animal + "&limit=" + limit + "&rating=G";

  // Creating an AJAX call for the specific animal button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    dataPull = response;
    displayAnimalInfo();
  });
};

// displayAnimalInfo function renders the HTML with gifs and their respective information
function displayAnimalInfo() {

  // Clear previous call to display 10 more items (if any)
  $("#spinner").empty();

  // Keep count of number of requests for more images
  displayCount++
  
  // Initiating loop to generate images contained in response object
  for (var i=((displayCount-1)*10); i<displayCount*10; i++) {

    console.log(i);

    // Creating a div to contain the gifs and their respective information
    var animalDiv = $('<div class="animal card">');

    // Retrieving the URLs for the image
    var imgURLStill = dataPull.data[i].images.fixed_height_small_still.url;
    var imgURLAnimate = dataPull.data[i].images.fixed_height_small.url;

    // Creating an element to hold the image
    var image = $("<img>").attr("src", imgURLStill);
    image.addClass("gif card-img-top")
    image.attr("data-still", imgURLStill);
    image.attr("data-animate", imgURLAnimate);
    image.attr("data-state", "still");

    // Creating div to hold card body
    var cardBody = $('<div class="card-body">');
    
    // Sourcing rating info and appending to div
    var gifRating = dataPull.data[i].rating;
    var gifRATING = gifRating.toUpperCase();
    var pOne = $("<p>").text("Rating: " + gifRATING);
    pOne.addClass("card-text")
    cardBody.append(pOne);

    // Appending the image and cardbody to the div
    animalDiv.append(image,cardBody);

    // appending div to animal-view content ID in HTML
    $("#animals-view").append(animalDiv);
  };

  // Creating spinner to display more results at bottom of each data pull
  if (displayCount < 10) {
    var spinnerBox = $("<div>");
    spinnerBox.addClass("d-flex align-items-center text-success pt-2 pb-2 pr-5 pl-5 shadow-lg p-3 mb-5 bg-white rounded spinner-box");
    spinnerBox.text("Click to display 10 more Gifs...");

    var spinner = $("<div>");
    spinner.addClass("spinner-border ml-auto");

    spinnerBox.append(spinner);
    $("#spinner").append(spinnerBox);
  };  
};

// Function for displaying animal buttons
function renderButtons(animals) {
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

  // Calling renderButtons which handles the processing of our animals array
  renderButtons(animals);

  // Save the todos into localstorage.
  // We need to use JSON.stringify to turn the list from an array into a string
  localStorage.setItem("animals", JSON.stringify(animals));

  // Clear the textbox when done
  $("#animals-input").val("");
});

// MAIN
/////////////////////////////////////////////////////////////////////

// Adding a click event listener to all elements with a class of "animal-btn"
$(document).on("click", ".animal-btn", callGiphy);

// Adding a click event listener to all elements with a class of "spinner-box"
$(document).on("click", ".spinner-box", displayAnimalInfo);

// Load the animals from localstorage and display the intial buttons
// We need to use JSON.parse to turn the string retrieved from an array into a string
var animals = JSON.parse(localStorage.getItem("animals"));

// Checks to see if "animals" exists in localStorage and is an array currently
// If not, set animals variable to a starting array
// Otherwise list is our current list of animals
if (!Array.isArray(animals)) {
  animals = ["Lion", "Zebra", "Kangaroo", "Rhino", "Dog", "Cat", "Mouse"];
}

// render our animal buttons on page load
renderButtons(animals);