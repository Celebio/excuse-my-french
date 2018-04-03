import React from 'react';
import {render} from 'react-dom';

import AwesomeComponent from './another.jsx';
import SentenceGenerator from '../../../js/sentencegenerator.js'

class App extends React.Component {
  render() {
    return (
        <div>
          <p> Hello Reactorr!</p>
          <AwesomeComponent />
        </div>
    );
  }
}

render(<App/>, document.getElementById('root'));

let sentenceGenerator = new SentenceGenerator();
sentenceGenerator.generateWords();


