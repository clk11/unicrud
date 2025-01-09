function showCreateModal(status) {
    const modal = document.getElementById('createModal');
    document.getElementById('status').value = status;
    modal.style.display = 'flex';
}

async function createTask() {
    const title = document.getElementById('createModalTitleInput').value;
    const description = document.getElementById('createModalDescriptionInput').value;
    const status = document.getElementById('status').value;
    try {
        const response = await fetch(`http://localhost:3000/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update task');
        }

        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error.message);
        alert('Failed to update the task. Please try again.');
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    modal.style.display = 'none';
}
