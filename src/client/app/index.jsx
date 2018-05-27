import React from 'react';
import {render} from 'react-dom';
import SentenceGenerator, {WordTypes} from '../../../js/sentencegenerator.js';

import AwesomeComponent from './another.jsx';
import ExerciceComponent from './exercicecomponent.jsx';

var score = 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onScoreChange = this.onScoreChange.bind(this);
    this.generateQuestionAnswerSentences = this.generateQuestionAnswerSentences.bind(this);
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

  generateQuestionAnswerSentences(){
    // let pattern = [
    //     {'type':WordTypes.SUJET},
    //     {'type':WordTypes.VERBE, 'subset':'deplacement'},
    //     {'type':WordTypes.LIEU, 'subset':'ville'}
    // ];
    // let pattern = [
    //     {'type':WordTypes.SUJET},
    //     {'type':WordTypes.VERBE, 'subset':'action'},
    //     {'type':WordTypes.COD}
    // ];

    let pattern = [
        {'type':WordTypes.SUJET},
        {'type':WordTypes.VERBE, 'subset':'action-coi'},
        {'type':WordTypes.COD},
        // {'type':WordTypes.COI}
    ];

    // let pattern = [
    //     {'type':WordTypes.SUJET},
    //     {'type':WordTypes.VERBE, 'subset':'transitifs-indirect-qqun'},
    //     {'type':WordTypes.COI}
    // ];


    let tense = 'passecompose';
    let applyPronomCOD = true;
    let applyPronomCOI = false;
    let applyPronomLieu = false;
    let applyNegation = false;

    let sentenceGenerator = new SentenceGenerator();
    let sentence = sentenceGenerator.generate(pattern, 'present');
    let answerSentence = sentenceGenerator.generateModified(sentence, tense, applyPronomCOD, applyPronomCOI, applyPronomLieu, applyNegation);

    return {sentence:sentence, answerSentence:answerSentence};
  }

  render() {
    return (
        <div>
          <ExerciceComponent title="Transformez la phrase comme ceci:" generateQuestionAnswerSentences={this.generateQuestionAnswerSentences} onScoreChange={this.onScoreChange} />
        </div>
    );
  }
}

render(<App/>, document.getElementById('root'));



