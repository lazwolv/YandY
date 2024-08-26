document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.navbar-toggle');
    const loginButton = document.querySelector('.nav-menu a[href="login.html"]');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      loginButton.textContent = `Hello, ${user.username}`;
      loginButton.href = '#';
      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Show user menu or redirect to account page
        // You can implement this based on your preference
      });

      // Add logout button
      const logoutButton = document.createElement('a');
      logoutButton.textContent = 'Logout';
      logoutButton.href = '#';
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.reload();
      });
      navMenu.appendChild(logoutButton);
    }
});