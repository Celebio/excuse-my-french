import React from 'react';
import {render} from 'react-dom';

import AwesomeComponent from './another.jsx';
import ExerciceComponent from './exercicecomponent.jsx';

var score = 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onScoreChange = this.onScoreChange.bind(this);
  }

  onScoreChange(additionalScore){
    if (additionalScore){

        score += additionalScore;
        let dom = document.getElementById("scoreSpan");
        dom.innerHTML = score;

        setTimeout(function(){
            if (additionalScore > 0){
                dom.className = 'animateEmphGreen';
            } else {
                dom.className = 'animateEmphRed';
            }
            setTimeout(function(){
                dom.className = '';
            }, 2000);
        }, 1000);
    }
  }

  render() {
    return (
        <div>
          <ExerciceComponent onScoreChange={this.onScoreChange} />
        </div>
    );
  }
}

render(<App/>, document.getElementById('root'));



