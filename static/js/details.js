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
    const modal = document.getElementById('detailsModal');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const id = document.getElementById('taskID')
    const detailsModalDescription = document.getElementById('detailsModalDescription');
    const modalDate = document.getElementById('modalDate');

    id.value = ID;
    detailsModalTitle.textContent = title;
    detailsModalDescription.textContent = description;
    modalDate.textContent = formatDate(rawDate);
    modal.style.display = 'flex';
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function editModal() {
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsModalTitleInput = document.getElementById('detailsModalTitleInput');
    const detailsModalDescription = document.getElementById('detailsModalDescription');
    const detailsModalDescriptionInput = document.getElementById('detailsModalDescriptionInput');
    const saveButton = document.getElementById('saveButton');

    detailsModalTitleInput.value = detailsModalTitle.textContent;
    detailsModalDescriptionInput.value = detailsModalDescription.textContent;

    detailsModalTitle.style.display = 'none';
    detailsModalDescription.style.display = 'none';
    detailsModalTitleInput.style.display = 'block';
    detailsModalDescriptionInput.style.display = 'block';
    saveButton.style.display = 'block';
}
async function saveTask() {
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsModalTitleInput = document.getElementById('detailsModalTitleInput');
    const detailsModalDescription = document.getElementById('detailsModalDescription');
    const detailsModalDescriptionInput = document.getElementById('detailsModalDescriptionInput');
    const saveButton = document.getElementById('saveButton');
    const id = document.getElementById('taskID').value;
    const cardTitle = document.getElementById(id);
    const updatedTask = {
        title: detailsModalTitleInput.value,
        description: detailsModalDescriptionInput.value,
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

        detailsModalTitle.style.display = 'block';
        detailsModalDescription.style.display = 'block';
        detailsModalTitleInput.style.display = 'none';
        detailsModalDescriptionInput.style.display = 'none';
        saveButton.style.display = 'none';
        cardTitle.innerHTML = updatedTask.title;
        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error.message);
        alert('Failed to update the task. Please try again.');
    }
}