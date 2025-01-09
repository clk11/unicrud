var main = document.querySelector('#main');

var list = Sortable.create(main, {
  group: 'list',
  sort: true,
  filter: '.add-card',
  draggable: '.list',
  ghostClass: "ghost",
  dragoverBubble: true,
});

function initContent() {
  var dropzones = document.querySelectorAll('.content');
  for (let item of dropzones) {
    Sortable.create(item, {
      group: 'card',
      sort: true,
      draggable: '.card',
      ghostClass: "ghost",
    });
  }
}

initContent();

var inputs = document.querySelectorAll('textaread');
for (let item of inputs) {
  item.addEventListener('blur', inputBlurHandler);
}

class inputBlurHandler {
  constructor(e) {
    this.classList.add('inactive');
    this.disabled = true;
    this.classList.remove('active');
    list.options.disabled = false;
  }
}

var body = document.querySelector('body');
body.addEventListener('click', bodyClickHandler);

function bodyClickHandler(e) {
  elMouseLeaveHandler(e);
  var el = e.target;
  var isCard = el.classList.contains('card');
  var isTitle = el.classList.contains('title');
  var isInactive = el.classList.contains('inactive');
  var isEditable = el.classList.contains('editable');
  var editing = el.classList.contains('editing');

  if (isCard && isInactive) {
    list.options.disabled = true;
    el.disabled = false;
    el.classList.remove('inactive');
    el.classList.add('active');
    el.select();
  }

  if (isTitle && isInactive) {
    list.options.disabled = true;
    el.disabled = false;
    el.classList.remove('inactive');
    el.classList.add('active');
    el.select();
  }

  if (isEditable && !editing) {
    el.contentEditable = true;
    el.focus();
    document.execCommand('selectAll', false, null);
    el.addEventListener('blur', elBlurHandler);
    el.addEventListener('keypress', elKeypressHandler);
    el.classList.add('editing');

    if (el.parentElement && el.parentElement.className === 'add-list') {
      el.parentElement.className = 'list initial';
    }
  }
}

function elKeypressHandler(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }

  var el = e.target;
  if (el.classList.contains('add-card')) {
    el.classList.add('pending');
  }

  if (el.parentElement && el.parentElement.className === 'list initial') {
    el.parentElement.className = 'list pending';
  }
}

async function elBlurHandler(e) {
  var el = e.target;
  el.contentEditable = false;
  el.classList.remove('editing');

  var title = el.innerHTML.trim();

  if (el.classList.contains('pending')) {
    el.className = 'card removable editable';
    var newEl = document.createElement('div');
    newEl.className = 'add-card editable';
    var text = document.createTextNode('Add another card');
    newEl.appendChild(text);
    el.parentNode.appendChild(newEl);
    el.parentNode.querySelector('.content').appendChild(el);
  }

  if (el.parentElement && el.parentElement.className === 'list initial') {
    el.parentElement.className = 'add-list';
  }

  if (el.parentElement && el.parentElement.className === 'list pending') {
    try {
      const response = await fetch('http://localhost:3000/board/container', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const container = await response.json();
        el.parentElement.className = 'list';
        el.className = 'title removable editable';
        el.parentElement.setAttribute('data-id', container.id);
        el.parentElement.setAttribute('data-index', container.index);

        var newContent = document.createElement('div');
        newContent.className = 'content';
        el.parentElement.appendChild(newContent);

        var newEl = document.createElement('div');
        newEl.className = 'add-card editable';
        var text = document.createTextNode('Add another card');
        newEl.appendChild(text);
        el.parentNode.appendChild(newEl);

        document.querySelector('#main').appendChild(el.parentElement);
        initContent();

        var addList = document.createElement('div');
        addList.className = 'add-list';
        var newTitle = document.createElement('div');
        newTitle.className = 'title editable';
        var text = document.createTextNode('Add another list');
        newTitle.appendChild(text);
        addList.appendChild(newTitle);
        document.querySelector('body').appendChild(addList);
      } else {
        const error = await response.json();
        alert(`Failed to create container: ${error.error}`);
      }
    } catch (err) {
      alert('An error occurred while trying to create the container.');
    }
  }

  initDelete();
}

function initDelete() {
  var editables = document.querySelectorAll('.editable');
  for (let item of editables) {
    item.addEventListener('mouseenter', elMouseEnterHandler);
    item.addEventListener('mouseleave', elMouseLeaveHandler);
  }
}

initDelete();

function elMouseEnterHandler(e) {
  var el = e.target;
  var isRemovable = el.classList.contains('removable');

  if (isRemovable) {
    var del = document.createElement('span');
    del.className = 'del';
    del.innerHTML = '&times;';
    el.appendChild(del);
    el.addEventListener('click', deleteHandler);
  }
}

function elMouseLeaveHandler(e) {
  var del = e.target.querySelector('span');
  if (del) e.target.removeChild(del);
}

async function deleteHandler(e) {
  var target = e.target;
  var parent = target.parentElement;
  var listElement = target.closest('.list');

  if (listElement) {
    var dataId = listElement.getAttribute('data-id');
    try {
      const response = await fetch(`http://localhost:3000/board/container/${dataId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        if (listElement.parentElement) {
          listElement.parentElement.removeChild(listElement);
        }
      } else {
        const error = await response.json();
        alert(`Failed to delete container: ${error.error}`);
      }
    } catch (err) {
      alert('An error occurred while trying to delete the container.');
    }
  }

  if (parent && parent.classList.contains('card')) {
    if (parent.parentElement) {
      parent.parentElement.removeChild(parent);
    }
  }

  if (parent && parent.classList.contains('title')) {
    const grandparent = parent.parentElement?.parentElement;
    if (grandparent) {
      grandparent.removeChild(parent.parentElement);
    }
  }
}