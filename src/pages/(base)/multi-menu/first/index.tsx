import { redirect } from 'react-router-dom';

export const loader = () => {
  return redirect('child');
};
