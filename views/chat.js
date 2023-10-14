const token = localStorage.getItem('token');
const socket = io('http://13.235.76.75:3000');
const createGroup = document.getElementById('create-group');
const groupList = document.getElementById('group-list');
const messageBox = document.getElementById('message-box');
const addUsers = document.getElementById('add-users');

// Event listener for creating a new group
function addGroups(id, name) {
    // Create a new list item
    const list = document.createElement('li');
    list.textContent = name;
    list.setAttribute('data-id', id);

    // Attach a click event listener to the list item
    list.addEventListener('click', async () => {
        const chatBlock = document.getElementById('chat-block');
        const msg = document.getElementById('msg');
        msg.style.display = 'none';
        const showUsersButton = document.getElementById('show-group-users');
        showUsersButton.style.display = 'block';
        chatBlock.style.display = 'block';
        addUsers.style.display = 'block';
        messageBox.innerHTML = '';
        const Id = list.getAttribute('data-id');
        localStorage.setItem('groupId', Id);

        try {
            const res = await axios.get(`http://13.235.76.75:3000/chat/get-chat/${Id}`, {
                headers: { "Authorization": token }
            });
            const name = res.data.name;
            const newMessages = res.data.messages;
            for (const element of newMessages) {
                addMessage(element.messages, element.name, name);
            }

        } catch (err) {
            console.log(err);
        }
    });

    // Append the new list item to the group list
    groupList.appendChild(list);

}
createGroup.addEventListener('click', async () => {
    const groupname = prompt("Enter your group name");

    const groupNameObj = {
        groupname
    };
    if (groupname) {
        try {
            const res = await axios.post('http://13.235.76.75:3000/chat/post-group', groupNameObj, { headers: { "Authorization": token } });
            // Clear the input field
            const group = res.data.group;
            addGroups(group.id, group.groupname);


        } catch (err) {
            console.log(err);
        }
    }
})

addUsers.addEventListener('click', async () => {
    const Id = localStorage.getItem('groupId');
    const res = await axios.get(`http://13.235.76.75:3000/chat/check-admin/${Id}`, {
        headers: { "Authorization": token }
    });
    const isAdmin = res.data.isAdmin;
    if (isAdmin) {
        const userDetailInput = prompt('Enter user email (comma-separated):');

        if (userDetailInput) {
            // Split the user details by comma to get an array of details
            const userDetails = userDetailInput.split(',');

            // Send the user details to the backend
            sendUserDetailsToBackend(userDetails);
        }
    }
    else {
        alert("You are not admin, you can't add users in this group");
    }
});

// Function to send user details to the backend
async function sendUserDetailsToBackend(userDetails) {
    try {
        const groupId = localStorage.getItem('groupId');
        const response = await axios.post('http://13.235.76.75:3000/chat/add-user', {
            groupId,
            userDetails,
        }, {
            headers: { "Authorization": token }
        });

        alert(response.data.message);
    } catch (error) {
        console.error('Error adding members to the group:', error);
        // Handle any errors (e.g., show an error message)
        alert('An error occurred while adding members to the group.');
    }
}


//Get groups
document.addEventListener('DOMContentLoaded', async () => {
    try {

        const res = await axios.get(`http://13.235.76.75:3000/chat/get-groups`, { headers: { "Authorization": token } });
        const groups = res.data.group;

        for (const group of groups) {
            addGroups(group.id, group.groupname);
        }

    }
    catch (err) {
        console.log(err);
    }

})



const receivedMessages = document.getElementById('received-messages');
const sentMessages = document.getElementById('sent-messages');

function addMessage(message, name, currUserName) {
    const newMessage = document.createElement('div');
    if (name === currUserName) {
        newMessage.classList.add('sent', 'message-content');
      } else {
        newMessage.classList.add('received', 'message-content');
        newMessage.textContent = name + ": ";
      }
  
    const fileExtension = message.split('.').pop().toLowerCase();
    const extensions = ['mp4', 'webm', 'ogg', 'mov', 'png', 'jpg', 'jpeg', 'gif','bmp', 'pdf', 'docx', 'csv'];
  
    // Create a download link for all types (video, image, PDF, etc.)
    if (extensions.includes(fileExtension)) {
      const p = document.createElement('p');
      p.textContent = `.${fileExtension} file: `
      const downloadLink = document.createElement('a');
      downloadLink.href = message;
      downloadLink.textContent = 'Download';
      p.appendChild(downloadLink);
      newMessage.appendChild(p);
      if (name != currUserName) {
        newMessage.style.outline= '2px solid black'
        newMessage.style.width ='10%'
        newMessage.style.margin = '7px'
      }
      
    }
    else{
        newMessage.textContent = message;
    }
  
    messageBox.appendChild(newMessage);
    newMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  


// JavaScript to handle file input selection and display selected files
let selectedFile = null;
const fileInput = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file-btn');
const selectedFilesContainer = document.getElementById('selected-files');

// Function to handle file selection
fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    selectedFilesContainer.innerHTML = ''; // Clear previous selections
        selectedFile = files[0];
        const fileItem = document.createElement('div');
        fileItem.textContent = `Selected file: ${selectedFile.name}`;
        selectedFilesContainer.appendChild(fileItem);
    
});


chooseFileBtn.addEventListener('click', () => {
    fileInput.click();
});


// Event listener for the Send button
document.getElementById('send-button').addEventListener('click', async () => {
    const messageInput = document.getElementById('message-input');
    const messages = messageInput.value;
    const groupId = localStorage.getItem('groupId');
    const messageObj = {
        messages
    }
    if (messages) {
        try {

            const res = await axios.post('http://13.235.76.75:3000/chat/post-chat', { messageObj, groupId }, { headers: { "Authorization": token } });
            socket.emit('chatMessage', messages);
            if (messages.trim() !== '') {
                messageInput.value = ''; // Clear the input field
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    if (selectedFile) {
        //FormData to send the file to the backend
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('groupId', groupId);

        selectedFilesContainer.innerHTML = '';
        axios.post('http://13.235.76.75:3000/chat/post-file', formData, { headers: { "Authorization": token } })
            .then((response) => {
                socket.emit('chatMessage', messages);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }
});


// document.addEventListener('DOMContentLoaded', () => {
//     const existingData = JSON.parse(localStorage.getItem('messages')) || [];
//     const name = localStorage.getItem('name');
//     for (const element of existingData) {
//         addMessage(element.messages, element.name, name);

//     }
// })
// const MAX_MESSAGES = 100;
// async function storeInLocalStorage(data, name) {

//     try {
//         const existingData = JSON.parse(localStorage.getItem('messages')) || [];
//         console.log(existingData.length)
//         const newMessages = [...existingData, ...data];
//         // Ensure we only keep the latest MAX_MESSAGES messages
//          const trimmedMessages = newMessages.slice(-MAX_MESSAGES);
//         localStorage.setItem('messages', JSON.stringify(trimmedMessages));


//         for (const element of newMessages) {
//             addMessage(element.messages, element.name, name);
//             id = element.id;
//         }
//     } catch (error) {
//         console.error('Error while storing data in local storage:', error);
//     }

// }
// const existingData = JSON.parse(localStorage.getItem('messages')) || [];
// const lastElement = existingData[existingData.length - 1] || 0;
// let id = lastElement.id;
async function fetchAndStoreMessages() {
    const Id = localStorage.getItem('groupId');

    try {

        const res = await axios.get(`http://13.235.76.75:3000/chat/get-chat/${Id}`, {
            headers: { "Authorization": token }
        });
        const name = res.data.name;
        const newMessages = res.data.messages;
        messageBox.innerHTML = '';
        for (const element of newMessages) {
            addMessage(element.messages, element.name, name);
        }

    } catch (err) {
        console.log(err);
    }
}

// Listen for new chat message
socket.on('newChatMessage', messages => {
    // Handle the received message
    fetchAndStoreMessages();
});

