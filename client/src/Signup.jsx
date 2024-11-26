import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { username, password })
      .then((response) => {
        setMessage(response.data.message); // Display success message
        console.log('Response:', response.data);

        // If login is successful, store the username and redirect to the dashboard
        if (response.data.message === 'Login successful') {
          // Store the username in localStorage
          localStorage.setItem('username', response.data.user.username);

          // Redirect to the dashboard page
          navigate('/dashboard');
        }
        // If user is registered, store the username and redirect to dashboard
        else if (response.data.message === 'User registered successfully') {
          // Store the username in localStorage
          localStorage.setItem('username', username); // Assuming the registered username is sent in the response

          // Redirect to the dashboard after successful registration
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || 'Error occurred'); // Display error message
        console.error('Error:', error);
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2 style={{display:"flex", justifyContent:"center"}}>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="Username">
              <strong>Username</strong>
            </label>
            <input 
              type="text"
              placeholder='Enter Username'
              autoComplete='off'
              name='username'
              className='form-control rounded-0'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="Password">
              <strong>Password</strong>
            </label>
            <input 
              type="password"
              placeholder='Enter Password'
              name='password'
              className='form-control rounded-0'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>
            Login / Register
          </button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
};

export default Signup;
