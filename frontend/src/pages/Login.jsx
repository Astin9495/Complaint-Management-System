
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth?.() || { login: () => {} }; // safe if context optional
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, headers } = await api.post('/api/auth/login', formData);

      
      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        headers?.authorization?.replace(/^Bearer\s+/i, '') ||
        headers?.['x-auth-token'];

      if (!token) {
        console.error('Login response missing token:', data, headers);
        return alert('Login succeeded, but no token was returned by the server.');
      }

      
      sessionStorage.setItem('token', token);

    
      login({ token, user: data?.user });

      
      navigate('/complaints', { replace: true });
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
