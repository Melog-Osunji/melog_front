import React, {useEffect, useState} from 'react';
import Toast, {ToastType} from './Toast';
import {registerToastHandler} from './ToastService';

const GlobalToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('none');

  useEffect(() => {
    registerToastHandler((msg: string, t: ToastType = 'none') => {
      setMessage(msg);
      setType(t);
      setVisible(true);
    });

    return () => {
      registerToastHandler(null);
    };
  }, []);

  return (
    <Toast
      message={message}
      type={type}
      visible={visible}
      onHide={() => setVisible(false)}
      position="top"
      offset={82}
    />
  );
};

export default GlobalToast;