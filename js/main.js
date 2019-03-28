/******************************************
Treehouse Techdegree:
FSJS Project #3 - Interactive Form
******************************************/
$(function() {

  const errors = [
    {
      id: 'name',
      message: 'Please enter your name'
    },
    {
      id: 'mail',
      message: 'Please enter a valid email'
    },
    {
      id: 'activities',
      message: 'Please select at least one activity'
    },
    {
      id: 'cc-num',
      message: 'Card number must be 13 to 16-digit'
    },
    {
      id: 'zip',
      message: 'Zip must be 5-digit'
    },
    {
      id: 'cvv',
      message: 'CVV must be 3-digit'
    }
  ];

  let activities = Array();
  let total_cost = 0;
  let checkboxes = $('.activities input[type="checkbox"]');


  /* ===== FUNCTIONS ================ */

  /***
    * Creates an array of objects from the activities
    * fieldset. Each Checkbox activity is an object.
    **/
  function getActivities() {

    let activity, activity_id, activity_text, activity_schedule, activity_price;

    checkboxes.each(function(index, element) {
      activity_id = $(this).attr('name');
      activity_text = $(this).parent().text();
      activity_schedule = activity_text.match(/(Mon|Tues|Wednes|Thurs|Fri)+(day)+\s+(\d)+(a|p)m+(-)+(\d)+(a|p)m/);

      if(activity_schedule) {
        activity_schedule = activity_schedule[0];
      }

      activity_price = activity_text.match(/(\d{3,})/)[0];

      activity = {
        id: activity_id,
        schedule: activity_schedule,
        price: activity_price
      };
      activities.push(activity);
    });
  }


  /***
    * Creates span elements to use as containers for form errors
    **/
  function createErrorContainers() {

    let labels = $('label');
    let labelFor;

    $(labels).each(function(index, value) {
      labelFor = $(this).attr('for');
      $(' <span class="error '+ labelFor +'" style="display: block; margin-top: -12px; margin-bottom: 25px;"></span>').insertAfter('#' + labelFor);
    });

    $('.activities').append(' <span class="error activities"></span>');

    $('form').append('<p class="error submission" style="padding: 5px; background-color: #a93226; color: #ffffff;">Please correct the form errors to register</p>');

    $('.error.submission').hide();
  }



  /***
    * Shows and removes error messages on form
    **/

  function appMessage(type, label, message = null) {
    let index;
    let exists = $.grep(errors, function(obj) {
      return obj.id === label;
    });

    $('.error.' + label).text(message);

    if(type === 'show') {
      // Add error to errors array (no duplicates)
      let item = {
        id: label,
        message: message
      };

      if(exists.length === 0) {
        errors.push(item);
      }
    } else if(type === 'hide') {
      $('.error.submission').hide();
      // Remove error from errors array if exists
      for(let i = 0; i < errors.length; i++) {
        if(exists[0] === errors[i]) {
          index = errors.indexOf(errors[i]);
          errors.splice(index, 1);
        }
      }
    }
  }



  /***
    * Form validation functions
    **/
  function isValidName(name) {
    return /[\w]{1,}/gi.test(name);
  }

  function isValidEmail(email) {
    return /[^@]+@[^@.]+\.[a-z]{2,3}/i.test(email);
  }

  function isValidCardNo(card_no) {
    return /^[\d]{13,16}$/.test(card_no);
  }

  function isValidZip(zip) {
    return /^[\d]{5}$/.test(zip);
  }

  function isValidCVV(cvv) {
    return /^[\d]{3}$/.test(cvv);
  }



  /***
    * Initializes the application and sets default values.
    **/
  function init() {

    $('#name').focus();

    // Hide HTML elements by default
    $('#job-role').prev().hide();
    $('#job-role, #colors-js-puns, #paypal, #bitcoin').hide();

    // Prepopulate or select default values
    $('#color').prepend('<option value="none">Please select a T-shirt color</option>');

    $('#payment').val('credit card');

    // Add total cost to DOM
    $('.activities').append('<p><strong>Total Cost:</strong> $<span id="event-cost">'+ total_cost +'</span></p>');

    getActivities();

    createErrorContainers();
  }


  init();



  /* ===== EVENT LISTENERS ================ */

  $('#title').change(function() {
    // Add/remove 'other' job role text input based on title value
    if($(this).val() === 'other') {
      $('#job-role').show().focus();
      $('#job-role').prev().show();
    } else {
      $('#job-role').prev().hide();
      $('#job-role').hide();
    }
  });


  $('#design').change(function() {
    // Dynamically show t-shirt selections based on theme value
    if($(this).val() === 'js puns') {
      $('option:contains(JS Puns shirt only)').show();
      $('option:contains(JS shirt only)').hide();
      $('#colors-js-puns').show();
    } else if($(this).val() === 'heart js') {
      $('option:contains(JS shirt only)').show();
      $('option:contains(JS Puns shirt only)').hide();
      $('#colors-js-puns').show();
    } else {
      $('#colors-js-puns').hide();
    }
    $('#color').val('none');
  });


  checkboxes.change(function() {
    let is_checked = $(this).is(':checked');
    let checkbox_index = checkboxes.index(this);
    let id = activities[checkbox_index].id;
    let schedule = activities[checkbox_index].schedule;
    let price = activities[checkbox_index].price;

    // Add/Subtract cost from total based on activity checked
    if(is_checked) {
      total_cost += Number(price);
      appMessage('hide', 'activities');
    } else {
      total_cost -= Number(price);
    }

    // Loop through each activity, disable text and label if same schedule
    $.each(activities, function(index, value) {
      if(is_checked) {
        if(schedule === value.schedule && index !== checkbox_index) {
          $('input[name="' + value.id + '"] ').prop('disabled', true);
          $('input[name="' + value.id + '"] ').parent().addClass('disabled');
        }
      } else {
        if(schedule === value.schedule && index !== checkbox_index) {
          $('input[name="' + value.id + '"] ').prop('disabled', false);
          $('input[name="' + value.id + '"] ').parent().removeClass('disabled');
        }
      }
    });
    // Update total cost
    $('#event-cost').text(total_cost);
  });


  $('#payment').change(function() {
    // Show appropriate payment messages or fields based on user selection
    switch($(this).val()) {
      case 'credit card':
        $('#credit-card').show();
        $('#paypal, #bitcoin').hide();
        appMessage('hide', 'payment');
        break;
      case 'paypal':
        $('#paypal').show();
        $('#credit-card, #bitcoin').hide();
        appMessage('hide', 'payment');
        break;
      case 'bitcoin':
        $('#bitcoin').show();
        $('#credit-card, #paypal').hide();
        appMessage('hide', 'payment');
        break;
      default:
        $('#credit-card, #paypal, #bitcoin').hide();
        appMessage('show', 'payment', 'Please select a payment method');
    }
  });

  /* ===== REAL TIME FORM VALIDATION ================ */
  $('#name').keyup(function() {
    if(!isValidName($(this).val())) {
      appMessage('show', 'name', 'Please enter your name');
    } else {
      appMessage('hide', 'name');
    }
  });

  $('#mail').keyup(function() {
    if($(this).val().length < 1) {
      appMessage('show', 'mail', 'Please enter your email');
    } else if(!isValidEmail($(this).val())) {
      appMessage('show', 'mail', 'Email must be in valid format (example@domain.com)');
    } else {
      appMessage('hide', 'mail');
    }
  });

  $('#cc-num').keyup(function() {
    if(!isValidCardNo($(this).val())) {
      appMessage('show', 'cc-num', 'Card number must be 13 to 16-digit');
    } else {
      appMessage('hide', 'cc-num');
    }
  });

  $('#zip').keyup(function() {
    if(!isValidZip($(this).val())) {
      appMessage('show', 'zip', 'Zip must be 5-digit');
    } else {
      appMessage('hide', 'zip');
    }
  });

  $('#cvv').keyup(function() {
    if(!isValidCVV($(this).val())) {
      appMessage('show', 'cvv', 'CVV must be 3-digit');
    } else {
      appMessage('hide', 'cvv');
    }
  });



  /* ===== WHEN FORM IS SUBMITTED ================ */
  $('form').submit(function(e) {
    e.preventDefault();

    let activity_isChecked = false;

    // Require at least one activity be checked
    checkboxes.each(function(index, value) {
      if($(this).is(':checked')) {
        appMessage('hide', 'activities');
        return false;
      } else {
        appMessage('show', 'activities', 'Please select at least one activity');
      }
    });

    // Only require credit card information if payment method selected is credit card
    if($('#payment').val() !== 'credit card') {
      appMessage('hide', 'cc-num');
      appMessage('hide', 'zip');
      appMessage('hide', 'cvv');
    } else {
      appMessage('show', 'cc-num', 'Card number must be 13 to 16-digit');
      appMessage('show', 'zip', 'Zip must be 5-digit');
      appMessage('show', 'cvv', 'CVV must be 3-digit');
    }

    if(errors.length > 0) {
      $('.error.submission').show();

      $.each(errors, function(index, value) {
        appMessage('show', value.id, value.message);
      });

    } else {
      $('.error.submission').hide();

      $('header span').text('Registration Completed');

      $('form').html('<p style="color: #229954; font-weight: 600; text-align: center;">Thanks for registering '+ $('#name').val() +'! We\'ll see you at the Full Stack Conference!</p><p style="text-align: center;">You may now close this window.</p>');
    }
  });

});
