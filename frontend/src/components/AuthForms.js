import React, { useState } from 'react';
import axios from 'axios';

function AuthForms({ history }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      // Login
      axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      }).then(res => {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/mood';
      }).catch(() => setError('Invalid credentials'));
    } else {
      // Signup
      axios.post('http://localhost:5000/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }).then(() => {
        setIsLogin(true);
      }).catch(() => setError('Registration failed'));
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default AuthForms;
