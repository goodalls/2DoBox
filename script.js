

// EVENT LISTENERS

// card creation event listeners


$(window).on('load', getCardsFromStorage);


$('#description-input , #title-input').on('keyup', disableSaveButton);

function disableSaveButton() {
  if ($('#title-input').val() === "" || $('#description-input').val() === "") {
    $('#save-button').prop('disabled', true);
  } else {
    $('#save-button').prop('disabled', false);
  }
}

$('#save-button').on('click', saveButtonClick);

function saveButtonClick (event) {
  event.preventDefault();
  captureUserInput();
  resetInputFields();
  disableSaveButton();
}



function deleteButtonClick (event) {
  var currentId = event.target.closest('.card').id;
  if (event.target.closest('.delete')){
  event.target.closest('article').remove();
  localStorage.removeItem(currentId);
  }
}

function completedButtonClick(event) {
  var currentId = event.target.closest('.card').id;
  if (event.target.closest('.completed-card-button') && $(`#${currentId}`).hasClass('completed')) {
      $(`#${currentId}`).removeClass('completed');
      $(`#${currentId}`).css('textDecoration', '')
    } else {
      $(`#${currentId}`).addClass('completed');
      $(`#${currentId}`).css('textDecoration', 'line-through');
      modifyObject(currentId);
    }
  }

function modifyObject (id) {
  var retrievedCard = localStorage.getItem(id);
  var parsedCard = JSON.parse(retrievedCard);
  parsedCard.completed = true;
  putIntoStorage(parsedCard);
}

$('.show-completed').on('click', getCompletedCardsFromStorage);

function getCompletedCardsFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(retrievedCard);
    console.log(parsedCard.id);
    if(parsedCard.completed === true){
    prependCard(parsedCard);
       $(`#${parsedCard.idNum}`).addClass('completed');
      $(`#${parsedCard.idNum}`).css('textDecoration', 'line-through');
    }
  }
}

$('#card-section').on('keyup blur', editCardBlur);

function editCardBlur(event) {
  if (event.target.closest('.title')){
  event.preventDefault();
  editCardTitle();
  } if (event.target.closest('.description')) {
    event.preventDefault();
    editCardDescription();
  }
}



// search 



$('#search-input').keypress(removeFocus);

function removeFocus(event) {
  if(event.keyCode === 13) {
    event.preventDefault();
    $(this).blur();
  } 
}

$('#search-input').keyup(searchFunction);

function searchFunction(event) {
  event.preventDefault();
  // var searchText = $(this).val();
  // var filteredText = searchText.toUpperCase();
  
  for (var i = 0; i < localStorage.length; i++) {
    var parsedData = retrieveCard(i);
    {obj, currentId}
    var retrievedCard = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedCard);
    var currentId = parsedObject.idNum;
    
    if (parsedObject.title.toUpperCase().includes(filteredText) || parsedObject.body.toUpperCase().includes($(this).val().toUpperCase())) {
      $(`#${currentId}`).css( "display", "" );
    } else {
      $(`#${currentId}`).css( "display", "none");
    }
  }
}

// FUNCTIONS 

// create card function

function Card(title, body, idNum, importance) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.importance = importance || 'Low';
  this.completed = false;
}

function captureUserInput (title, body) {
  var title = $('#title-input').val();
  var body = $('#description-input').val();
  var newCard = new Card(title, body, Date.now());
  prependCard(newCard);
  putIntoStorage(newCard);
}

function putIntoStorage(object) {
  var stringCard = JSON.stringify(object);
  localStorage.setItem(object.idNum, stringCard);
} 


function prependCard(card) {
  $('#card-section').prepend(`<article id="${card['idNum']}" class="card">
        <div id="card-title-container">
        <h2 contenteditable=true id="card-title" class="card-headings title">${card['title']}</h2>
        <label for="delete-button">Delete</label>
        <button id="delete-button" class="small-grey-button delete" name="delete-button"></button>
        </div>
        <p contenteditable=true id="card-description" class="description">${card['body']}</p>
        <div id="card-quality-container">
          <button class="small-grey-button upvote" name="up-vote-button"></button>
          <button class="small-grey-button downvote" name="down-vote-button"></button>
          <h3 class="card-headings importance-level">importance : <span class="quality">${card['importance']}</span></h3>
          <button class="completed-card-button" name="completed-button">Completed Button</button>
        </div>
    </article>`);
}

function resetInputFields() {
  var $form = $('#user-input-form');
  $form[0].reset();
}

function getCardsFromStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    var retrievedCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(retrievedCard);

    if(parsedCard.completed === false){
    prependCard(parsedCard);
    }
  }
};


// function retrieveNewImportance(currentQuality, direction) {
//   var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'] 
  // 

  //Math.Min(4, findIndex + 1)
  //Math.min
  //Math.max(0, findIndex + 1)
//   if (direction === 'down'){

//   }

// }

// Importance Array function


// card button event listener

$('#card-section').on('click', cardHandeler);

function cardHandeler (event) {

  deleteButtonClick(event);
  if (event.target.closest('.upvote')) {
    upvoteAction();
  } if (event.target.closest('.downvote')) {
    downvoteAction();
  }
}

function retrieveData() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  return parsedObject;
}

function upvoteAction() {
  var objectCard = retrieveData();
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var indexSpot = importanceArray.indexOf(objectCard.importance);
  if (indexSpot !== 4) {
    indexSpot++; } 
  objectCard.importance = importanceArray[indexSpot];
  
  putIntoStorage(objectCard);
}

function downvoteAction() {
  var objectCard = retrieveData();
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var indexSpot = importanceArray.indexOf(objectCard.importance);
  if (indexSpot !== 0) {
    indexSpot--; } 
  objectCard.importance = importanceArray[indexSpot];
  putIntoStorage(objectCard);
}



function editCardTitle() {
  var currentId = event.target.closest('.card').id;
  var retrievedObject = localStorage.getItem(currentId);
  var parsedObject = JSON.parse(retrievedObject);
  parsedObject['title'] = $(`#${currentId} .title`).text();
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



