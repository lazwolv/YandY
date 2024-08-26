document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.navbar-toggle');
    const loginButton = document.querySelector('.nav-menu a[href="login.html"]');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const updateNavbar = debounce(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && loginButton) {
            loginButton.textContent = `Hello, ${user.username}`;
            loginButton.href = '#';

            if (!loginButton.nextElementSibling || !loginButton.nextElementSibling.classList.contains('dropdown-menu')) {
                const dropdown = document.createElement('div');
                dropdown.className = 'dropdown-menu';
                dropdown.style.display = 'none';

                const appointmentsLink = document.createElement('a');
                appointmentsLink.href = 'my-appointments.html';
                appointmentsLink.textContent = 'My Appointments';

                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Logout';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.reload();
                });

                dropdown.appendChild(appointmentsLink);
                dropdown.appendChild(logoutLink);

                loginButton.parentNode.appendChild(dropdown);

                loginButton.addEventListener('mouseover', () => {
                    dropdown.style.display = 'block';
                });

                loginButton.parentNode.addEventListener('mouseleave', () => {
                    dropdown.style.display = 'none';
                });
            }
        }
    }, 100);

    updateNavbar();

    const observer = new MutationObserver(updateNavbar);
    observer.observe(navMenu, { childList: true, subtree: true });
});