document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navbarToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navbarToggle.classList.toggle('active');
  });
});
