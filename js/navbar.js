document.addEventListener('DOMContentLoaded', function() {
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.navbar-toggle');
  const loginButton = document.querySelector('.nav-menu a[href="login.html"]');

  navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
  });

  // Check if user is logged in
  if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      loginButton.textContent = `Hello, ${user.name}`;
      loginButton.href = '#';
  }
});
