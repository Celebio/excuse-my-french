
var WordTypes = Object.freeze({
    SUJET:1,
    VERBE:2,
    LIEU:3,
    AUX:4,
    PARTICIP:5,
    FUTURPROCHE:6,
    FUTURPROCHEVERBE:7,
    PRONOMLIEU:8,
    PRONOMCOD:9,
    PRONOMCOI:10,
    PRONOMVERBE:11,
    NEG_NE:12,
    NEG_PAS:13,
    COD:14,
    COI:15
});
var AuxiliaireVerbes = Object.freeze({ETRE:1, AVOIR:2});
let Genres = Object.freeze({MASCULIN:1, FEMININ:2});

var FrenchDictionary = Object.freeze({
    'countries':["en France", "en Allemagne", "en Angleterre", "en Turquie", "aux Etats-Unis"],
    'cities' : ["à Paris", "à Lyon", "à Berlin", "à Londres", "à Saint-Etienne", "à Istanbul"],
    'lieuxAutres' : ["en ville", "à la maison", "à la campagne", "au supermarché"],
    'sujets' : ["Je", "Tu", ["Il", "Elle", "On"], "Nous", "Vous", ["Ils", "Elles"]],
    'verbesDeplacement' : ["aller", "partir", "se déplacer", "arriver", "déménager", "se rendre"],
    'verbesAction' : ["donner", "prendre", "transporter", "livrer"],
    'verbesAutres' : ["téléphoner", "travailler"],
    'verbesTransitifsIndirects' : ["téléphoner", "assister"],
    'objets' : ["le livre", "la table", "la chaise", "le canapé", "la télé", "la porte"],
    'cois' : ["à moi", "à toi", ["à lui", "à elle", "à Alphonse", "à Elodie"], ["à nous", "à moi et Eloise"], ["à vous", "à toi et Pierre"], ["à eux", "à elles", "à Jean-Baptise et Pierre", "à Jean-Baptise et Eloise"]]
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

var getPronomReplacedAncestor = function(item){
    let prev = null;
    while (item.parent.parent){
        prev = item;
        item = item.parent;
    }
    return prev;
}
var findPronomIndex = function(item){
    item = getPronomReplacedAncestor(item);
    let word = item.word;
    let rc = new RenderContext();
    let pronomIndex = rc._indexOfSujetCore(word, FrenchDictionary.cois, 0);

    return pronomIndex;
}


class Generator {
    _checkWeirdSentence(pattern){
        let sujetWord = null;
        let coiWord = null;
        pattern.forEach(function(elem){
            let wordType = getPatternElementType(elem);
            if (wordType == WordTypes.SUJET){
                sujetWord = elem;
            } else if (wordType == WordTypes.COI){
                coiWord = elem;
            }
        });
        if (sujetWord && coiWord){
            let rc = new RenderContext();
            let sujetIndex = rc._indexOfSujetCore(sujetWord.word, FrenchDictionary.sujets, 0);
            let coiIndex = rc._indexOfSujetCore(coiWord.word, FrenchDictionary.cois, 0);

            // tu / vous
            if ((sujetIndex == 1 && coiIndex == 4) ||
                (sujetIndex == 4 && coiIndex == 1)){
                return true;
            }
            // je / nous
            if ((sujetIndex == 0 && coiIndex == 3) ||
                (sujetIndex == 3 && coiIndex == 0)){
                return true;
            }
        }
        return false;
    }

    pickRandom(pattern){
        let me = this;
        let sentence = null;
        do {
            sentence = [];
            pattern.forEach(function(elem){
                let patternElement = clone(elem);
                me._pickRandomPatternItem(patternElement, sentence);
            });
        } while (this._checkWeirdSentence(sentence));

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

        if (!patternElementToReplace){
            return sentence;
        }

        let indexToInsert = -1;
        let wordTypesToDetect = [];
        let wordTypesToDetectBefore = [];
        if (pronomShouldReplace == WordTypes.LIEU){
            wordTypesToDetect = [WordTypes.AUX,
                                 WordTypes.FUTURPROCHEVERBE,
                                 WordTypes.PRONOMCOD,
                                 WordTypes.PRONOMCOI];
        } else if (pronomShouldReplace == WordTypes.COD){
            wordTypesToDetect = [WordTypes.AUX,
                                 WordTypes.FUTURPROCHEVERBE,
                                 WordTypes.VERBE];
        } else if (pronomShouldReplace == WordTypes.COI){
            wordTypesToDetect = [WordTypes.AUX,
                                 WordTypes.FUTURPROCHEVERBE,
                                 WordTypes.VERBE];
            let coiPronomBefore = [WordTypes.PRONOMCOD,
                                   WordTypes.PRONOMLIEU];
            let pronomIndex = findPronomIndex(patternElementToReplace);
            if (pronomIndex == 2 || pronomIndex == 5){
                wordTypesToDetect = wordTypesToDetect.concat(coiPronomBefore);
            } else {
                wordTypesToDetectBefore = wordTypesToDetectBefore.concat(coiPronomBefore);
            }
        }

        for (let i=0; i<sentence.length; i++){
            let patternElementType = getPatternElementType(sentence[i]);
            if (wordTypesToDetectBefore.includes(patternElementType)){
                indexToInsert = i;
                break;
            }
            if (wordTypesToDetect.includes(patternElementType)){
                indexToInsert = i;
            }
        }
        if (pronomShouldReplace == WordTypes.LIEU){
            sentence.splice(indexToInsert, 0, {
                'type':WordTypes.PRONOMLIEU,
                'pronomLieu':'y',
                'parent':patternElementToReplace
            });
        } else if (pronomShouldReplace == WordTypes.COD){
            sentence.splice(indexToInsert, 0, {
                'type':WordTypes.PRONOMCOD,
                'pronom':'COD',
                'parent':patternElementToReplace
            });
        } else if (pronomShouldReplace == WordTypes.COI){
            sentence.splice(indexToInsert, 0, {
                'type':WordTypes.PRONOMCOI,
                'pronom':'COI',
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
                     patternElementType == WordTypes.PRONOMCOD ||
                     patternElementType == WordTypes.PRONOMCOI ||
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
            } else if (!lieuType){
                word = pickRandomItem([FrenchDictionary.cities,
                                            FrenchDictionary.countries,
                                            FrenchDictionary.lieuxAutres]);
            }
        } else if (patternElementType == WordTypes.COD){
            word = pickRandomItem(FrenchDictionary.objets);
        } else if (patternElementType == WordTypes.COI){
            word = pickRandomItem(FrenchDictionary.cois);
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
                wordCont.innerHTML += "&nbsp;";
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
            {'type':WordTypes.COI},
            //{'type':WordTypes.LIEU}
        ];

        let tense = 'passecompose';

        let originalSentence = generator.pickRandom(pattern);
        let sentence1 = originalSentence;
        sentence1 = generator.applyTense(originalSentence, tense);

        // Il faut cet ordre : COD, COI, LIEU
        //sentence1 = generator.applyPronom(sentence1, WordTypes.COD);
        sentence1 = generator.applyPronom(sentence1, WordTypes.COI);
        sentence1 = generator.applyPronom(sentence1, WordTypes.LIEU);

        sentence1 = generator.applyNegation(sentence1);
        let sentenceRenderer1 = new SentenceRenderer(sentence1);
        sentenceRenderer1.render(tense);
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
        sentence1 = generator.applyTense(originalSentence, tense);
        //sentence1 = generator.applyPronom(sentence1, WordTypes.LIEU);
        sentence1 = generator.applyNegation(sentence1);
        let sentenceRenderer1 = new SentenceRenderer(sentence1);
        sentenceRenderer1.render(tense);
        this._renderInPage(sentence1, 'sentenceFrame1');


        tense = 'passecompose';

        let sentence2 = generator.applyTense(originalSentence, "passecompose");
        //let sentence2 = originalSentence;
        sentence2 = generator.applyPronom(sentence2, WordTypes.LIEU);
        sentence2 = generator.applyNegation(sentence2);
        let sentenceRenderer2 = new SentenceRenderer(sentence2);
        sentenceRenderer2.render(tense);
        this._renderInPage(sentence2, 'sentenceFrame2');

    }
}


let app = new App();
app.generateWords2();
