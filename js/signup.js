document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.signup-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            fullName: form.querySelector('input[placeholder="Full Name"]').value,
            email: form.querySelector('input[placeholder="Email"]').value,
            username: form.querySelector('input[placeholder="Username"]').value,
            password: form.querySelector('input[placeholder="Password"]').value,
        };

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Sign up successful!');
                // Redirect to login page or dashboard
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });
});