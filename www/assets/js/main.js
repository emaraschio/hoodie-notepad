"use strict";

var hoodie  = new Hoodie();

hoodie.account.on('signup', function (user) {
  setUsername();
  showMyNotes();
  $('#lnkSignUp').hide();
  $('#lnkSignIn').hide();
});

hoodie.account.on('signin', function (user) {
  hideElements()
  setUsername();
  showMyNotes();
  $('#lnkSignUp').hide();
  $('#lnkSignIn').hide();
});

hoodie.account.on('signout', function (user) {
  hideElements()
  $('.jumbotron').show();
  $('#lnkSignUp').show();
  $('#lnkSignIn').show();
});

function setUsername() {
  $('#headerUser a:first').html(hoodie.account.username + " <span class='caret'></span>");
  $('#headerUser').removeClass('hidden');
  $('#headerMynotes').removeClass('hidden');
}

$(function(){
  registerHomeEvents();
  registerMyNotes();
  registerMenuEvents()
  if (hoodie.account.username) {
    setUsername();
    $('#lnkSignUp').hide();
    $('#lnkSignIn').hide();
  }
});

function registerMenuEvents() {
  $('#menuHome').click(showHome);
  $('#menuMyNotes').click(showMyNotes);
  $('#logout').click(logout);
}

function registerHomeEvents() {
  $('#btnSignUp').click(signUp);
  $('#btnSignIn').click(signIn);
  $('#lnkSignUp').click(showSignUp);
  $('#lnkSignIn').click(showSignIn);
}

function registerMyNotes() {
  $('#btnCreateNote').click(createNote);
  $('#myNotes table tbody').on('click', '.btn-remove', removeNote);
}

function removeNote() {
  var id = $(this).parent().parent().data('id');
  hoodie.store.remove('note', id);
  loadMyNotes();
}

function createNote() {
  var note = {};
  note.text = $('#txtNote').val();
  note.title = $('#txtTitle').val();
  note.owner = hoodie.account.username;
  hoodie.store.add('note', note);
  $('#txtTitle').val('');
  $('#txtNote').val('');
  loadMyNotes();
}

function loadMyNotes() {
  //this will be change in the future - http://hood.ie/#docs - See 'Public Shares (Public User Stores)'
  hoodie.store.findAll('note')
  .then(function(notes) {
    var $el = $('#myNotes table tbody');
    $el.html('');
    notes.forEach(loadMyNote);
  });
}

function loadMyNote(note) {
  if (note.owner == hoodie.account.username) {
    var $el = $('#myNotes table tbody');
    $el.append(
      '<tr data-id="' + note.id + '">' +
        '<td>' + note.title + '</td>' +
        '<td>' + note.text + '</td>' +
        '<td><button class="btn btn-danger btn-sm btn-remove">Remove</button></td>' +
      '</tr>'
    );
  }
}

function signUp() {
  var email = $('#txtEmail').val();
  var password = $('#txtPassword').val();
  hoodie.account.signUp(email, password)
  .fail(function(err){
    console.log('Log error...let the user know it failed');
  });
}

function signIn() {
  var email = $('#txtEmail').val();
  var password = $('#txtPassword').val();
  hoodie.account.signIn(email, password)
  .fail(function(err){
    console.log('Log error...let the user know it failed');
  });
}

function showSignIn() {
  hideElements();
  $('#signForm').show();
  $('.signin').show();
  $('#btnSignIn').show();
}

function showSignUp() {
  hideElements();
  $('#signForm').show();
  $('.signup').show();
  $('#btnSignUp').show();
}

function showHome() {
  setActiveMenu.call($('#menuHome'));
  $('.jumbotron').show();
}

function showMyNotes() {
  setActiveMenu.call($('#menuMyNotes'));
  loadMyNotes();
  $('#myNotes').show();
}

function logout() {
  $('#headerUser').addClass('hidden');
  $('#menuMyNotes').addClass('hidden');
  hoodie.account.signOut();
}

function setActiveMenu() {
  clearActiveMenu();
  hideElements();
  $(this).parent().addClass('active');
}

function clearActiveMenu() {
  $('#menuHome').parent().removeClass('active');
  $('#menuMyNotes').parent().removeClass('active');
}

function hideElements() {
  $('.jumbotron').hide();
  $('#signForm').hide();
  $('#myNotes').hide();
  $('.signup').hide();
  $('.signin').hide();
  $('#btnSignUp').hide();
  $('#btnSignIn').hide();
}
