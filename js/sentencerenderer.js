

class SentenceRenderer {
    constructor(sentence){
        this._sentence = sentence;
    }

    render(){
        this._sentence.forEach(function(item){
            console.log(item);
        });
    }
};

