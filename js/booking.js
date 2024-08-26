document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const employeeSelect = document.getElementById('employee');
    const timeSlotContainer = document.getElementById('time-slots');

    dateInput.addEventListener('change', fetchAvailableSlots);
    employeeSelect.addEventListener('change', fetchAvailableSlots);

    function fetchAvailableSlots() {
        const date = dateInput.value;
        const employeeId = employeeSelect.value;

        if (!date || !employeeId) return;

        fetch(`/available-slots?date=${date}&employeeId=${employeeId}`)
            .then(response => response.json())
            .then(slots => {
                timeSlotContainer.innerHTML = '';
                slots.forEach(slot => {
                    const button = document.createElement('button');
                    button.textContent = new Date(slot).toLocaleTimeString();
                    button.onclick = () => bookAppointment(slot);
                    timeSlotContainer.appendChild(button);
                });
            })
            .catch(error => console.error('Error fetching slots:', error));
    }

    function bookAppointment(slot) {
        // Implement booking logic here
        console.log('Booking appointment for:', slot);
    }
});
