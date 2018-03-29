
var countries = ["France", "Allemagne", "Angleterre", "Turquie"];
var cities = ["Paris", "Lyon", "Berlin", "Londres", "Saint-Etienne", "Istanbul", "Ankara"];
var sujets = ["Je", "Tu", ["Il", "Elle", "On"], "Nous", "Vous", ["Ils", "Elles"]];
var verbesDeplacement = ["Aller", "Partir", "Se déplacer", "Déménager"];
var conjugaisons = {
    "Aller":{
        'present':["vais", "vas", "va", "allons", "allez", "vont"]
    },
    "Partir":{
        'present':["pars", "pars", "part", "partons", "partez", "partent"]
    },
    "Déplacer":{
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

// class LinkedNode {
//     constructor(){
//         this._next = null;
//     }

// }


class Generator {
    generate(pattern){
        //this._root = null;
        let me = this;
        pattern.forEach(function(elem){
            me.specify(elem);
        });
        this.transformToFrenchSentence(pattern);
    }

    getPatternElementType(patternElement){
        let possibleTypes = {'sujet':1, 'verbe':1, 'lieu':1};
        for (let possibleType in possibleTypes){
            if (possibleType in patternElement){
                return possibleType;
            }
        }
        return null;
    }

    specify(patternElement){
        let word = null;
        let patternElementType = this.getPatternElementType(patternElement);

        if ('sujet' in patternElement){
            word = pickRandomItem(sujets);
        } else if ('verbe' in patternElement){
            let verbeType = patternElement.verbe;
            if (verbeType == "deplacement"){
                word = pickRandomItem(verbesDeplacement);
            }
        } else if ('lieu' in patternElement){
            let lieuType = patternElement.lieu;
            if (lieuType == "ville"){
                word = pickRandomItem(cities);
            } else if (lieuType == "pays"){
                word = pickRandomItem(countries);
            }
        }
        if (word){
            console.log(word);
            patternElement.word = word;
        }
    }

    indexOfSujetCore(sujetKey, items){
        for (let i=0; i<items.length; i++){
            let sujetCandidate = items[i];
            if (sujetKey == sujetCandidate){
                return i;
            } else if (typeof(sujetCandidate)=='object'){
                if (this.indexOfSujetCore(sujetKey, sujetCandidate)!=-1){
                    return i;
                }
            }
        }
        return -1;
    }

    indexOfSujet(sujetKey){
        return this.indexOfSujetCore(sujetKey, sujets);
    }

    getConjugedVerbe(verbeElement, sujetElement, tense){
        assert(sujetElement != null);
        let frenchWords = [];
        let word = verbeElement.word;
        let pronomial = false;
        let frenchWord = null;
        let sujetIndex = this.indexOfSujet(sujetElement.word);
        if (word.substr(0,2) == "Se"){
            pronomial = true;
            word = word.substr(3);
            word = capitalizeFirstLetter(word);

            frenchWords.push(pronomialVerbePronoms[sujetIndex]);
        }

        let frenchWordOfVerb = null;

        if (word in conjugaisons){
            frenchWordOfVerb = conjugaisons[word][tense][sujetIndex];
        } else if (word.slice(-2) == "er"){
            frenchWordOfVerb = word.substr(0, word.length-2).concat(conjugaisonVerbePremierGroupe[tense][sujetIndex]);
        }

        if (frenchWordOfVerb){
            frenchWordOfVerb = frenchWordOfVerb.toLowerCase();
            frenchWords.push(frenchWordOfVerb);
        }
        return frenchWords;
    }
    getLieuFrenchWord(lieuElement){
        let frenchWords = [];
        if (lieuElement.lieu == 'ville'){
            frenchWords.push('à');
        } else if (lieuElement.lieu == 'pays'){
            frenchWords.push('en');
        }
        frenchWords.push(lieuElement.word);

        return frenchWords;
    }

    transformToFrenchSentence(pattern){
        let words = [];
        let sujet = null;
        let me = this;
        pattern.forEach(function(elem){
            let patternElementType = me.getPatternElementType(elem);
            let word = null;
            if (patternElementType == 'sujet'){
                word = elem.word;
                sujet = elem;
            } else if (patternElementType == 'verbe'){
                word = me.getConjugedVerbe(elem, sujet, 'present');
            } else if (patternElementType == 'lieu'){
                word = me.getLieuFrenchWord(elem);
            }
            console.log(word);
        });
    }
}


class App {
    constructor(){}

    generateWords(){
        let generator = new Generator();
        let pattern = [
            {'sujet':true},
            {'verbe':'deplacement'},
            {'lieu':'ville'}
        ];
        let sentence = generator.generate(pattern);

        // // {sujet}{verbe:deplacement}{lieu:ville}
        // let sentence = generator.pickRandom(pattern);
        // //{sujet:Il}{verbe:se deplacer}{lieu:istanbul}
        // sentence = generator.applyPronomialVerb(sentence);
        // // {sujet:Il} {pronomverb: se} {verbe:deplacer} {lieu:istanbul}
        // sentence = generator.applyTense(sentence);
        // //{sujet:Il} {pronomverb: se} {aux:etre} {particip:deplacé} {lieu:istanbul}
        // sentence = generator.applyPronom(sentence);
        // // {sujet:Il} {pronomverb: se} {pronomLieu:y} {aux:etre} {particip:deplacé} {lieu:istanbul}
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
