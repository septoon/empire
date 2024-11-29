'use client'

import { useDispatch } from 'react-redux';
import { openModal } from '../GlobalRedux/Features/modal/modalSlice';

const ToOrderButton = () => {
  const dispatch = useDispatch();
  
  const handleOpen = () => {
    dispatch(openModal());
  };

  return (
    <div>
        <button className="w-full py-2 text-xl font-bold bg-tahiti text-white rounded-lg" onClick={handleOpen}>Заисаться</button>
        
    </div>
  )
}

export default ToOrderButton