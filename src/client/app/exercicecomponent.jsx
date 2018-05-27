
import React from 'react';
import SentenceChecker from '../../../js/sentencechecker.js';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import Sentence from './sentence.jsx';
import SentenceDiff from './sentencediff.jsx';

String.prototype.insert = function (index, string) {
  var ind = index < 0 ? this.length + index  :  index;
  return  this.substring(0, ind) + string + this.substring(ind, this.length);
};


class SentenceBasedComponent extends React.Component {
  constructor(props){
    super(props);

    let {sentence, answerSentence} = this.props.generateQuestionAnswerSentences();
    this.state = {
      'sentence':sentence,
      'answerSentence':answerSentence
    };
  }
}





class ExampleSentenceComponent extends SentenceBasedComponent {
  constructor(props) {
    super(props);

    this.onAnotherExampleClick = this.onAnotherExampleClick.bind(this);
  }

  onAnotherExampleClick(){
    let {sentence:exampleSentence, answerSentence:exampleAnswerSentence} = this.props.generateQuestionAnswerSentences();
    this.setState((prevState, props) => ({
      'sentence' : exampleSentence,
      'answerSentence' : exampleAnswerSentence
    }));
  }

  render() {
    return (
      <div>
        <Sentence sentence={this.state.sentence} /><br/>
        <Sentence sentence={this.state.answerSentence} /><br/>
        <a className="anotherExampleButton" href="javascript:void(0)" onClick={this.onAnotherExampleClick}>Un autre exemple</a>
      </div>
    );
  }
}







class ExerciceSentenceComponent extends SentenceBasedComponent {
  constructor(props) {
    super(props);
    this.state = {
      'sentence':this.state.sentence,
      'answerSentence':this.state.answerSentence,
      'waitingAnswer':true,
      'inputValue':""
    };

    this.onHelperButtonClick = this.onHelperButtonClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onEncoreClick = this.onEncoreClick.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.setOnEnterHandler();
  }

  updateInputValue(e){
    let val = e.target.value;
    this.setState((prevState, props) => {
      let st = Object.assign({}, prevState, {'inputValue':val});
      return st;
    });
  }
  onHelperButtonClick(e, text){
    if (e.preventDefault){
      e.preventDefault();
    }
    let position = this.textInput.selectionStart;
    this.setState((prevState, props) => {
      let st = Object.assign({}, prevState);
      if (st.inputValue.length){
        st.inputValue = st.inputValue.substr(0, position-1) + text + st.inputValue.substr(position-1);
      }

      return st;
    });
    position++;
    let me = this;
    setTimeout(function(){
      me.textInput.focus();
      me.textInput.setSelectionRange(position, position);
    }, 1);
  }

  onFormSubmit(event){
    if (event && event.preventDefault){
      event.preventDefault();
    }
    let sentenceChecker = new SentenceChecker();
    let [correct, diffInfo] = sentenceChecker.checkIfCorrect(this.state.answerSentence, this.state.inputValue);
    let additionalScore = 0;
    let correctAnswer = false;
    let wrongAnswer = false;
    if (correct){
      correctAnswer = true;
      wrongAnswer = false;
      additionalScore = 1;
    } else {
      correctAnswer = false;
      wrongAnswer = true;
      additionalScore = -1;
    }
    this.setState((prevState, props) => ({
      'sentence':prevState.sentence,
      'answerSentence':prevState.answerSentence,
      'correctAnswer':correctAnswer,
      'wrongAnswer':wrongAnswer,
      'waitingAnswer':false,
      'sentencediff':diffInfo,
      'inputValue':prevState.inputValue
    }));

    this.props.onScoreChange(additionalScore);
  }

  prepareAnswerTextbox() {
    let me = this;
    setTimeout(function(){
      me.textInput.focus();
    }, 1);
  }

  onEncoreClick() {
    let {sentence, answerSentence} = this.props.generateQuestionAnswerSentences();
    this.prepareAnswerTextbox();
    this.setState((prevState, props) => ({
      'sentence' : sentence,
      'answerSentence' : answerSentence,
      'correctAnswer':false,
      'wrongAnswer':false,
      'waitingAnswer':true,
      'inputValue':""
    }));
  }

  setOnEnterHandler(){
    let me = this;
    window.onkeypress = function(e){
      if (e.code == "Enter"){
        if (me.state.waitingAnswer){
          me.onFormSubmit();
        } else {
          me.onEncoreClick();
        }
      }
    }
  }


  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <b>La phrase : </b>
            <Sentence sentence={this.state.sentence} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <b>Votre réponse : </b>
            <form onSubmit={ (e) => (e && e.preventDefault()) } >
              <div>
                <button disabled={!this.state.waitingAnswer} onClick={(e) => this.onHelperButtonClick(e, "è")}>è</button>
                <button disabled={!this.state.waitingAnswer} onClick={(e) => this.onHelperButtonClick(e, "é")}>é</button>
                <button disabled={!this.state.waitingAnswer} onClick={(e) => this.onHelperButtonClick(e, "ê")}>ê</button>
                <button disabled={!this.state.waitingAnswer} onClick={(e) => this.onHelperButtonClick(e, "à")}>à</button>
              </div>
              <div>
                <input value={this.state.inputValue} disabled={!this.state.waitingAnswer} spellCheck="false" type="text" className="form-control" onChange={this.updateInputValue} placeholder="Votre réponse ici" required="" ref={(input) => this.textInput = input} />
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
                <div className="success">
                  <div>
                    Bien vu!
                  </div>
                  <div>
                    <AwesomeButton action={this.onEncoreClick} type="primary">Encore!</AwesomeButton>
                  </div>
                </div>
              </span>
            }
            { this.state.wrongAnswer &&
              <span>
                <div>
                  <span>Ca devait être : </span>
                  <Sentence sentence={this.state.answerSentence} />
                  <SentenceDiff sentencediff={this.state.sentencediff} />
                </div>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                  <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                  <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                  <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                </svg>
                <div className="error">
                  <div>
                    Mince!
                  </div>
                  <div>
                    <AwesomeButton action={this.onEncoreClick} type="primary">J'essaye une autre</AwesomeButton>
                  </div>
                </div>
              </span>
            }
          </div>
        </div>
      </div>
    );
  }
}


class ExerciceComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="text-center">
            <h2>{this.props.title}</h2>
            <div className="lead">
              <b>Exemple :</b><br/>
              <ExampleSentenceComponent generateQuestionAnswerSentences={this.props.generateQuestionAnswerSentences} />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <h3>Exercice : </h3>
            <ExerciceSentenceComponent onScoreChange={this.props.onScoreChange} generateQuestionAnswerSentences={this.props.generateQuestionAnswerSentences} />
          </div>
        </div>
      </div>
    );
  }
}


export default ExerciceComponent;
