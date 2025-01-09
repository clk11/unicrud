function formatDate(rawDate) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
    };

    const date = new Date(rawDate);
    return date.toLocaleDateString('en-US', options);
}

function showModal(title, description, rawDate, ID) {
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const id = document.getElementById('taskID')
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');

    id.value = ID;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalDate.textContent = formatDate(rawDate);
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('cardModal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('cardModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function editModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalTitleInput = document.getElementById('modalTitleInput');
    const modalDescription = document.getElementById('modalDescription');
    const modalDescriptionInput = document.getElementById('modalDescriptionInput');
    const saveButton = document.getElementById('saveButton');

    modalTitleInput.value = modalTitle.textContent;
    modalDescriptionInput.value = modalDescription.textContent;

    modalTitle.style.display = 'none';
    modalDescription.style.display = 'none';
    modalTitleInput.style.display = 'block';
    modalDescriptionInput.style.display = 'block';
    saveButton.style.display = 'block';
}
async function saveModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalTitleInput = document.getElementById('modalTitleInput');
    const modalDescription = document.getElementById('modalDescription');
    const modalDescriptionInput = document.getElementById('modalDescriptionInput');
    const saveButton = document.getElementById('saveButton');
    const id = document.getElementById('taskID').value; 
    const cardTitle = document.getElementById(id);
    const updatedTask = {
        title: modalTitleInput.value,
        description: modalDescriptionInput.value,
    };

    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update task');
        }

        modalTitle.style.display = 'block';
        modalDescription.style.display = 'block';
        modalTitleInput.style.display = 'none';
        modalDescriptionInput.style.display = 'none';
        saveButton.style.display = 'none';
        cardTitle.innerHTML = updatedTask.title;
        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error.message);
        alert('Failed to update the task. Please try again.');
    }
}