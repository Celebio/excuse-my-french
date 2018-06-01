


function createSentences(){
    let c = document.getElementById("sentenceFrame2");
    c.innerHTML = "";

    for (let i=0; i<10; i++){
        let d = document.createElement("div");
        d.className = "row";
        let sentenceGenerator = new SentenceGenerator();
        let sentence = sentenceGenerator.generate2('present');
        sentenceGenerator._renderInPage(sentence, d);
        c.appendChild(d);

        let tense = 'passecompose';
        let applyPronomCOD = true;
        let applyPronomCOI = true;
        let applyPronomLieu = true;
        let applyPronomComplement = true;
        let applyNegation = true;
        let modifiedSentence = sentenceGenerator.generateModified(sentence, tense, applyPronomCOD, applyPronomCOI, applyPronomLieu, applyPronomComplement, applyNegation);

        d = document.createElement("div");
        d.className = "row smaller";
        sentenceGenerator._renderInPage(modifiedSentence, d);
        c.appendChild(d);

        d = document.createElement("div");
        d.className = "row separ";
        c.appendChild(d);

    }
}



window.onload = function(){
    console.log('hello');

    createSentences();
    //setInterval(createSentences, 500);

}
