import React, {useEffect, useState} from 'react';
import Toast, {ToastType, ToastPosition} from './Toast';
import {registerToastHandler} from './ToastService';

const GlobalToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('none');
  const [position, setPosition] = useState<ToastPosition>('top');
  const [offset, setOffset] = useState<number>(82);

  useEffect(() => {
    registerToastHandler(
      (
        msg: string,
        t: ToastType = 'none',
        pos?: ToastPosition,
        off?: number,
      ) => {
        setMessage(msg);
        setType(t);
        setPosition(pos ?? 'top');
        setOffset(off ?? 82);
        setVisible(true);
      },
    );

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
      position={position}
      offset={offset}
    />
  );
};

export default GlobalToast;
