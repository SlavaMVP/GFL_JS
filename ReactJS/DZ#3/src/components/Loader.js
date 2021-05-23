import React from 'react';

export default function Loader() {
  return (
    <div className='text-center'>
      <div className='loader'>
        <p>Loading...</p>
        <div className='loader-inner'></div>
        <div className='loader-inner'></div>
        <div className='loader-inner'></div>
      </div>
    </div>
  );
}
