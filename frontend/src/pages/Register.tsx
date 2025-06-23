import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const { success } = await register(email, password, name);
      if (success) {
      navigate('/login');
     }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
};

export default Register;