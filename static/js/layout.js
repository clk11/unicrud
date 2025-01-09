function allowDrop(ev) {
    try {
        ev.preventDefault();
    } catch (error) {
        console.error('Error in allowDrop:', error);
    }
}

function dragStart(ev) {
    try {
        ev.dataTransfer.setData("text/plain", ev.target.id);
    } catch (error) {
        console.error('Error in dragStart:', error);
    }
}

async function dropIt(ev) {
    try {
        ev.preventDefault();

        let sourceId = ev.dataTransfer.getData("text/plain");
        let sourceIdEl = document.getElementById(sourceId);
        let sourceIdParentEl = sourceIdEl.parentElement;
        let targetEl = document.getElementById(ev.target.id);
        let targetParentEl = targetEl.parentElement;

        const response = await fetch(`http://localhost:3000/tasks/${sourceIdEl.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: targetEl.id }),
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
    } catch (error) {
        console.error('Error in dropIt:', error);
        alert(`Error: Unable to update task. Please try again later.`);
    }
}