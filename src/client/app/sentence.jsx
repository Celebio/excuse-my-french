import React from 'react';


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

export default Sentence;
