import React from 'react';

export default function ServerError() {
  return (
    <div className='alert alert-danger' role='alert'>
      Service Temporary Unavailable. <br />
      Try Again Later.
    </div>
  );
}
