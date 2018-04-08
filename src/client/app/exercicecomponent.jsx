
import React from 'react';
import SentenceGenerator, {WordTypes} from '../../../js/sentencegenerator.js';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';


class Sentence extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <span>
            {this.props.sentence.map((item, index) => (
                <span className='indent' key={index} >{item.renderedWord}
                { !item.appostrophed &&
                    <span>
                        &nbsp;
                    </span>
                }
                </span>
            ))}
        </span>
    );
  }
}

class ExerciceComponent extends React.Component {
  constructor(props) {
    super(props);

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

    console.log(sentence.length);
    sentence.forEach(function(item){
        console.log(item);
    });

    this.state = {sentence : sentence,
                  answerSentence : answerSentence
                 };
    // this.onLike = this.onLike.bind(this);
  }

  onLike () {
    //let newLikesCount = this.state.likesCount + 1;
    //this.setState({likesCount: newLikesCount});
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="py-5 text-center">
            <h2>Conjugez le verbe au passé composé.</h2>
            <p className="lead">
              <b>Exemple :</b><br/>
                  <Sentence sentence={this.state.sentence} /><br/>
                  <Sentence sentence={this.state.answerSentence} /><br/>
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <h3>Exercice : </h3>
            <div className="container">
                <div className="row">
                  <div className="col-12">
                    <Sentence sentence={this.state.sentence} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <form>
                      <div>
                        <input type="text" className="form-control" id="address" placeholder="Votre réponse ici" required="" />
                      </div>
                    </form>
                    <div className="formSender">
                        <AwesomeButton type="primary">Envoyer</AwesomeButton>
                    </div>
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
