
var countries = ["France", "Allemagne", "Angleterre", "Turquie"];
var cities = ["Paris", "Lyon", "Berlin", "Londres", "Saint-Etienne", "Istanbul", "Ankara"];
var sujets = ["Je", "Tu", ["Il", "Elle", "On"], "Nous", "Vous", ["Ils", "Elles"]];
var verbesDeplacement = ["aller", "partir", "se déplacer", "déménager"];
var conjugaisons = {
    "aller":{
        'present':["vais", "vas", "va", "allons", "allez", "vont"]
    },
    "partir":{
        'present':["pars", "pars", "part", "partons", "partez", "partent"]
    },
    "déplacer":{
        'present':["déplace", "déplaces", "déplace", "déplaçons", "déplacez", "déplacent"]
    }
};
var pronomialVerbePronoms = ["me", "te", "se", "nous", "vous", "se"];
var conjugaisonVerbePremierGroupe = {
    'present':["e", "es", "e", "ons", "ez", "ent"]
};

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
            let patternElementType = me._getPatternElementType(patternElement);

            if (patternElementType == 'verbe'){
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
            let patternElementType = me._getPatternElementType(patternElement);
            if (patternElementType == pronomShouldReplace){
                patternElementToReplace = patternElement;
            } else {
                sentence.push(patternElement);
            }
        });
        let indexToInsert = -1;
        for (let i=0; i<sentence.length; i++){
            let patternElementType = me._getPatternElementType(sentence[i]);
            if (patternElementType == 'aux' ||
                patternElementType == 'futurprocheverbe'){
                indexToInsert = i;
            }
        }
        sentence.splice(indexToInsert, 0, {
            'pronomLieu':'y',
            'parent':patternElementToReplace
        });

        return sentence;
    }

    _getAuxiliaireFromVerbe(verbeElement){
        let etreVerbes = {'déplacer':1, 'partir':1, 'aller':1};
        //console.log(verbeElement);
        if (verbeElement.word in etreVerbes || verbeElement.pronomial){
            return "etre";
        }
        return "avoir";
    }

    _applyTensePatternItem(verbeElement, tense, resultArr){
        if (tense == 'present'){
            resultArr.push(verbeElement);
        } else if (tense == 'passecompose'){
            resultArr.push({
                'aux':this._getAuxiliaireFromVerbe(verbeElement),
                'parent':verbeElement
            });
            resultArr.push({
                'particip':verbeElement.word,
                'parent':verbeElement
            });
        } else if (tense == "futurproche"){
            let pronomialElement = null;
            if (verbeElement.pronomial){
                pronomialElement = resultArr.pop();
            }
            resultArr.push({
                'futurproche':'aller',
                'parent':verbeElement
            });
            if (pronomialElement){  // ils vont SE régaler
                resultArr.push(pronomialElement);
            }
            resultArr.push({
                'futurprocheverbe':verbeElement.word,
                'parent':verbeElement,
                'pronomial':verbeElement.pronomial
            });
        }
    }

    _getPatternElementType(patternElement){
        let possibleTypes = {'sujet':1, 'verbe':1, 'lieu':1, 'aux':1, 'particip':1, 'futurproche':1, 'futurprocheverbe':1};
        for (let possibleType in possibleTypes){
            if (possibleType in patternElement){
                return possibleType;
            }
        }
        return null;
    }

    _pickRandomPatternItem(patternElement, resultArr){
        let word = null;
        let patternElementType = this._getPatternElementType(patternElement);

        if (patternElementType == 'sujet'){
            word = pickRandomItem(sujets);
        } else if (patternElementType == 'verbe'){
            let verbeType = patternElement.verbe;
            if (verbeType == "deplacement"){
                word = pickRandomItem(verbesDeplacement);
            }
            if (word.substr(0,3) == "se "){
                resultArr.push({
                    'pronomverb':'se',
                    'parent':patternElement
                });
                word = word.substr(3);
                patternElement.pronomial = true;
            }
        } else if (patternElementType == 'lieu'){
            let lieuType = patternElement.lieu;
            if (lieuType == "ville"){
                word = pickRandomItem(cities);
            } else if (lieuType == "pays"){
                word = pickRandomItem(countries);
            }
        }
        if (word){
            patternElement.word = word;
        }
        resultArr.push(patternElement);
    }

}


class App {
    constructor(){}

    drawSentence(sentence){
        sentence.forEach(function(item){
            console.log(item);
        });
    }

    generateWords(){
        let generator = new Generator();
        let pattern = [
            {'sujet':true},
            {'verbe':'deplacement'},
            {'lieu':'ville'}
        ];

        // // {sujet}{verbe:deplacement}{lieu:ville}
        let originalSentence = generator.pickRandom(pattern);
        // // {sujet:Il} {pronomverb: se} {verbe:deplacer} {lieu:istanbul}
        let sentence1 = generator.applyTense(originalSentence, "futurproche");
        // //{sujet:Il} {futurproche:aller} {pronomverb: se}  {{futurprocheverbe:deplacer} {lieu:istanbul}
        sentence1 = generator.applyPronom(sentence1, 'lieu');
        // //{sujet:Il} {futurproche:aller} {pronomverb: se}{pronomLieu:y}  {{futurprocheverbe:deplacer}
        this.drawSentence(sentence1);

        console.log('--------------------------');
        console.log('--------------------------');
        let sentence2 = generator.applyTense(originalSentence, "passecompose");
        // {sujet:Il} {pronomverb: se} {aux:etre} {particip:deplacé} {lieu:istanbul}
        sentence2 = generator.applyPronom(sentence2, 'lieu');
        // {sujet:Il} {pronomverb: se} {pronomLieu:y} {aux:etre} {particip:deplacé} {lieu:istanbul}
        this.drawSentence(sentence2);


        // {sujet:Il} {pronomverb: se} {pronomLieu:y} {aux:etre} {particip:deplacé} {lieu:istanbul}

        // sentence = generator.applyNegation(sentence);
        // // {sujet:Il} {negation:Ne} {pronomverb: se} {pronomLieu:y} {aux:etre} {negation:pas}

        // let frenchSentence = serialize(sentence);


        // // Nous allons téléphoner à tes parents
        // // Nous n'allons pas leur téléphoner
        // // {sujet}{verbe}{coi}
        // let sentence = generator.pickRandom(pattern);
        // // {sujet:nous}{verbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyPronomialVerb(sentence);
        // // {sujet:nous}{verbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyTense(sentence);
        // // {sujet:nous}{verbe:aller}{futurprocheverbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyPronom(sentence);
        // // {sujet:nous}{verbe:aller}{pronom:coi:leur}{futurprocheverbe:telephoner}
        // sentence = generator.applyNegation(sentence);
        // // {sujet:nous}{neg:NE}{verbe:aller}{neg:PAS}{pronom:coi:leur}{futurprocheverbe:telephoner}


        // // Nous avons téléphoné à tes parents
        // // Nous ne leur avons pas téléphoné

        // // {sujet}{verbe}{coi}
        // let sentence = generator.pickRandom(pattern);
        // // {sujet:nous}{verbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyPronomialVerb(sentence);
        // // {sujet:nous}{verbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyTense(sentence);
        // // {sujet:nous}{aux:avoir}{verbe:telephoner}{coi:à tes parents}
        // sentence = generator.applyPronom(sentence);
        // // {sujet:nous}{pronom:coi:leur}{aux:avoir}{verbe:telephoner}
        // sentence = generator.applyNegation(sentence);
        // // {sujet:nous}{neg:NE}{pronom:coi:leur}{aux:avoir}{neg:PAS}{verbe:telephoner}

    }
}


let app = new App();
app.generateWords();
