/* global $ */
$(document).ready(function () {
  const selectedFilters = {
    amenities: {},
    states: {},
    cities: {}
  };

  function updateFilters () {
    $('.filters h4').text(
      Object.values(selectedFilters.amenities).concat(Object.values(selectedFilters.states), Object.values(selectedFilters.cities)).join(', ')
    );
  }

  $('.amenities input, .locations input').change(function () {
    const filterType = $(this).closest('div').hasClass('amenities')
      ? 'amenities'
      : $(this).closest('ul').parent().is('li') ? 'cities' : 'states';
    if (this.checked) {
      selectedFilters[filterType][$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete selectedFilters[filterType][$(this).attr('data-id')];
    }
    updateFilters();
  });

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(selectedFilters.amenities),
        states: Object.keys(selectedFilters.states),
        cities: Object.keys(selectedFilters.cities)
      }),
      success: function (data) {
        $('section.places').empty();
        data.forEach(place => {
          $('section.places').append(`
                        <article>
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guests</div>
                                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                            </div>
                            <div class="description">${place.description}</div>
                        </article>
                    `);
        });
      }
    });
  });
});
