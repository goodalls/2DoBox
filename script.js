

// EVENT LISTENERS

// card creation event listeners


$(window).on('load', persistCards);

function persistCards () {
  getCardsFromStorage();
};

$('#save-button').on('click', saveButtonClick);

function saveButtonClick (event) {
  event.preventDefault();
  captureUserInput();
  resetInputFields();
};

// card button event listeners

$('#card-section').on('click', cardHandeler)

function cardHandeler (event) {
  var currentId = event.target.closest('.card').id
  event.preventDefault();
  if (event.target.closest('.delete')) {
    event.target.closest('article').remove();
    localStorage.removeItem(currentId);
  } if (event.target.closest('.upvote')) {
    upvoteButton();
  } if (event.target.closest('.downvote')) {
    downvoteButton();
  }
};

// $('#card-section').on('click', '.card .delete', deleteButtonClick)

// function deleteButtonClick (event) {
//   event.preventDefault();
//   deleteButton(this);
//   var currentId = event.target.closest('.card').id
//   localStorage.removeItem(currentId);
// };

// $('#card-section').on('click', '.card .downvote', downVoteButtonClick)

// function downVoteButtonClick (event) {
//   event.preventDefault();
//   downvoteButton();
// };

// $('#card-section').on('click', '.card .upvote', upVoteButtonClick)


// function upVoteButtonClick(event) {
//   event.preventDefault();
//   upvoteButton();
// };


// edit card event listeners




// $('#card-section').on('blur', '.card .title', editCardTitleBlur)
// $('#card-section').on('blur', '.card .description', editCardDescriptinBlur)

// function editCardDescriptinBlur(event) {
//   event.preventDefault();
//   editCardDescription();
// };

$('#card-section').on('keyup blur', editCardBlur)

function editCardBlur(event) {
  if (event.target.closest('.title')){
  event.preventDefault();
  editCardTitle();
  } if (event.target.closest('.description')) {
    event.preventDefault();
    editCardDescription();
  }
};





// $('#card-section').keypress('.card .description', editCardDescriptionKeypress)

// function editCardDescriptionKeypress(event) {
//   if(event.keyCode === 13){
//     event.preventDefault();
//     editCardDescription();
//   }
// };

// $('#card-section').keypress('.card .title', editCardTitleKeypress)

// function editCardTitleKeypress(event) {
//   if(event.keyCode === 13){
//     event.preventDefault();
//     editCardTitle();
//   }
// };

// $('#card-section').keypress(editCardKeypress)

// function editCardKeypress (event) {
//   if (event.target.closest('.description' && event.keyCode === 13)) {
//    console.log('description enter key pressed')
//    event.preventDefault();
//    editCardDescription();
//   } if (event.target.closest('.title' && event.keyCode === 13)) {
//     console.log('title enter key pressed')
//     event.preventDefault();
//     editCardTitle();
//   }
// };



// search 

$('#search-input').keyup(searchFunction);

$('#search-input').keypress(removeFocus)

function removeFocus(event) {
  if(event.keyCode === 13) {
    event.preventDefault();
    $(this).blur();
  } 
};

function searchFunction(event) {
  event.preventDefault();
  var searchText = $(this).val();
  var filteredText = searchText.toUpperCase();
  for (var i = 0; i < localStorage.length; i++) {
    var retrievedCard = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedCard);
    var currentId = parsedObject['idNum'];
    if (parsedObject['title'].toUpperCase().includes(filteredText) || parsedObject['body'].toUpperCase().includes(filteredText)) {
      $(`#${currentId}`).css( "display", "" );
    } else {
      $(`#${currentId}`).css( "display", "none");
    }
  }
};

// FUNCTIONS 

// create card function

function Card(title, body, idNum, quality) {
  this.title = title;
  this.body = body;
  this.idNum = idNum;
  this.quality = quality || 'swill';
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
  localStorage.setItem(object['idNum'], stringCard);
} 


function prependCard(card) {
  $('#card-section').prepend(`<article id="${card['idNum']}" class="card">
      <form id="card-meta-data-form">
        <div id="card-title-container">
        <h2 contenteditable=true id="card-title" class="card-headings title">${card['title']}</h2>
        <label for="delete-button">Delete</label>
        <button id="delete-button" class="small-grey-button delete" name="delete-button"></button>
        </div>
        <p contenteditable=true id="card-description" class="description">${card['body']}</p>
        <div id="card-quality-container">
          <button id="up-vote-button" class="small-grey-button upvote" name="up-vote-button"></button>
          <button id="down-vote-button" class="small-grey-button downvote" name="down-vote-button"></button>
          <h3 id="quality-display-text" class="card-headings">quality : <span class="quality">${card['quality']}</span></h3>
        </div>
      </form>
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
    prependCard(parsedCard);
  }
};

// card button functions

// function deleteButton(button) {
//   button.closest('.card').remove();
// }

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



