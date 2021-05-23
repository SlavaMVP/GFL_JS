import React from 'react';

export default function Pager({
  previous,
  next,
  handleClickPrev,
  handleClickNext,
}) {
  return (
    <nav aria-label='pager'>
      <ul className='pager'>
        <li className={previous ? '' : 'disabled'}>
          <a href={previous} onClick={handleClickPrev}>
            Previous
          </a>
        </li>
        <li className={next ? '' : 'disabled'}>
          <a href={next} onClick={handleClickNext}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}
