const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

// handle picker date
if ($('input[name="daysLeave"]')) {
  $(function () {
    $('input[name="daysLeave"]').daterangepicker({
      timePicker: true,
      startDate: moment(),
      endDate: moment(),
    });
  });
}

//  handle submit form select month 'reference view'
if ($('.form-select-month')) {
  $('.select-month').on('change', function () {
    $('.form-select-month').submit();
  });
}
