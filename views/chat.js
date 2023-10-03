
        function addMessage(message) {
            const messageBox = document.getElementById('message-box');
            const newMessage = document.createElement('div');
            newMessage.textContent = message;
            messageBox.appendChild(newMessage);
        }

        // Event listener for the Send button
        document.getElementById('send-button').addEventListener('click', function() {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;

            if (message.trim() !== '') {
                addMessage(message);
                messageInput.value = ''; // Clear the input field
            }
        });

        
    document.addEventListener('DOMContentLoaded', async () => {

       const initialMessages = await axios.get('http://localhost:3000/chat/get-chat')
        initialMessages.forEach(function(message) {
            addMessage(message);
        });
    })