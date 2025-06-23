import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
     const { success } = await login(email, password);
     if (success) {
      navigate('/dashboard');
    }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default Login;