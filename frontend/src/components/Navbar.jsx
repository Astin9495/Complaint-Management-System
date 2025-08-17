import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    logout();
    navigate('/login', { replace: true });
  };

  const isAuthed = !!(user || sessionStorage.getItem('token'));

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">COMPLAINT DESK</Link>
      <div>
        {isAuthed ? (
          <>
            <Link to="/complaints" className="mr-4"></Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
