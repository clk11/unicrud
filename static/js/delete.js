async function deleteTask(event, id) {
    event.stopPropagation(); 

    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
        }

        window.location.reload();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error: Unable to delete task. Please try again later.`);
    }
}