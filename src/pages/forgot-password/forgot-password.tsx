import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  forgotPassword,
  selectUserError
} from '../../slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const error = useSelector(selectUserError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserError());
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((data) => {
      if (data.payload) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error?.toString()}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
