let $inputs;

let errorMessageClass = 'error_message';
let errorMessageEmpty = 'Please fill this field';


$(document).ready(function() {

  $inputs = $('input:not([type=submit])');
  fillInputs($inputs);

  $inputs.on('input', function() {
    let name = $(this).attr('name');
    let value = $(this).val();
    if (Cookies.get('cookiesAccepted') == 'true') {
      Cookies.set(name + '-inputCookie', value);
    }
    validateInput(this);
  });

  $inputs.on('blur', function() {
    validateInput(this);
  });

  // window.addEventListener('beforeunload', function(e) {
  //   var values = [];
  //   $.each($inputs, function(i, item) {
  //     value = $(this).val();
  //     if (value == '') {
  //       values.push(false);
  //     } else {
  //       values.push(true);
  //     }
  //   });
  //   if (Cookies.get('cookiesAccepted') == undefined && values.includes(true)) {
  //     (e || window.event).returnValue = 'attention'; // Internet Explorer
  //     return 'attention'; // Any other browser
  //   }
  // });

});



function validateInput(input, focus, highlight) {
  if (focus === undefined) {
    focus = false;
  }
  if (highlight === undefined) {
    highlight = false;
  }
  input = $(input);
  let tag = input.prop('tagName').toLowerCase();
  let value = input.val();
  let id = input.attr('id');
  let optional = input.attr('optional');
  if (optional == 'true') {
    optional = true;
  } else {
    optional = false;
  }
  let $nextElem = input.next();
  let $nextElemClass = $nextElem.attr('class');
  let message = '';

  if (value == '') {
    if (!optional) {
      message = errorMessageEmpty;
    }
  }

  if (message.length > 0) {
    if ($nextElemClass == errorMessageClass) {
      $nextElem.html(`${message}`);
      if (highlight) {
        $nextElem.effect('bounce', 'slow');
      }
    } else {
      document.querySelector(`${tag}#${id}`).insertAdjacentHTML('afterend',
        `<p class='${errorMessageClass}'>${message}</p>`);
    }
    input.addClass('error');
    if (focus) {
      $(`input#${id}`)[0].focus();
    }
    return false
  } else {
    if ($nextElemClass == 'error_message') {
      $nextElem.remove();
      input.removeClass('error');
    }
    return true
  }

}


function sendForm() {
  let valids = [];
  $.each($inputs, function(i, input) {
    valids.push(validateInput(input, true, true));
  });
  if (!valids.includes(false)) {
    sendData();
  }
}


function fillInputs($inputs) {
  $.each($inputs, function(i, input) {
    let value = Cookies.get($(this).attr('name') + '-inputCookie');
    $(this).val(value);
  });
}