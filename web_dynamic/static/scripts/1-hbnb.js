/* global $ */
$(document).ready(function () {
  const checkedAmenities = {};

  $('.filters input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }

    $('.filters h4').text(Object.values(checkedAmenities).join(', '));
  });
});
