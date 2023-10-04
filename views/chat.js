   const token = localStorage.getItem('token');
        function addMessage(message, name, currUserName) {
            const messageBox = document.getElementById('message-box');
            const newMessage = document.createElement('div');
            if(name == currUserName){
                name = "You"
            }
            newMessage.textContent = name+ ": " + message;
            messageBox.appendChild(newMessage);
        }

        // Event listener for the Send button
        document.getElementById('send-button').addEventListener('click', async () => {
            const messageInput = document.getElementById('message-input');
            const messages = messageInput.value;
            const messageObj = {
                messages
            }
            try{
            const res = await axios.post('http://localhost:3000/chat/post-chat', messageObj, {headers: {"Authorization": token}});
            addMessage(messages, "You");
            if (messages.trim() !== '') {
                messageInput.value = ''; // Clear the input field
            }
          }
         catch(err) {
            console.log(err);
         }
        });

        
    document.addEventListener('DOMContentLoaded', async () => {

       const initialMessages = await axios.get('http://localhost:3000/chat/get-chat', {headers: {"Authorization": token}})
        initialMessages.data.messages.forEach(function(message) {
            addMessage(message.messages, message.name, initialMessages.data.name);
        });
    })