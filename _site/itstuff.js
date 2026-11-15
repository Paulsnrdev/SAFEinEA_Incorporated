  //Creating and Removing Elements
        let elementCount = 0;
        
        function createElement() {
            elementCount++;
            const newElement = document.createElement('div');
            newElement.className = 'new-element';
            newElement.textContent = `Dynamically created element #${elementCount}`;
            
            const container = document.getElementById('element-container');
            container.appendChild(newElement);
        }





        //Event Delegation
        let itemCount = 3;
        const itemList = document.getElementById('item-list');

        // Single event listener for all delete buttons
        itemList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                e.target.parentElement.remove();
                logEvent('Item deleted via event delegation');
            }
        });

        document.getElementById('add-item').addEventListener('click', function() {
            itemCount++;
            const newItem = document.createElement('div');
            newItem.className = 'list-item';
            newItem.innerHTML = `Item ${itemCount} <button class="delete-btn">Delete</button>`;
            itemList.appendChild(newItem);
            logEvent('New item added');
        });




         // Confirm password validation
        document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);

        function validatePasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (confirmPassword.length === 0) {
                return;
            }
            
            if (password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
            } else {
                showSuccess('confirmPassword');
            }
        }
