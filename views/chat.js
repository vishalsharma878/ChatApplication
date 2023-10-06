   const token = localStorage.getItem('token');
   const messageBox = document.getElementById('message-box');
        function addMessage(message, name, currUserName) {
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
            if (messages.trim() !== '') {
                messageInput.value = ''; // Clear the input field
            }
          }
         catch(err) {
            console.log(err);
         }
        });


        document.addEventListener('DOMContentLoaded', () => {
            const existingData = JSON.parse(localStorage.getItem('messages')) || [];
            const name = localStorage.getItem('name');
            for (const element of existingData) {
                addMessage(element.messages, element.name, name);
                
            }
        })
        const MAX_MESSAGES = 100;
        async function storeInLocalStorage(data, name) {
            
            try {
                const existingData = JSON.parse(localStorage.getItem('messages')) || [];
                console.log(existingData.length)
                const newMessages = [...existingData, ...data];
                // Ensure we only keep the latest MAX_MESSAGES messages
                 const trimmedMessages = newMessages.slice(-MAX_MESSAGES);
                localStorage.setItem('messages', JSON.stringify(trimmedMessages));

                
                for (const element of newMessages) {
                    addMessage(element.messages, element.name, name);
                    id = element.id;
                }
            } catch (error) {
                console.error('Error while storing data in local storage:', error);
            }
        
        }
        const existingData = JSON.parse(localStorage.getItem('messages')) || [];
        const lastElement = existingData[existingData.length - 1] || 0;
        let id = lastElement.id;
        async function fetchAndStoreMessages() {
            try {
                const initialMessages = await axios.get(`http://localhost:3000/chat/get-chat/${id}`, {
                    headers: { "Authorization": token }
                });
                
                if (initialMessages.data.messages.length !== 0) {
                    messageBox.innerHTML = '';
                    await storeInLocalStorage(initialMessages.data.messages, initialMessages.data.name);
                }
            } catch (error) {
                console.error('Error while fetching and storing messages:', error);
            }
        }
        
        // Fetch and store messages initially
        fetchAndStoreMessages();
        
       // Periodically fetch and store new messages
       setInterval(fetchAndStoreMessages, 1000);
        