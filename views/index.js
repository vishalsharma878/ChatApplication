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
        // Handle the error gracefully (e.g., show an error message to the user)
    }
})