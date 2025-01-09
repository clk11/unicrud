function allowDrop(ev) {
    ev.preventDefault();  
}
function dragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}
async function dropIt(ev) {
    ev.preventDefault(); 
    let sourceId = ev.dataTransfer.getData("text/plain");
    let sourceIdEl = document.getElementById(sourceId);
    let sourceIdParentEl = sourceIdEl.parentElement;
    let targetEl = document.getElementById(ev.target.id)
    let targetParentEl = targetEl.parentElement;
    // targetEl.id,sourceIdEl.id
    const response = await fetch(`http://localhost:3000/tasks/${sourceIdEl.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status:targetEl.id}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
    }

    if (targetParentEl.id !== sourceIdParentEl.id) {
        if (targetEl.className === sourceIdEl.className) {
            targetParentEl.appendChild(sourceIdEl);

        } else {
            targetEl.appendChild(sourceIdEl);
        }
    } else {
        let holder = targetEl;
        let holderText = holder.textContent;
        targetEl.textContent = sourceIdEl.textContent;
        sourceIdEl.textContent = holderText;
        holderText = '';
    }
}

