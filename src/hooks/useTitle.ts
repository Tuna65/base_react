import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/modules/auth';
import { titleSelector } from '../store/modules/auth/selector';

export const useTitle = (title?: string) => {
  const getTitle = useSelector(titleSelector);
  const dispatch = useDispatch();

  const sendTitle = () => {
    dispatch(authActions.transferTitle(title ?? ''));
  };

  useEffect(() => {
    sendTitle();
  }, [title]);

  const results: {
    title?: string;
    onSendTitle?: typeof sendTitle;
  } = {
    title: getTitle,
    onSendTitle: sendTitle,
  };

  document.title = title ?? '';

  const link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
  // link.href = 'https://iris-buck.s3.ap-southeast-1.amazonaws.com/production/logo.ico';

  return results;
};
