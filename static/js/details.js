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

function showModal(title, description, rawDate) {
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');

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