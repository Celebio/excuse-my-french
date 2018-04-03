import React from 'react';
import {render} from 'react-dom';

import AwesomeComponent from './another.jsx';
import ExerciceComponent from './exercicecomponent.jsx';


class App extends React.Component {
  render() {
    return (
        <div>
          <ExerciceComponent />
        </div>
    );
  }
}

render(<App/>, document.getElementById('root'));



