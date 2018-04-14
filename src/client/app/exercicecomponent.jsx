
import React from 'react';
import SentenceGenerator, {WordTypes} from '../../../js/sentencegenerator.js';
import SentenceChecker from '../../../js/sentencechecker.js';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import Sentence from './sentence.jsx';




class ExerciceComponent extends React.Component {
  generateQuestionAnswerSentences(){
    let pattern = [
        {'type':WordTypes.SUJET},
        {'type':WordTypes.VERBE, 'subset':'deplacement'},
        {'type':WordTypes.LIEU, 'subset':'ville'}
    ];
    let tense = 'passecompose';
    let applyPronomCOD = false;
    let applyPronomCOI = false;
    let applyPronomLieu = false;
    let applyNegation = false;

    let sentenceGenerator = new SentenceGenerator();
    let sentence = sentenceGenerator.generate(pattern, 'present');
    let answerSentence = sentenceGenerator.generateModified(sentence, tense, applyPronomCOD, applyPronomCOI, applyPronomLieu, applyNegation);

    return {sentence:sentence, answerSentence:answerSentence};
  }

  constructor(props) {
    super(props);

    let {sentence:exampleSentence, answerSentence:exampleAnswerSentence} = this.generateQuestionAnswerSentences();
    let {sentence, answerSentence} = this.generateQuestionAnswerSentences();

    // sentence.forEach(function(item){
    //     console.log(item);
    // });

    this.state = {
                  'example':{
                    'sentence' : exampleSentence,
                    'answerSentence' : exampleAnswerSentence
                  },
                  'current':{
                    'sentence' : sentence,
                    'answerSentence' : answerSentence
                  },
                  'correctAnswer':false,
                  'wrongAnswer':false,
                  'waitingAnswer':true
                 };
    console.log(this.state);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onEncoreClick = this.onEncoreClick.bind(this);
    this.onAnotherExampleClick = this.onAnotherExampleClick.bind(this);
  }


  onFormSubmit(event){
    if (event && event.preventDefault){
      event.preventDefault();
    }
    let sentenceChecker = new SentenceChecker();
    let correct = sentenceChecker.checkIfCorrect(this.state.current.answerSentence, this.textInput.value);
    this.state.waitingAnswer = false;
    let additionalScore = 0;
    if (correct){
      this.state.correctAnswer = true;
      this.state.wrongAnswer = false;
      additionalScore = 1;
    } else {
      this.state.correctAnswer = false;
      this.state.wrongAnswer = true;
      additionalScore = -1;
    }
    this.setState(this.state);
    console.log('skdjhskf');
    console.log(this);
    console.log(this.props);
    console.log(this.props.onScoreChange);
    this.props.onScoreChange(additionalScore);
    //console.log(this.textInput.value);
    //console.log(this.state);
    //if (this.textInput.value == )
  }
  onAnotherExampleClick(){
    let {sentence:exampleSentence, answerSentence:exampleAnswerSentence} = this.generateQuestionAnswerSentences();
    this.state.example = {
                        'sentence' : exampleSentence,
                        'answerSentence' : exampleAnswerSentence
                        };
    this.setState(this.state);
  }
  onEncoreClick() {
      let {sentence, answerSentence} = this.generateQuestionAnswerSentences();
      this.textInput.value = "";
      this.state = {
                'example':this.state.example,
                'current':{
                  'sentence' : sentence,
                  'answerSentence' : answerSentence
                },
                'correctAnswer':false,
                'wrongAnswer':false,
                'waitingAnswer':true
               };
      this.setState(this.state);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="text-center">
            <h2>Conjugez le verbe au passé composé.</h2>
            <p className="lead">
              <b>Exemple :</b><br/>
                  <Sentence sentence={this.state.example.sentence} /><br/>
                  <Sentence sentence={this.state.example.answerSentence} /><br/>
                  <a className="anotherExampleButton" href="javascript:void(0)" onClick={this.onAnotherExampleClick}>Un autre exemple</a>
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <h3>Exercice : </h3>
            <div className="container">
                <div className="row">
                  <div className="col-12">
                    <Sentence sentence={this.state.current.sentence} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <form onSubmit={this.onFormSubmit}>
                      <div>
                        <input disabled={!this.state.waitingAnswer} spellCheck="false" type="text" className="form-control" id="address" placeholder="Votre réponse ici" required="" ref={(input) => this.textInput = input} />
                      </div>
                    </form>
                    { this.state.waitingAnswer &&
                      <div className="formSender">
                          <AwesomeButton action={this.onFormSubmit} type="primary">Envoyer</AwesomeButton>
                      </div>
                    }

                    { this.state.correctAnswer &&
                      <span>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                          <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                        </svg>
                        <p className="success">Bien vu!</p>
                        <AwesomeButton action={this.onEncoreClick} type="primary">Encore</AwesomeButton>
                      </span>
                    }
                    { this.state.wrongAnswer &&
                      <span>
                        <div>
                          <span>Ca devait être : </span>
                          <Sentence sentence={this.state.current.answerSentence} />
                        </div>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                          <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                          <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                        </svg>
                        <p className="error">Mince!</p>
                        <AwesomeButton action={this.onEncoreClick} type="primary">Encore</AwesomeButton>
                      </span>
                    }
                  </div>
                </div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}


export default ExerciceComponent;
