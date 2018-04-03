
import React from 'react';
import SentenceGenerator, {WordTypes} from '../../../js/sentencegenerator.js';



class Sentence extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
            {this.props.sentence.map((item, index) => (
                <span className='indent' key={index} >{item.renderedWord}
                { !item.appostrophed &&
                    <span>
                        &nbsp;
                    </span>
                }
                </span>
            ))}
        </div>
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
    let tense = 'present';
    let applyPronomCOD = false;
    let applyPronomCOI = false;
    let applyPronomLieu = true;
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
      <div className="container">
        <div className="row">
            <Sentence sentence={this.state.sentence} />
        </div>
        <div className="row">
            <Sentence sentence={this.state.answerSentence} />
        </div>
      </div>
    );
  }
}


export default ExerciceComponent;
