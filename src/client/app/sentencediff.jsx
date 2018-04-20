import React from 'react';


class SentenceDiff extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
            {this.props.sentencediff.map((item, index) => (
                <span className={`sentencediff-${item.diff}`} key={index} >{item.char}
                </span>
            ))}
        </div>
    );
  }
}


export default SentenceDiff;