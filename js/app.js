
var WordTypes = Object.freeze({
    SUJET:1,
    VERBE:2,
    LIEU:3,
    AUX:4,
    PARTICIP:5,
    FUTURPROCHE:6,
    FUTURPROCHEVERBE:7,
    PRONOMLIEU:8,
    PRONOM:9,
    PRONOMVERBE:10,
    NEG_NE:11,
    NEG_PAS:12,
    COD:13
});
var AuxiliaireVerbes = Object.freeze({ETRE:1, AVOIR:2});

var FrenchDictionary = Object.freeze({
    'countries':["France", "Allemagne", "Angleterre", "Turquie"],
    'cities' : ["Paris", "Lyon", "Berlin", "Londres", "Saint-Etienne", "Istanbul", "Ankara"],
    'sujets' : ["Je", "Tu", ["Il", "Elle", "On"], "Nous", "Vous", ["Ils", "Elles"]],
    'verbesDeplacement' : ["aller", "partir", "se déplacer", "arriver", "déménager", "se rendre"],
    'verbesAction' : ["donner", "prendre", "transporter"],
    'verbesAutres' : ["téléphoner", "travailler"],
    'objets' : ["le livre", "la table", "la chaise", "le canapé", "la télé", "la porte"]
});


var assert = function(b){
    if (!b) throw "Noo";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var pickRandomItem = function(items){
    let item = items[Math.floor(Math.random()*items.length)];
    if (typeof(item)=="object"){
        item = pickRandomItem(item);
    };
    return item;
};

var clone = function(obj){
    let x = Object.assign({}, obj);
    x.parent = obj;
    return x;
}

var getPatternElementType = function(patternElement){
    return patternElement.type;
}


class Generator {
    pickRandom(pattern){
        let me = this;
        let sentence = [];
        pattern.forEach(function(elem){
            let patternElement = clone(elem);
            me._pickRandomPatternItem(patternElement, sentence);
        });
        return sentence;
    }

    applyTense(pattern, tense){
        let me = this;
        let sentence = [];
        pattern.forEach(function(elem){
            let patternElement = clone(elem);
            let patternElementType = getPatternElementType(patternElement);

            if (patternElementType == WordTypes.VERBE){
                me._applyTensePatternItem(patternElement, tense, sentence);
            } else {
                sentence.push(patternElement);
            }
        });
        return sentence;
    }
    applyPronom(pattern, pronomShouldReplace){
        let me = this;
        let sentence = [];
        let patternElementToReplace = null;
        pattern.forEach(function(elem){
            let patternElement = clone(elem);
            let patternElementType = getPatternElementType(patternElement);
            if (patternElementType == pronomShouldReplace){
                patternElementToReplace = patternElement;
            } else {
                sentence.push(patternElement);
            }
        });
        let indexToInsert = -1;
        for (let i=0; i<sentence.length; i++){
            let patternElementType = getPatternElementType(sentence[i]);
            if (patternElementType == WordTypes.AUX ||
                patternElementType == WordTypes.FUTURPROCHEVERBE){
                indexToInsert = i;
            }
        }
        if (pronomShouldReplace == WordTypes.LIEU){
            sentence.splice(indexToInsert, 0, {
                'type':WordTypes.PRONOMLIEU,
                'pronomLieu':'y',
                'parent':patternElementToReplace
            });
        }

        return sentence;
    }
    applyNegation(pattern){
        let me = this;
        let sentence = [];
        let patternElementToReplace = null;
        pattern.forEach(function(elem){
            let patternElement = clone(elem);
            sentence.push(patternElement);
        });

        let indexToInsertNe = -1;
        let indexToInsertPas = -1;
        for (let i=0; i<sentence.length; i++){
            let patternElementType = getPatternElementType(sentence[i]);
            if (indexToInsertNe == -1 &&
                    (patternElementType == WordTypes.FUTURPROCHE ||
                     patternElementType == WordTypes.PRONOMLIEU ||
                     patternElementType == WordTypes.PRONOMVERBE ||
                     patternElementType == WordTypes.AUX ||
                     patternElementType == WordTypes.VERBE
                     )){
                indexToInsertNe = i;
            }
            if (patternElementType == WordTypes.FUTURPROCHE ||
                patternElementType == WordTypes.VERBE ||
                patternElementType == WordTypes.AUX
                ){
                indexToInsertPas = i;
            }
        }
        sentence.splice(indexToInsertNe, 0, {
            'type':WordTypes.NEG_NE
        });
        sentence.splice(indexToInsertPas+2, 0, {
            'type':WordTypes.NEG_PAS
        });

        return sentence;
    }

    _getAuxiliaireFromVerbe(verbeElement){
        let etreVerbes = {'déplacer':1, 'partir':1, 'aller':1};
        if (verbeElement.word in etreVerbes || verbeElement.pronominal){
            return AuxiliaireVerbes.ETRE;
        }
        return AuxiliaireVerbes.AVOIR;
    }

    _applyTensePatternItem(verbeElement, tense, resultArr){
        if (tense == 'present'){
            resultArr.push(verbeElement);
        } else if (tense == 'passecompose'){
            resultArr.push({
                'type':WordTypes.AUX,
                'aux':this._getAuxiliaireFromVerbe(verbeElement),
                'parent':verbeElement
            });
            resultArr.push({
                'type':WordTypes.PARTICIP,
                'particip':verbeElement.word,
                'parent':verbeElement
            });
        } else if (tense == "futurproche"){
            let pronominalElement = null;
            if (verbeElement.pronominal){
                pronominalElement = resultArr.pop();
            }
            resultArr.push({
                'type':WordTypes.FUTURPROCHE,
                'futurproche':'aller',
                'parent':verbeElement
            });
            if (pronominalElement){  // ils vont SE régaler
                resultArr.push(pronominalElement);
            }
            resultArr.push({
                'type':WordTypes.FUTURPROCHEVERBE,
                'futurprocheverbe':verbeElement.word,
                'parent':verbeElement,
                'pronominal':verbeElement.pronominal
            });
        }
    }

    _pickRandomPatternItem(patternElement, resultArr){
        let word = null;
        let patternElementType = getPatternElementType(patternElement);

        if (patternElementType == WordTypes.SUJET){
            word = pickRandomItem(FrenchDictionary.sujets);
        } else if (patternElementType == WordTypes.VERBE){
            let verbeType = patternElement.subset;
            if (verbeType == "deplacement"){
                word = pickRandomItem(FrenchDictionary.verbesDeplacement);
            } else if (verbeType == "action"){
                word = pickRandomItem(FrenchDictionary.verbesAction);
            }
            if (word.substr(0,3) == "se "){
                resultArr.push({
                    'type':WordTypes.PRONOMVERBE,
                    'pronomverb':'se',
                    'parent':patternElement
                });
                word = word.substr(3);
                patternElement.pronominal = true;
            }
        } else if (patternElementType == WordTypes.LIEU){
            let lieuType = patternElement.subset;
            if (lieuType == "ville"){
                word = pickRandomItem(FrenchDictionary.cities);
            } else if (lieuType == "pays"){
                word = pickRandomItem(FrenchDictionary.countries);
            }
        } else if (patternElementType == WordTypes.COD){
            word = pickRandomItem(FrenchDictionary.objets);
        }
        if (word){
            patternElement.word = word;
        }
        resultArr.push(patternElement);
    }
}


class App {
    constructor(){}

    _renderInPage(sentence, frameId){
        let sentenceFrame = document.getElementById(frameId);
        let cont = document.createElement("div");
        sentenceFrame.appendChild(cont);

        sentence.forEach(function(item){
            let wordCont = document.createElement("span");
            wordCont.innerText = item.renderedWord;
            if (!item.appostrophed){
                wordCont.style.marginRight = '10px';
            }
            cont.appendChild(wordCont);
        });
    }
    generateWords2(){
        let generator = new Generator();
        let pattern = [
            {'type':WordTypes.SUJET},
            {'type':WordTypes.VERBE, 'subset':'action'},
            {'type':WordTypes.COD, 'subset':'objet'},
            {'type':WordTypes.LIEU, 'subset':'ville'}
        ];

        let tense = 'passecompose';

        // {sujet}{verbe:deplacement}{lieu:ville}
        let originalSentence = generator.pickRandom(pattern);
        let sentence1 = originalSentence;
        // {sujet:Il} {pronomverb: se} {verbe:deplacer} {lieu:istanbul}
        sentence1 = generator.applyTense(originalSentence, tense);
        // {sujet:Il} {futurproche:aller} {pronomverb: se}  {{futurprocheverbe:deplacer} {lieu:istanbul}
        //sentence1 = generator.applyPronom(sentence1, WordTypes.LIEU);
        // {sujet:Il} {futurproche:aller} {pronomverb: se}{pronomLieu:y}  {{futurprocheverbe:deplacer}
        sentence1 = generator.applyNegation(sentence1);
        // {sujet:Il} {neg:NE}{futurproche:aller}{neg:PAS} {pronomverb: se}{pronomLieu:y}  {{futurprocheverbe:deplacer}
        let sentenceRenderer1 = new SentenceRenderer(sentence1);
        sentenceRenderer1.render(tense);
        // this.drawSentence(sentence1);
        this._renderInPage(sentence1, 'sentenceFrame1');
    }

    generateWords(){
        let generator = new Generator();
        let pattern = [
            {'type':WordTypes.SUJET},
            {'type':WordTypes.VERBE, 'subset':'deplacement'},
            {'type':WordTypes.LIEU, 'subset':'ville'}
        ];

        let tense = 'present';

        // {sujet}{verbe:deplacement}{lieu:ville}
        let originalSentence = generator.pickRandom(pattern);
        let sentence1 = originalSentence;
        // {sujet:Il} {pronomverb: se} {verbe:deplacer} {lieu:istanbul}
        sentence1 = generator.applyTense(originalSentence, tense);
        // {sujet:Il} {futurproche:aller} {pronomverb: se}  {{futurprocheverbe:deplacer} {lieu:istanbul}
        //sentence1 = generator.applyPronom(sentence1, WordTypes.LIEU);
        // {sujet:Il} {futurproche:aller} {pronomverb: se}{pronomLieu:y}  {{futurprocheverbe:deplacer}
        sentence1 = generator.applyNegation(sentence1);
        // {sujet:Il} {neg:NE}{futurproche:aller}{neg:PAS} {pronomverb: se}{pronomLieu:y}  {{futurprocheverbe:deplacer}
        let sentenceRenderer1 = new SentenceRenderer(sentence1);
        sentenceRenderer1.render(tense);
        // this.drawSentence(sentence1);
        this._renderInPage(sentence1, 'sentenceFrame1');


        tense = 'passecompose';

        console.log('--------------------------');
        console.log('--------------------------');
        let sentence2 = generator.applyTense(originalSentence, "passecompose");
        //let sentence2 = originalSentence;
        // {sujet:Il} {pronomverb: se} {aux:etre} {particip:deplacé} {lieu:istanbul}
        sentence2 = generator.applyPronom(sentence2, WordTypes.LIEU);
        // {sujet:Il} {pronomverb: se} {pronomLieu:y} {aux:etre} {particip:deplacé} {lieu:istanbul}
        sentence2 = generator.applyNegation(sentence2);
        // {sujet:Il} {neg:NE}{pronomverb: se} {pronomLieu:y} {aux:etre}{neg:PAS {particip:deplacé} {lieu:istanbul}
        let sentenceRenderer2 = new SentenceRenderer(sentence2);
        sentenceRenderer2.render(tense);
        this._renderInPage(sentence2, 'sentenceFrame2');


    }
}


let app = new App();
app.generateWords2();
