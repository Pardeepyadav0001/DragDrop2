const dragItems = document.querySelectorAll('.drag-item');
const dropZone = document.getElementById('drop-zone');
const form = document.getElementById('form');
const jsonOutput = document.getElementById('json-output'); // Get JSON output textarea
let fieldCount = 0; // To keep track of the number of fields
let droppedFields = []; // To store dropped fields

dragItems.forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', item.dataset.type);
    });
});

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
});

dropZone.addEventListener('drop', e => {
    e.preventDefault();
    const dataType = e.dataTransfer.getData('text/plain');
    let inputElement;

    switch (dataType) {
        case 'textfield':
            inputElement = createInput('text', 'Text Field');
            break;
        case 'dropdown':
            inputElement = createSelect('Select Option');
            break;
        case 'checkbox':
            inputElement = createInput('checkbox', 'Checkbox');
            break;
            case 'radiobutton':
                let radioButtonLabel;
                let numRadioButtons;
            
                while (true) {
                    const labelInput = window.prompt('Enter the label for the radio button group:');
                    if (labelInput === null) {
                        return; // If user cancels, exit the function
                    }
            
                    radioButtonLabel = labelInput.trim();
            
                    if (radioButtonLabel === '') {
                        window.alert('Please enter a non-empty label for the radio button group.');
                        continue; // Restart the loop
                    }
            
                    const numInput = window.prompt('Enter the number of radio buttons:');
                    if (numInput === null) {
                        return; // If user cancels, exit the function
                    }
            
                    numRadioButtons = parseInt(numInput);
            
                    if (isNaN(numRadioButtons) || numRadioButtons <= 0) {
                        window.alert('Please enter a valid number greater than 0 for the radio buttons.');
                        continue; // Restart the loop
                    }
            
                    break; // Break out of the loop if both label and number of radio buttons are valid
                }
            
                inputElement = createRadioButtonGroup(radioButtonLabel, numRadioButtons);
                break;
            
        case 'checkbox-group':
            let checkboxLabel;
            let numCheckboxes;

            while (true) {
                const input = window.prompt('Enter the label for the checkbox group and the number of checkboxes (e.g., "Label: 5"):');
                if (!input) {
                    return; // If user cancels or enters an empty string, do nothing
                }

                const parts = input.split(':');
                if (parts.length !== 2) {
                    window.alert('Please enter both label and number of checkboxes separated by a colon (:)'); // Show alert for invalid input format
                    continue; // Restart the loop
                }

                checkboxLabel = parts[0].trim();
                numCheckboxes = parseInt(parts[1].trim());

                if (!checkboxLabel || isNaN(numCheckboxes) || numCheckboxes <= 0) {
                    window.alert('Please enter a valid label followed by a valid number greater than 0.'); // Show alert for invalid input
                    continue; // Restart the loop
                }

                break; // Break out of the loop if both label and number of checkboxes are valid
            }

            inputElement = createCheckboxGroup(numCheckboxes, checkboxLabel);
            break;




    }

    if (inputElement) {
        form.appendChild(inputElement.container);
        // Add the dropped field to the array
        droppedFields.push({ id: inputElement.fieldElement.id, label: inputElement.container.querySelector('.custom-label').textContent });
    }
});

// Function to create an input element
function createInput(type, placeholder) {
    return createField('input', type, placeholder);
}

// Function to create a select element
function createSelect(placeholder) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('field-container'); // Add class for spacing
    selectContainer.classList.add('draggable-container');

    const label = document.createElement('label');
    label.textContent = placeholder;
    label.classList.add('custom-label');

    const selectElement = document.createElement('select');
    selectElement.id = `field-${fieldCount}`;
    fieldCount++;

    const option = document.createElement('option');
    option.value = '';
    option.text = placeholder;
    selectElement.appendChild(option);

    selectContainer.appendChild(label);
    selectContainer.appendChild(selectElement);

    // Add context menu for setting label
    addContextMenuForField(selectElement, label);

    return { container: selectContainer, fieldElement: selectElement };
}



// Function to create a radio button group
function createRadioButtonGroup(label, numRadioButtons) {
    const container = document.createElement('div');
    container.classList.add('radio-group');
    container.classList.add('field-container'); // Add class for spacing
    container.classList.add('draggable-container');

    const groupName = `radio-group-${fieldCount}`;
    const radioOptions = []; // Array to store radio button options


    for (let i = 0; i < numRadioButtons; i++) {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = groupName;
        radioButton.value = `Option ${i + 1}`;

        const radioLabel = document.createElement('label');
        radioLabel.textContent = `Option ${i + 1}`;

        container.appendChild(radioButton);
        container.appendChild(radioLabel);
        container.appendChild(document.createElement('br'));

        radioOptions.push({ value: radioButton.value, label: radioLabel.textContent });
    }

    // Create label for the radio button group
    const groupLabel = document.createElement('label');
    groupLabel.textContent = label;
    groupLabel.classList.add('custom-label');

    container.insertBefore(groupLabel, container.firstChild);

    // Make the container draggable
    container.draggable = true;

    // Append the container to the form or the DOM
    form.appendChild(container); // You can change this to the appropriate container if needed

    // Add the dropped field to the array with label, ID, and options
    droppedFields.push({ id: groupName, label: label, options: radioOptions });

    // Increment field count
    fieldCount++;

    return { container };



}

// Function to create a field (input or select)
function createField(tagName, type, placeholder) {
    const container = document.createElement('div');
    container.classList.add('field-container'); // Add class for spacing
    container.classList.add('draggable-container');

    const label = document.createElement('label');
    label.textContent = placeholder;
    label.classList.add('custom-label');

    const fieldElement = document.createElement(tagName);
    if (type) {
        fieldElement.type = type;
    }
    fieldElement.placeholder = placeholder;

    container.appendChild(label);
    container.appendChild(fieldElement);

    // Set unique ID
    const id = `field-${fieldCount}`;
    fieldElement.id = id;
    label.htmlFor = id;

    // Make the container draggable
    container.draggable = true;

    // Add context menu for setting label
    addContextMenuForField(fieldElement, label);

    return { container, fieldElement };
}


function createCheckboxGroup(numCheckboxes, checkboxLabel) {
    const groupContainer = document.createElement('div');
    groupContainer.classList.add('field-container');
    groupContainer.classList.add('draggable-container');

    const groupName = `checkbox-group-${fieldCount}`;

    // Create label for the checkbox group
    const groupLabel = document.createElement('label');
    groupLabel.textContent = checkboxLabel;
    groupLabel.classList.add('custom-label');
    groupContainer.appendChild(groupLabel);

    // Create a container div for the checkboxes
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.style.border = '1px solid #ccc'; // Add border style
    checkboxesContainer.style.padding = '10px'; // Add padding
    checkboxesContainer.style.marginTop = '5px'; // Add margin to separate from the label
    groupContainer.appendChild(checkboxesContainer);

    for (let i = 0; i < numCheckboxes; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = groupName;
        checkbox.value = `Option ${i + 1}`;

        const label = document.createElement('label');
        label.textContent = `Option ${i + 1}`;

        checkboxesContainer.appendChild(checkbox); // Append checkbox to checkboxesContainer
        checkboxesContainer.appendChild(label); // Append label to checkboxesContainer
        checkboxesContainer.appendChild(document.createElement('br')); // Add line break
    }
    fieldCount++;

    return { container: groupContainer };
}






// Function to add context menu for setting label
function addContextMenuForField(fieldElement, label) {
    fieldElement.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent default context menu

        const contextMenu = [
            { label: 'Set Label', action: function () { setLabel(label); } },
            { label: 'Set ID', action: function () { setId(fieldElement); } },
            { label: 'Set as Read-Only', action: function () { setReadOnly(fieldElement); } },
            { label: 'Set as Editable', action: function () { setEditable(fieldElement); } },
            { label: 'Delete', action: function () { deleteField(fieldElement.parentNode); } }
        ];

        if (fieldElement.tagName.toLowerCase() === 'select') {
            // Add option to add options for select element
            contextMenu.push({ label: 'Add Options', action: function () { addOptions(fieldElement); } });
        }

        // Create context menu
        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.left = event.clientX + 'px';
        menuContainer.style.top = event.clientY + 'px';
        menuContainer.style.backgroundColor = '#f9f9f9';
        menuContainer.style.padding = '5px';
        menuContainer.style.border = '1px solid #ccc';

        contextMenu.forEach(function (item) {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.label;
            menuItem.style.cursor = 'pointer';
            menuItem.onclick = function () {
                item.action();
                menuContainer.remove(); // Remove context menu after action
            };
            menuContainer.appendChild(menuItem);
        });

        document.body.appendChild(menuContainer);

        // Hide context menu when clicking outside of it
        document.addEventListener('click', function (e) {
            if (!menuContainer.contains(e.target)) {
                menuContainer.remove();
            }
        });
    });
}

// Function to add options for the select element
function addOptions(selectElement) {
    const newOption = prompt('Enter new option:');
    if (newOption) {
        const option = document.createElement('option');
        option.value = newOption;
        option.text = newOption;
        selectElement.appendChild(option);
    }
}

// Function to set label for the input element
function setLabel(label) {
    const newLabel = prompt('Enter label:');
    if (newLabel !== null && newLabel.trim() !== '') {
        label.textContent = newLabel; // Set the label text
        const fieldId = label.htmlFor;
        const field = droppedFields.find(field => field.id === fieldId);
        if (field) {
            field.label = newLabel; // Update label in droppedFields array
        }
    }
}

// Function to set ID for the input element
function setId(fieldElement) {
    const id = prompt('Enter ID:');
    if (id !== null && id.trim() !== '') {
        const existingElement = document.getElementById(id);
        if (existingElement && existingElement !== fieldElement) {
            // ID already exists
            alert("This ID is already assigned to another element. Please choose a different ID.");
        } else {
            fieldElement.id = id; // Set the ID
            const label = fieldElement.previousElementSibling;
            const field = droppedFields.find(field => field.label === label.textContent);
            if (field) {
                field.id = id; // Update ID in droppedFields array
            }
        }
    }
}

// Function to delete the field and associated label
function deleteField(container) {
    container.remove();
}

// Function to set input field as read-only
function setReadOnly(fieldElement) {
    if (fieldElement.tagName.toLowerCase() === 'select') {
        fieldElement.disabled = true;
    } else if (fieldElement.type === 'checkbox') {
        fieldElement.disabled = true;
    } else if (fieldElement.type === 'radio') {
        // Disable all radio buttons in the same group
        const groupName = fieldElement.name;
        const radioButtons = document.querySelectorAll(`input[name="${groupName}"]`);
        radioButtons.forEach(radioButton => {
            radioButton.disabled = true;
        });
    } else {
        fieldElement.readOnly = true;
    }
}

// Function to set input field as editable
function setEditable(fieldElement) {
    if (fieldElement.tagName.toLowerCase() === 'select') {
        fieldElement.disabled = false;
    } else if (fieldElement.type === 'checkbox') {
        fieldElement.disabled = false;
    } else if (fieldElement.type === 'radio') {
        // Enable all radio buttons in the same group
        const groupName = fieldElement.name;
        const radioButtons = document.querySelectorAll(`input[name="${groupName}"]`);
        radioButtons.forEach(radioButton => {
            radioButton.disabled = false;
        });
    } else {
        fieldElement.readOnly = false;
    }
}

// Function to save dropped fields to JSON and display in output column
function saveFieldsToJson() {

    // Prompt user for file name
    const fileName = prompt("Enter a name for your JSON file:");
    if (!fileName) {
        return; // If user cancels or enters an empty string, do nothing
    }

    // Update radio button fields
    updateRadioButtonFields();

    // Loop through dropped fields to update values
    droppedFields.forEach(field => {
        const fieldElement = document.getElementById(field.id);
        if (fieldElement) {
            if (fieldElement.tagName.toLowerCase() === 'select') {
                field.value = fieldElement.value || ''; // Update value
                field.label = fieldElement.previousElementSibling.textContent; // Update label
            } else if (fieldElement.type === 'checkbox') {
                field.value = fieldElement.checked; // Update value for checkbox
                field.label = fieldElement.previousElementSibling.textContent; // Update label
            } else if (fieldElement.type === 'radio') {
                // For radio buttons, check which one is selected
                const selectedRadioButton = document.querySelector(`input[name="${fieldElement.name}"]:checked`);
                if (selectedRadioButton) {
                    field.value = selectedRadioButton.value; // Update value
                    field.label = selectedRadioButton.nextElementSibling.textContent; // Update label
                }

            } else {
                field.value = fieldElement.value || ''; // Update value for text fields
                field.label = fieldElement.previousElementSibling.textContent; // Update label
            }
        }
    });

    // Display form summary
    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = ''; // Clear previous content

    droppedFields.forEach(field => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `<strong>${field.label} (ID: ${field.id}):</strong> ${field.value}`;
        summaryList.appendChild(listItem);
    });

    // Convert to JSON
    const jsonContent = JSON.stringify(droppedFields, null, 2);

    // Trigger download
    const file = new Blob([jsonContent], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName + '.json'; // Set the file name based on user input    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to update dropped fields for radio button groups
function updateRadioButtonFields() {
    droppedFields.forEach(field => {
        if (field.options && field.options.length > 0) {
            field.options.forEach(option => {
                const radioButton = document.getElementById(option.id);
                if (radioButton) {
                    option.label = radioButton.nextElementSibling.textContent;
                    option.id = radioButton.id;
                    option.value = radioButton.checked;
                }
            });
        }
    });
}

// Event listener for the download button
const downloadJsonButton = document.getElementById('downloadJsonButton');
downloadJsonButton.addEventListener('click', saveFieldsToJson);
