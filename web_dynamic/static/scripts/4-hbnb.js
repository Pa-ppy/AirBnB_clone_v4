/* global $ */
$(document).ready(function () {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function fetchPlaces (filters = {}) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (places) {
        $('.places').empty();
        for (const place of places) {
          const placeHTML = `
                        <article>
                            <h2>${place.name}</h2>
                            <div class="price_by_night">
                                $${place.price_by_night}
                            </div>
                            <div class="information">
                                <div class="max_guest">
                                    ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
                                </div>
                                <div class="number_rooms">
                                    ${place.number_rooms} Room${place.number_rooms !== 1 ? 's' : ''}
                                </div>
                                <div class="number_bathrooms">
                                    ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div class="description">
                                ${place.description}
                            </div>
                        </article>
                    `;
          $('.places').append(placeHTML);
        }
      }
    });
  }

  fetchPlaces();

  $('button').click(function () {
    const selectedAmenities = [];
    $('.amenities input:checked').each(function () {
      selectedAmenities.push($(this).attr('data-id'));
    });

    fetchPlaces({ amenities: selectedAmenities });
  });
});
