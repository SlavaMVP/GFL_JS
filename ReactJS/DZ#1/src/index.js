import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const str = 'Hello World!!';

// const element = <h1>{str}</h1>;

// const element = React.createElement('h1', null, 'Hello React');
// const element = React.createElement('h1', {
//   children: <small>sub text</small>,
// });

// console.log(element);

ReactDOM.render(<App name={str} />, document.getElementById('root'));
