document.addEventListener('DOMContentLoaded', function() {
    const teamMemberSelect = document.getElementById('team-member');
    const dateInput = document.getElementById('date');
    const timeSlotContainer = document.getElementById('time-slots');
    const bookingForm = document.querySelector('.booking-form');

    fetch('http://localhost:3000/api/team-members')
        .then(response => response.json())
        .then(members => {
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                teamMemberSelect.appendChild(option);
            });
        });

    function fetchAvailableSlots() {
        const teamMemberId = teamMemberSelect.value;
        const date = dateInput.value;

        if (!teamMemberId || !date) return;

        fetch(`http://localhost:3000/api/available-slots?teamMemberId=${teamMemberId}&date=${date}`)
            .then(response => response.json())
            .then(slots => {
                timeSlotContainer.innerHTML = '';
                slots.forEach(slot => {
                    const button = document.createElement('button');
                    button.textContent = new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    button.onclick = () => selectTimeSlot(slot);
                    timeSlotContainer.appendChild(button);
                });
            });
    }

    teamMemberSelect.addEventListener('change', fetchAvailableSlots);
    dateInput.addEventListener('change', fetchAvailableSlots);

    function selectTimeSlot(slot) {
        const selectedSlot = document.createElement('input');
        selectedSlot.type = 'hidden';
        selectedSlot.name = 'selectedSlot';
        selectedSlot.value = slot;
        bookingForm.appendChild(selectedSlot);
    }

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        const bookingData = {
            teamMemberId: formData.get('team-member'),
            appointmentTime: formData.get('selectedSlot'),
            clientName: formData.get('name'),
            clientPhone: formData.get('phone')
        };

        try {
            const response = await fetch('http://localhost:3000/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                alert('Appointment booked successfully!');
                bookingForm.reset();
                timeSlotContainer.innerHTML = '';
            } else {
                const errorData = await response.json();
                alert(`Failed to book appointment. Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });
});