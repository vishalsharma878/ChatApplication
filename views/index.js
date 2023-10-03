const signup = document.getElementById('sign-up')

signup.addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('user').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('pass').value;

    const signupData = {
        name,
        email,
        mobile,
        password
    }
     signup.reset();
     try {
        const res = await axios.post('http://localhost:3000/user/signup', signupData);
        alert(res.data.message);
    } 
    catch (error) {
        console.error(error);
        alert("User already exist");
    }
})


const login = document.getElementById('login')

login.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('password').value;
    
    const loginData = { 
        email,
        password
    }
     login.reset();
     try {
        const res = await axios.post('http://localhost:3000/user/login', loginData);
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href ='/views/chat.html';
    } 
    catch (error) {
        console.error(error);
        alert(error.response.data.message);
    
    }
})    