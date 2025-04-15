document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        console.log('Sending signup request:', userData);

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('user', JSON.stringify({
                    username: userData.username,
                    fullName: userData.fullName
                }));
                window.location.href = 'index.html';
            } else {
                const errorText = await response.text();
                console.error(`Signup failed: ${response.status} ${errorText}`);
                alert(`Signup failed. Status: ${response.status}. Please check the server logs for more information.`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error occurred. Please check your connection and try again.');
        }
    });
});