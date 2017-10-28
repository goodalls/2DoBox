

// EVENT LISTENERS

// card creation event listeners

$(window).on('load', function() {
  getIdeasFromStorage();
})

$('#save-button').on('click', function(event) {
  event.preventDefault();
  genCard();
  resetInputFields();
});

// card button event listeners

$('#card-section').on('click', '.card .delete', function(event) {
  event.preventDefault();
  deleteButton(this);
  var currentId = event.target.closest('.card').id
  localStorage.removeItem(currentId);
})

$('#card-section').on('click', '.card .downvote', function(event) {
  event.preventDefault();
  downvoteButton();
})

$('#card-section').on('click', '.card .upvote', function(event) {
  event.preventDefault();
  upvoteButton();
})

// edit card event listeners

$('#card-section').on('blur', '.card .title', function(event) {
  event.preventDefault();
  editCardTitle();
})

$('#card-section').keypress('.card .title', function(event) {
  if(event.keyCode === 13){
    event.preventDefault();
    editCardTitle();
  }
})

$('#card-section').on('blur', '.card .description', function(event) {
  event.preventDefault();
  editCardDescription();
})

$('#card-section').keypress('.card .description', function(event) {
  if(event.keyCode === 13){
    event.preventDefault();
    editCardDescription();
  }
})

// search event listeners

$('#search-input').keyup(searchFunction);

$('#search-input').keypress(function(event) {
  if(event.keyCode === 13) {
    event.preventDefault();
    $(this).blur();
  } 
});

// FUNCTIONS 

// create card function

function Idea(title, body, idNum, quality) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.quality = quality || 'swill';
}

function genCard(title, body) {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newIdea = new Idea(title, body, Date.now());
  prependIdea(newIdea);
  putIntoStorage(newIdea);
}

function putIntoStorage(object) {
  var stringIdea = JSON.stringify(object);
  localStorage.setItem(object['idNum'], stringIdea);
} 

function prependIdea(idea) {
  $('#card-section').prepend(`<article id="${idea['idNum']}" class="card">
      <form id="card-meta-data-form">
        <div id="card-title-container">
        <h2 contenteditable=true id="card-title" class="card-headings title">${idea['title']}</h2>
        <label for="delete-button">Delete</label>
        <button id="delete-button" class="small-grey-button delete" name="delete-button"></button>
        </div>
        <p contenteditable=true id="card-description" class="description">${idea['body']}</p>
        <div id="card-quality-container">
          <button id="up-vote-button" class="small-grey-button upvote" name="up-vote-button"></button>
          <button id="down-vote-button" class="small-grey-button downvote" name="down-vote-button"></button>
          <h3 id="quality-display-text" class="card-headings">quality : <span class="quality">${idea['quality']}</span></h3>
        </div>
      </form>
    </article>`);
}

function resetInputFields() {
  var $form = $('#user-input-form');
  $form[0].reset();
}

function getIdeasFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedIdea = JSON.parse(retrievedIdea);
    prependIdea(parsedIdea);
  }
}

// card button functions

function deleteButton(button) {
  button.closest('.card').remove();
}

function downvoteButton() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  if (parsedObject.quality === 'genius') {
    parsedObject.quality = 'plausible';
    $(`#${currentId} .quality`).text('plausible');
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'swill';
    $(`#${currentId} .quality`).text('swill');
  }
  putIntoStorage(parsedObject);
}

function upvoteButton() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  if( parsedObject.quality === 'swill') {
    parsedObject.quality = 'plausible';
    $(`#${currentId} .quality`).text('plausible');
  } else if (parsedObject.quality === 'plausible'){
    parsedObject.quality = 'genius';
    $(`#${currentId} .quality`).text('genius');
  }
  putIntoStorage(parsedObject);
}

// edit card functions

function editCardTitle() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  var newTitle = $(`#${currentId} .title`).text();
  parsedObject['title'] = newTitle;
  putIntoStorage(parsedObject);
}

function editCardDescription() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  var newDescription = $(`#${currentId} .description`).text();
  parsedObject['body'] = newDescription;
  putIntoStorage(parsedObject);
}

// search function

function searchFunction(event) {
  event.preventDefault();
  var searchText = $(this).val();
  var filteredText = searchText.toUpperCase();
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedIdea = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedIdea);
    var currentId = parsedObject['idNum'];
    if (parsedObject['title'].toUpperCase().includes(filteredText) || parsedObject['body'].toUpperCase().includes(filteredText)) {
      $(`#${currentId}`).css( "display", "" );
    } else {
      $(`#${currentId}`).css( "display", "none");
    }
  }
}
