const chars = '0123456789abcdef';
const blankSpace = '';
let btnColor;

const updateButtonColor = (_btnColor = btnColor) => {
    const deleteBtn = document.querySelectorAll('#cancel-element');
    const editBtn = document.querySelectorAll('#edit-note-button');
    const saveEditedNoteBtn = document.getElementById('edit-note-button2');
    //both delete and edit buttons must have the same length, so:

    for(let i = 0; i < deleteBtn.length; i++){
        deleteBtn[i].style.backgroundColor = _btnColor;
        deleteBtn[i].style.transition = '1.5s';

        editBtn[i].style.backgroundColor = _btnColor;
        editBtn[i].style.transition = '1.5s';
    }

    saveEditedNoteBtn.style.backgroundColor = _btnColor;
}

const generateRandomColor = () => {
    const lim = 6;
    let result = '#';

    for(let i = 0; i < lim; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    btnColor = result;
    return result;
} 

const changeBG = () => {
    const color = generateRandomColor();
    const bodyStyle = document.body.style;

    bodyStyle.background = color;
    bodyStyle.transition = '1.5s';
}

const clearInputText = () => {
    const input = document.getElementById('add-new-note-input');
    input.value = null;
}

const getLICount = () => {
    return document.getElementById('all-notes-ul').children.length;
}

const setDeleteNoteFunctionality = (btn = document.createElement('button')) => {
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', (e) => {
        const el = e.target.parentElement;

        el.remove();
        updateButtonColor();
        saveDataToLocalStorage();
    });

    return btn;
}

const generateEditNoteButton = () => {
    const btn = document.createElement('button');
    const newDiv = document.createElement('div');

    btn.setAttribute('id', 'edit-note-button');
    btn.innerText = 'edit';
    btn.style.backgroundColor = 'grey';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', () => {
        const thisBtn = btn.parentElement.parentNode.parentElement;

        editNote(thisBtn);
    });

    newDiv.setAttribute('id', 'edit-note-button-div');
    newDiv.append(btn);

    return newDiv;
}

const generateNewLI = (content, generateCheck = true) => {
    const newLI = document.createElement('li');
    const newDiv = document.createElement('div');
    const newSpan = document.createElement('span');
    const cancelNote = setCancelNoteFunctionality();
    const editNoteBtn = generateEditNoteButton();
    const check = generateNewCheckBox();

    newSpan.innerText = content;

    if(generateCheck){
        newDiv.append(cancelNote, editNoteBtn, check);
    }
    else{
        newDiv.append(cancelNote, editNoteBtn);
    }

    newLI.setAttribute('id', `LI-note`);
    newDiv.setAttribute('id', 'div-item-options');
    newSpan.setAttribute('id', `span-item-text`);
    newLI.append(newSpan, newDiv);

    return newLI;
}

const editNote = (el) => {
    const editNoteDiv = document.getElementById('edit-notes-div');
    const editBtn = document.getElementById('edit-note-button2');
    const allNotesDiv = document.getElementById('all-notes-div');
    const doneNotesDiv = document.getElementById('done-notes-div');
    const addNewNoteDiv = document.getElementById('add-new-note-div');

    editNoteDiv.style.display = 'block';
    allNotesDiv.style.display = 'none';
    doneNotesDiv.style.display = 'none';
    addNewNoteDiv.style.display = 'none';

    editBtn.addEventListener('click', () => {
        const content = document.getElementById('edit-note-input');

        if(content.value !== blankSpace){
            el.firstChild.innerText = content.value;

            saveDataToLocalStorage();
            location.reload();

            content.value = null;
            editNoteDiv.style.display = 'none';
            allNotesDiv.style.display = 'block';
            doneNotesDiv.style.display = 'block';
            addNewNoteDiv.style.display = 'block';
        }
        else{
            alert("There's nothing to change!");
        }
    });
}

const setDoneNoteFunctionality = (check) => {
    check.addEventListener('click', (e) => {
        const el = e.target.parentNode.parentElement.parentNode;
        const elNoCheckBox = el.childNodes[0].innerText;
        const doneNotesArea = document.getElementById('all-done-notes-ul');
        const li = generateNewLI(elNoCheckBox, check = false);

        el.remove();

        doneNotesArea.append(li);

        updateButtonColor();
        saveDataToLocalStorage();
    });
}

const setCancelNoteFunctionality = () => {
    const cancelElement = document.createElement('button');
    const newDiv = document.createElement('div');

    cancelElement.innerText = 'delete';
    cancelElement.setAttribute('id', 'cancel-element');
    cancelElement.style.cursor = 'pointer';
    cancelElement.style.backgroundColor = 'grey';

    cancelElement.addEventListener('click', (e) => {
        const note = e.target.parentElement.parentElement.parentElement;

        note.remove();
        saveDataToLocalStorage();
    });

    newDiv.setAttribute('id', 'delete-button-div');
    newDiv.append(cancelElement);

    return newDiv;
}

const generateNewCheckBox = () => {
    const check = document.createElement('input');
    const newDiv = document.createElement('div');

    check.setAttribute('type', 'checkbox');
    check.setAttribute('id', 'checkbox');
    newDiv.setAttribute('id', 'check-div');

    newDiv.append(check);

    setDoneNoteFunctionality(check);

    return newDiv;
}

const loadDataFromLocalStorage = () => {
    const item = ['pendingNotes', 'doneNotes'];
    const previusBGColor = localStorage.getItem('backgroundColor');
    const body = document.querySelector('body').style;

    item.forEach(i => {
        let content;

        try{
            content = localStorage.getItem(i).split(',');
        }
        catch (err){
            return;
        };

        if(!localStorage.getItem(i)) return;
        
        if(i === 'pendingNotes'){
            const allNotesUL = document.getElementById('all-notes-ul');
            
            content.forEach(c => {
                const newLI = generateNewLI(c);
                
                allNotesUL.append(newLI);
            });
        }

        else if (i === 'doneNotes'){
            const doneNotesUL = document.getElementById('all-done-notes-ul');
        
            content.forEach(c => {
                const newLI = generateNewLI(c, generateCheck = false);

                doneNotesUL.append(newLI);
            });
        }
    });

    if(!previusBGColor) return;

    body.backgroundColor = previusBGColor;
    updateButtonColor(previusBGColor);
}

const saveDataToLocalStorage = (item = 'pendingNotes', recursive = true) => {
    const notesArr = [];
    
    if(item === 'pendingNotes'){
        const allPendingNotes = document.getElementById('all-notes-ul').childNodes;

        for(let note of allPendingNotes){
            notesArr.push(note.firstChild.innerText);
        }
    }

    if(item === 'doneNotes'){
        const allDoneNotes = document.getElementById('all-done-notes-ul').childNodes;

        for(let note of allDoneNotes){
            notesArr.push(note.firstChild.innerText);
        }
    }

    if(!localStorage.getItem(item)){
        localStorage.setItem(item, notesArr);
    }

    localStorage.removeItem(item);
    localStorage.setItem(item, notesArr);

    if(!recursive){
        const currentBGColor = document.body.style.backgroundColor;
        const _item = 'backgroundColor';

        localStorage.setItem(_item, currentBGColor);

        return;
    }
    saveDataToLocalStorage('doneNotes', recursive = false);
}

const add = () => {
    const content = document.getElementById('add-new-note-input').value;
    const allNotesUL = document.getElementById('all-notes-ul');
    const newLI = generateNewLI(content);
    const newCheckBox = generateNewCheckBox();

    if(content !== blankSpace){
        allNotesUL.append(newLI);

        clearInputText();
        changeBG();
        saveDataToLocalStorage();
        updateButtonColor();
    }
}

(() => {
    document.body.style.backgroundColor = 'lightgrey';

    const allNotesH2 = document.getElementById('all-notes-h2');
    const allNotesUL = document.getElementById('all-notes-ul');
    const allNotesDiv = document.getElementById('all-notes-div');
    const doneNotesH2 = document.getElementById('done-notes-h2');
    const doneNotesUL = document.getElementById('all-done-notes-ul');

    allNotesH2.innerText = 'All notes';
    doneNotesH2.innerText = 'Done notes';

    loadDataFromLocalStorage();
})()