/* global $ */
$(document).ready(function () {
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  $('.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    $('.amenities h4').text(Object.values(selectedAmenities).join(', ') || '\u00A0');
  });

  $('.locations input[type="checkbox"]').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');

    if (this.checked) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }

    updateLocations();
  });

  $('.locations ul ul input[type="checkbox"]').change(function () {
    const cityId = $(this).attr('data-id');
    const cityName = $(this).attr('data-name');

    if (this.checked) {
      selectedCities[cityId] = cityName;
    } else {
      delete selectedCities[cityId];
    }

    updateLocations();
  });

  // Update the h4 tag inside .locations with selected states and cities
  function updateLocations () {
    const allLocations = Object.values(selectedStates).concat(Object.values(selectedCities));
    $('.locations h4').text(allLocations.join(', ') || '\u00A0');
  }

  // API status check
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('button').click(function () {
    const filters = {
      amenities: Object.keys(selectedAmenities),
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities)
    };

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (data) {
        $('.places').empty();
        $('.places').append('<h1>Places</h1>');

        for (const place of data) {
          $('.places').append(`
                        <article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest(s)</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom(s)</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>
                            </div>
                            <div class="description">${place.description}</div>
                            <div class="reviews">
                                <h2>Reviews <span class="toggle-reviews" data-id="${place.id}">show</span></h2>
                                <ul class="review-list" id="reviews-${place.id}"></ul>
                            </div>
                        </article>
                    `);
        }
      }
    });
  });

  $(document).on('click', '.toggle-reviews', function () {
    const placeId = $(this).attr('data-id');
    const reviewList = $(`#reviews-${placeId}`);

    if ($(this).text() === 'show') {
      $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function (data) {
        reviewList.empty();
        for (const review of data) {
          reviewList.append(`<li>${review.text}</li>`);
        }
      });

      $(this).text('hide');
    } else {
      reviewList.empty();
      $(this).text('show');
    }
  });
});
