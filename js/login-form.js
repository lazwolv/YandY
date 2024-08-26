document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        
        console.log('Login attempt:', userData);

        try {
            const response = await fetch('http://localhost:5500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            console.log('Response status:', response.status);

            if (response.ok) {
                const user = await response.json();
                console.log('Login successful:', user);
                localStorage.setItem('user', JSON.stringify({
                    username: userData.username,
                    fullName: user.fullName
                }));
                window.location.href = 'index.html';
            } else {
                const errorText = await response.text();
                console.error('Login failed:', response.status, errorText);
                alert(`Login failed. Status: ${response.status}. ${errorText || 'No error message provided'}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error occurred. Please check your connection and try again.');
        }
    });
});