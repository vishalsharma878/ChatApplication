
// Function to open the popup and populate it with user data
function openPopup(userData) {
    const popup = document.getElementById('popup');
    const userList = document.getElementById('user-list');

    userList.innerHTML = '';

    userData.forEach(user => {
        const listItem = document.createElement('li');
        listItem.classList.add('user-list-item');
        listItem.textContent = user.name + " " + user.mobile + " " + user.email;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', async () => {
            console.log('Remove user:', user.id);
            const Id = localStorage.getItem('groupId');
            try {
                const res = await axios.delete(`http://13.235.76.75:3000/remove-user/${Id}/${user.id}`, {
                    headers: { "Authorization": token }
                });
                userList.removeChild(listItem);
                alert(res.data.message);
            } catch (err) {
                alert(err.response.data.message);
            }
        });

        const makeAdminButton = document.createElement('button');
        makeAdminButton.textContent = 'Make Admin';
        makeAdminButton.addEventListener('click', async () => {
            console.log('Make admin:', user.id);
            const Id = localStorage.getItem('groupId');
            try {
                const res = await axios.put(
                    `http://13.235.76.75:3000/make-user-admin/${Id}/${user.id}`,
                    {},
                    {
                        headers: {
                            "Authorization": token
                        }
                    }
                );

                alert(res.data.message);
            } catch (err) {
                alert(err.response.data.message);
            }
        });

        listItem.appendChild(removeButton);
        listItem.appendChild(makeAdminButton);

        userList.appendChild(listItem);
    });

    // Show the popup
    popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

document.getElementById('show-group-users').addEventListener('click', async () => {
    const Id = localStorage.getItem('groupId'); // Replace with the actual group ID
    try {
        const userData = await axios.get(`http://13.235.76.75:3000/get-group-users/${Id}`);
        openPopup(userData.data);
    } catch (err) {
        alert(err.response.data.message);
    }

});

// Event listener for closing the popup
document.getElementById('close-popup').addEventListener('click', closePopup);
