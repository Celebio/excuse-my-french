

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
    PRONOMCOIY:11,
    PRONOMCOIEN:12,
    PRONOMVERBE:13,
    NEG_NE:14,
    NEG_PAS:15,
    COD:16,
    COI:17,
    COMPLEMENT:18
});
var AuxiliaireVerbes = Object.freeze({ETRE:1, AVOIR:2});
let Genres = Object.freeze({MASCULIN:1, FEMININ:2});


var FrenchDictionary = Object.freeze({
    'countries':["en France", "en Allemagne", "en Angleterre", "en Turquie", "aux Etats-Unis"],
    'cities' : ["à Paris", "à Lyon", "à Berlin", "à Londres", "à Saint-Etienne", "à Istanbul"],
    'lieuxAutres' : ["en ville", "à la maison", "à la campagne", "au supermarché"],
    'sujets' : ["Je", "Tu", ["Il", "Elle", "On"], "Nous", "Vous", ["Ils", "Elles"]],
    'verbesDeplacement' : ["aller", "partir", "se déplacer", "arriver", "déménager", "se rendre"],
    'verbesAction' : ["donner", "prendre", "transporter", "livrer", "changer", "mettre", "voir", "acheter"],
    'verbesAutres' : ["téléphoner", "travailler"],
    'verbesActionCoiable' : ["donner", "acheter", "offrir", "montrer", "envoyer", "donner", "transporter", "livrer", "lancer", "rendre"],
    'verbesTransitifsIndirectsQuelquun' : ["téléphoner", "obéir", "répondre", "mentir", "plaire"],
    'objets' : ["le livre", "la table", "la chaise", "le canapé", "la télé", "la porte"],
    'objetsExplicables' : ["la formule", "le cours", "le livre"],
    'sports' : ["le golf", "le football", "le tennis", "le basketball"],
    'musique' : ["le piano", "la guitare", "la flûte", "le violon"],
    'cois' : ["à moi", "à toi", ["à lui", "à elle", "à Alphonse", "à Elodie"], ["à nous", "à Eloise et à moi"], ["à vous", "à Pierre et à toi"], ["à eux", "à elles", "à Jean-Baptiste et Pierre", "à Jean-Baptiste et Eloise"]],

    'verbes' :[
        {'key':"donner",           'cod':true, 'aqqun':true},
        {'key':"prendre",          'cod':true, 'aqqun':true},
        {'key':"transporter",      'cod':true            },
        {'key':"livrer",           'cod':true, 'aqqun':true},
        {'key':"changer",          'cod':true,           },
        {'key':"mettre",           'cod':true,           },
        {'key':"voir",             'cod':true,           },
        {'key':"acheter",          'cod':true, 'aqqun':true},
        {'key':"montrer",          'cod':true, 'aqqun':true},
        {'key':"envoyer",          'cod':true, 'aqqun':true},
        {'key':"donner",           'cod':true, 'aqqun':true},
        {'key':"transporter",      'cod':true, 'aqqun':true},
        {'key':"livrer",           'cod':true, 'aqqun':true},
        {'key':"lancer",           'cod':true, 'aqqun':true},
        {'key':"rendre",           'cod':true, 'aqqun':true},
        {'key':"expliquer",        'cod':"objetsExplicables", 'aqqun':true},
        {'key':"enseigner",        'cod':"objetsExplicables", 'aqqun':true},
        {'key':"téléphoner",                   'aqqun':true},
        {'key':"obéir",                        'aqqun':true},
        {'key':"répondre",                     'aqqun':true},
        {'key':"mentir",                       'aqqun':true},
        {'key':"plaire",                       'aqqun':true},

        {'key':"tenir_action",    'label':"tenir", 'cod':true},
        {'key':"tenir_sentiment", 'label':"tenir", 'aqqun_y':true},

        {'key':"penser", 'aqqun_y':true},
        {'key':"penser", 'aqqchose_y':true},

        {'key':"réfléchir", 'aqqchose_y':"objetsExplicables"},

        {'key':"jouer_sports", 'label':"jouer", 'aqqchose_y':"sports"},
        {'key':"jouer_musique",'label':"jouer", 'duqqchose':"musique"},





    ]
});




var ConjugaisonReference = {
    'conjugaisons' : {
        "être":{
            'present':["suis", "es", "est", "sommes", "êtes", "sont"]
        },
        "avoir":{
            'present':["ai", "as", "a", "avons", "avez", "ont"]
        },
        "aller":{
            'present':["vais", "vas", "va", "allons", "allez", "vont"]
        },
        "changer":{
            'present':["change", "changes", "change", "changeons", "changez", "changent"]
        },
        "partir":{
            'present':["pars", "pars", "part", "partons", "partez", "partent"]
        },
        "déplacer":{
            'present':["déplace", "déplaces", "déplace", "déplaçons", "déplacez", "déplacent"]
        },
        "lancer":{
            'present':["lance", "lances", "lance", "lançons", "lancez", "lancent"]
        },
        "envoyer":{
            'present':["envoie", "envoies", "envoie", "envoyons", "envoyez", "envoient"]
        },
        "rendre":{
            'present':["rends", "rends", "rend", "rendons", "rendez", "rendent"],
            'participepassé':"rendu"
        },
        "prendre":{
            'present':["prends", "prends", "prend", "prenons", "prenez", "prennent"],
            'participepassé':"pris"
        },
        "mettre":{
            'present':["mets", "mets", "met", "mettons", "mettez", "mettent"],
            'participepassé':"mis"
        },
        "voir":{
            'present':["vois", "vois", "voit", "voyons", "voyez", "voient"],
            'participepassé':"vu"
        },
        "savoir":{
            'present':["sais", "sais", "sait", "savons", "savez", "savent"],
            'participepassé':"su"
        },
        "obéir":{
            'present':["obéis", "obéis", "obéit", "obéissons", "obéissez", "obéissent"],
            'participepassé':"obéi"
        },
        "répondre":{
            'present':["réponds", "réponds", "répond", "répondons", "répondez", "répondent"],
            'participepassé':"répondu"
        },
        "mentir":{
            'present':["mens", "mens", "ment", "mentons", "mentez", "mentent"],
            'participepassé':"menti"
        },
        "tenir":{
            'present':["tiens", "tiens", "tient", "tenons", "tenez", "tiennent"],
            'participepassé':"tenu"
        },
        "croire":{
            'present':["crois", "crois", "croit", "croyons", "croyez", "croient"],
            'participepassé':"cru"
        },
        "plaire":{
            'present':["plais", "plais", "plait", "plaisons", "plaisez", "plaisent"],
            'participepassé':"plu"
        },
        "offrir":{
            'present':["offre", "offres", "offre", "offrons", "offrez", "offrent"],
            'participepassé':"offert"
        },
        "réfléchir":{
            'present':["réfléchis", "réfléchis", "réfléchit", "réfléchissons", "réfléchissez", "réfléchissent"],
            'participepassé':"réfléchi"
        },
    },
    'pronominalVerbePronoms' : ["me", "te", "se", "nous", "vous", "se"],
    'pronoms' : ["me", "te", "lui", "nous", "vous", "leur"],
    'conjugaisonVerbePremierGroupe' : {
        'present':["e", "es", "e", "ons", "ez", "ent"]
    }
};



var assert = function(b){
    if (!b) throw "Noo";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var pickRandomItem = function(items, nonRecursive){
    let item = items[Math.floor(Math.random()*items.length)];
    if (!nonRecursive && typeof(item)=="object"){
        item = pickRandomItem(item);
    };
    return item;
};

var clone = function(obj){
    let x = Object.assign({}, obj);
    x.parent = obj;
    return x;
}

var getPatternElementType = function(sentenceElement){
    return sentenceElement.type;
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






class Conjugator {
    constructor(){}

    conjugateVerbe(verbeKey, context, tense){
        let sujetIndex = context.sujetIndex;
        let word = null;
        if (tense == 'infinitif'){
            word = verbeKey;
        } else if (tense == 'participepassé'){
            if (verbeKey in ConjugaisonReference.conjugaisons){
                word = ConjugaisonReference.conjugaisons[verbeKey][tense];
            }
            if (!word){
                if (verbeKey.slice(-2) == 'ir'){
                    word = verbeKey.substr(0, verbeKey.length-1);
                } else if (verbeKey.slice(-2) == 'er'){
                    word = verbeKey.substr(0, verbeKey.length-2)+"é";
                }
            }
        } else if (verbeKey in ConjugaisonReference.conjugaisons){
            word = ConjugaisonReference.conjugaisons[verbeKey][tense][sujetIndex];
        } else if (verbeKey.slice(-2) == 'er'){
            word = verbeKey.substr(0, verbeKey.length-2).concat(ConjugaisonReference.conjugaisonVerbePremierGroupe[tense][sujetIndex]);
        }

        if (tense == 'participepassé' && context.shouldDoAccord()){
            if (context.feminin){
                word = word+"e";
            }
            if (context.pluriel){
                word = word+"s";
            }
        }

        return word;
    }

    conjugatePronom(context){
        let sujetIndex = context.sujetIndex;
        return ConjugaisonReference.pronominalVerbePronoms[sujetIndex];
    }
}


class RenderContext {
    constructor(){
        this.sujetIndex = -1;
        this.feminin = false;
        this.pluriel = false;
        this._auxItem = null;
    }

    setSujet(patternElement){
        this.sujetIndex = this._indexOfSujet(patternElement.word);
    }

    _indexOfSujetCore(sujetKey, items, level){
        for (let i=0; i<items.length; i++){
            let sujetCandidate = items[i];
            if (sujetKey == sujetCandidate){
                if (i >= 3 && level == 0){
                    this.pluriel = true;
                }
                return i;
            } else if (typeof(sujetCandidate)=='object'){
                let j = this._indexOfSujetCore(sujetKey, sujetCandidate, level+1);
                if (j!=-1){
                    if (j == 1){
                        this.feminin = true;
                    }
                    if (i >= 3 && level == 0){
                        this.pluriel = true;
                    }
                    return i;
                }
            }
        }
        return -1;
    }

    _indexOfSujet(sujetKey){
        return this._indexOfSujetCore(sujetKey, FrenchDictionary.sujets, 0);
    }

    setAuxItem(item){
        this._auxItem = item;
    }

    shouldDoAccord(){
        assert(this._auxItem);
        return (this._auxItem.aux == AuxiliaireVerbes.ETRE);
    }
}

class LieuRenderer {
    render(patternElement){
        return patternElement.word;
    }
}

class PronomRenderer {
    _detectGenre(word){
        if (word.substr(0, 2) == 'le' ||
            word.substr(0, 2) == 'un'
            ){
            return Genres.MASCULIN;
        } else if (word.substr(0, 2) == 'la' ||
                   word.substr(0, 3) == 'une') {
            return Genres.FEMININ;
        }
    }
    render(patternElement){
        let wordType = getPatternElementType(patternElement);
        if (wordType == WordTypes.PRONOMCOD){
            patternElement = getPronomReplacedAncestor(patternElement);
            let genre = this._detectGenre(patternElement.word);
            if (genre == Genres.MASCULIN){
                return "le";
            } else if (genre == Genres.FEMININ){
                return "la";
            }
        } else if (wordType == WordTypes.PRONOMCOI){
            let pronomIndex = findPronomIndex(patternElement);

            return ConjugaisonReference.pronoms[pronomIndex];
        } else if (wordType == WordTypes.PRONOMCOIY){
            return "y";
        } else if (wordType == WordTypes.PRONOMCOIEN){
            return "en";
        }

    }
}

class SentenceRenderer {
    constructor(sentence){
        this._sentence = sentence;
        this._context = new RenderContext();
        this._conjugator = new Conjugator();
        this._lieuRenderer = new LieuRenderer();
        this._pronomRenderer = new PronomRenderer();
    }

    _startsWithVoyelle(word){
        let voyelles = {'a':1, 'e':1, 'i':1, 'o':1, 'u':1, 'y':1};
        return (word.substr(0, 1) in voyelles);
    }
    _endsWithVoyelle(word){
        let voyelles = {'e':1, 'a':1};
        return (word.slice(-1) in voyelles);
    }

    render(tense){
        let me = this;
        this._sentence.forEach(function(item){
            let word = null;
            let wordType = getPatternElementType(item);
            if (wordType == WordTypes.SUJET){
                me._context.setSujet(item);
                word = item.word;
            } else if (wordType == WordTypes.NEG_NE){
                word = "ne";
            } else if (wordType == WordTypes.NEG_PAS){
                word = "pas";
            } else if (wordType == WordTypes.FUTURPROCHE){
                word = me._conjugator.conjugateVerbe(item.futurproche, me._context, 'present');
            } else if (wordType == WordTypes.FUTURPROCHEVERBE){
                word = me._conjugator.conjugateVerbe(item.futurprocheverbe, me._context, 'infinitif');
            } else if (wordType == WordTypes.AUX){
                let verbeKey = item.aux == 1 ? 'être' : 'avoir';
                me._context.setAuxItem(item);
                word = me._conjugator.conjugateVerbe(verbeKey, me._context, 'present');
            } else if (wordType == WordTypes.PRONOMVERBE){
                word = me._conjugator.conjugatePronom(me._context);
            } else if (wordType == WordTypes.PRONOMLIEU){
                word = "y";
            } else if (wordType == WordTypes.PRONOMCOD){
                word = me._pronomRenderer.render(item);
            } else if (wordType == WordTypes.PRONOMCOI){
                word = me._pronomRenderer.render(item);
            } else if (wordType == WordTypes.PRONOMCOIY){
                word = me._pronomRenderer.render(item);
            } else if (wordType == WordTypes.PRONOMCOIEN){
                word = me._pronomRenderer.render(item);
            } else if (wordType == WordTypes.LIEU){
                word = me._lieuRenderer.render(item);
            } else if (wordType == WordTypes.PARTICIP){
                word = me._conjugator.conjugateVerbe(item.particip, me._context, 'participepassé');
            } else if (wordType == WordTypes.VERBE){
                word = me._conjugator.conjugateVerbe(item.word, me._context, tense);
            } else if (wordType == WordTypes.COD){
                word = item.word;
            } else if (wordType == WordTypes.COI){
                word = item.word;
            } else if (wordType == WordTypes.COMPLEMENT){
                word = item.word;
            }

            item.renderedWord = word;
            item.apostrophed = false;
        });

        let prev = null;
        this._sentence.forEach(function(item){
            let word = item.renderedWord;
            if (me._startsWithVoyelle(word) && prev){
                prev.renderedWord = prev.renderedWord.substr(0, prev.renderedWord.length-1)+"'";
                prev.apostrophed = true;
                prev = null;
            } else if (me._endsWithVoyelle(word) && word.length < 3 && word.length > 1){
                prev = item;
            } else {
                prev = null
            }
        });

        // this._sentence.forEach(function(item){
        //     let word = item.renderedWord;
        //     console.log(word);
        //     console.log(item);
        // });

    }
};




class Generator {
    _checkCOIPronoms(sentence, indices){
        let shouldBeAvoided = false;

        let sujetWord = null;
        let coiWord = null;
        sentence.forEach(function(elem){
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

            indices.forEach(function(indexElem){
                let sujetIndexToCheck = rc._indexOfSujetCore(indexElem[0], FrenchDictionary.sujets, 0);
                let coiIndexToCheck = rc._indexOfSujetCore(indexElem[1], FrenchDictionary.sujets, 0);

                if ((sujetIndex == sujetIndexToCheck && coiIndex == coiIndexToCheck)){
                    shouldBeAvoided = true;
                }
            });
        }
        return shouldBeAvoided;
    }
    _checkWeirdSentence(sentence){
        return this._checkCOIPronoms(sentence, [["Tu", "Vous"],["Vous", "Tu"],
                                               ["Je", "Nous"],["Nous", "Je"]
                                              ]);
    }

    _checkSelfActionSentence(sentence){
        return this._checkCOIPronoms(sentence, [["Je", "Je"],["Tu", "Tu"],
                                               ["Il", "Il"],["Nous", "Nous"],
                                               ["Vous", "Vous"],["Ils", "Ils"]
                                              ]);
    }

    pickRandom(sourceSentence){
        let me = this;
        let sentence = null;
        let avoidSelfAction = true;
        do {
            sentence = [];
            sourceSentence.forEach(function(elem){
                let sentenceElement = clone(elem);
                me._pickRandomPatternItem(sentenceElement, sentence);
            });
        } while (this._checkWeirdSentence(sentence) || (avoidSelfAction && this._checkSelfActionSentence(sentence)));

        return sentence;
    }

    applyTense(sourceSentence, tense){
        let me = this;
        let sentence = [];
        sourceSentence.forEach(function(elem){
            let sentenceElement = clone(elem);
            let patternElementType = getPatternElementType(sentenceElement);

            if (patternElementType == WordTypes.VERBE){
                me._applyTensePatternItem(sentenceElement, tense, sentence);
            } else {
                sentence.push(sentenceElement);
            }
        });
        return sentence;
    }
    applyPronom(sourceSentence, pronomShouldReplace){
        let me = this;
        let sentence = [];
        let patternElementToReplace = null;
        sourceSentence.forEach(function(elem){
            let sentenceElement = clone(elem);
            let patternElementType = getPatternElementType(sentenceElement);
            if (patternElementType == pronomShouldReplace){
                patternElementToReplace = sentenceElement;
            } else {
                sentence.push(sentenceElement);
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
                                 WordTypes.PRONOMCOI,
                                 WordTypes.PRONOMCOIY,
                                 WordTypes.PRONOMCOIEN];
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
            if (pronomIndex == 2 || pronomIndex == 5){  // lui/leur
                wordTypesToDetect = wordTypesToDetect.concat(coiPronomBefore);
            } else {
                wordTypesToDetectBefore = wordTypesToDetectBefore.concat(coiPronomBefore);
            }
        } else if (pronomShouldReplace == WordTypes.COMPLEMENT){
            wordTypesToDetect = [WordTypes.AUX,
                                 WordTypes.FUTURPROCHEVERBE,
                                 WordTypes.VERBE];
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
            if (patternElementToReplace.pronom === 'y'){
                sentence.splice(indexToInsert, 0, {
                    'type':WordTypes.PRONOMCOIY,
                    'pronom':'COIy',
                    'parent':patternElementToReplace
                });
            } else {
                sentence.splice(indexToInsert, 0, {
                    'type':WordTypes.PRONOMCOI,
                    'pronom':'COI',
                    'parent':patternElementToReplace
                });
            }
        } else if (pronomShouldReplace == WordTypes.COMPLEMENT){
            sentence.splice(indexToInsert, 0, {
                'type':WordTypes.PRONOMCOIEN,
                'pronom':'COIen',
                'parent':patternElementToReplace
            });
        }

        return sentence;
    }
    applyNegation(sourceSentence){
        let me = this;
        let sentence = [];
        let patternElementToReplace = null;
        sourceSentence.forEach(function(elem){
            let sentenceElement = clone(elem);
            sentence.push(sentenceElement);
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
                     patternElementType == WordTypes.PRONOMCOIY ||
                     patternElementType == WordTypes.PRONOMCOIEN ||
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
        let etreVerbes = {'déplacer':1, 'partir':1, 'aller':1, 'arriver':1};
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

    _pickRandomPatternItem(sentenceElement, resultArr){
        let word = null;
        let patternElementType = getPatternElementType(sentenceElement);

        if (patternElementType == WordTypes.SUJET){
            word = pickRandomItem(FrenchDictionary.sujets);
        } else if (patternElementType == WordTypes.VERBE){
            if (sentenceElement.force){
                word = sentenceElement.force;
            } else {
                let verbeType = sentenceElement.subset;
                if (verbeType == "deplacement"){
                    word = pickRandomItem(FrenchDictionary.verbesDeplacement);
                } else if (verbeType == "action"){
                    word = pickRandomItem(FrenchDictionary.verbesAction);
                } else if (verbeType == "action-coi"){
                    word = pickRandomItem(FrenchDictionary.verbesActionCoiable);
                } else if (verbeType == "transitifs-indirect-qqun"){
                    word = pickRandomItem(FrenchDictionary.verbesTransitifsIndirectsQuelquun);
                }
            }
            if (word.substr(0,3) == "se "){
                resultArr.push({
                    'type':WordTypes.PRONOMVERBE,
                    'pronomverb':'se',
                    'parent':sentenceElement
                });
                word = word.substr(3);
                sentenceElement.pronominal = true;
            }
        } else if (patternElementType == WordTypes.LIEU){
            let lieuType = sentenceElement.subset;
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
            let codType = sentenceElement.subset;
            if (!codType){
                word = pickRandomItem(FrenchDictionary.objets);
            } else {
                word = pickRandomItem(FrenchDictionary[codType]);
            }

        } else if (patternElementType == WordTypes.COI){
            let coiType = sentenceElement.subset;

            if (!coiType){
                word = pickRandomItem(FrenchDictionary.cois);
            } else {
                word = transformObjetToCoi(pickRandomItem(FrenchDictionary[coiType]));
            }

        } else if (patternElementType == WordTypes.COMPLEMENT){
            let cmplType = sentenceElement.subset;

            if (!cmplType){
                word = pickRandomItem(FrenchDictionary.objets);
            } else {
                word = transformObjetToComplement(pickRandomItem(FrenchDictionary[cmplType]));
            }
        }
        if (word){
            sentenceElement.word = word;
        }
        resultArr.push(sentenceElement);
    }
}

function transformObjetToCoi(word){
    if (word.substr(0, 2)=="le"){
        return "au "+word.substr(3);
    } else if (word.substr(0, 2)=="la"){
        return "à la "+word.substr(3);
    }
    throw "UNKNOWN";
}

function transformObjetToComplement(word){
    if (word.substr(0, 2)=="le"){
        return "du "+word.substr(3);
    } else if (word.substr(0, 2)=="la"){
        return "de la "+word.substr(3);
    }
    throw "UNKNOWN";
}

class SentenceGenerator {
    constructor(){}

    _renderInPage(sentence, sentenceFrame){
        let cont = document.createElement("div");
        sentenceFrame.appendChild(cont);

        sentence.forEach(function(item){
            let wordCont = document.createElement("span");
            wordCont.innerText = item.renderedWord;
            if (!item.apostrophed){
                wordCont.innerHTML += "&nbsp;";
            }
            cont.appendChild(wordCont);
        });
    }


    generate(pattern,
             tense){
        let generator = new Generator();
        let originalSentence = generator.pickRandom(pattern);

        let sentence = generator.applyTense(originalSentence, tense);
        let sentenceRenderer1 = new SentenceRenderer(sentence);
        sentenceRenderer1.render(tense);

        return sentence;
    }

    generate2(tense){
        console.log(FrenchDictionary.verbes);
        let verbDescription = pickRandomItem(FrenchDictionary.verbes, true);
        console.log(verbDescription);

        let pattern = [
            {'type':WordTypes.SUJET},
            {'type':WordTypes.VERBE, 'force':verbDescription.label || verbDescription.key}
        ];

        if (verbDescription.cod === true){
            pattern.push({'type':WordTypes.COD});
        } else if (verbDescription.cod){
            pattern.push({'type':WordTypes.COD, 'subset':verbDescription.cod});
        }
        if (verbDescription.aqqun === true){
            pattern.push({'type':WordTypes.COI});
        }
        if (verbDescription.aqqun_y === true){
            pattern.push({'type':WordTypes.COI, 'pronom':"y"});
        }
        if (verbDescription.aqqchose_y === true){
            pattern.push({'type':WordTypes.COI, 'pronom':"y", 'subset':"objets"});
        } else if (verbDescription.aqqchose_y){
            pattern.push({'type':WordTypes.COI, 'pronom':"y", 'subset':verbDescription.aqqchose_y});
        }

        if (verbDescription.duqqchose === true){
            pattern.push({'type':WordTypes.COMPLEMENT, 'pronom':"en", 'subset':"objets"});
        } else if (verbDescription.duqqchose){
            pattern.push({'type':WordTypes.COMPLEMENT, 'pronom':"en", 'subset':verbDescription.duqqchose});
        }



        return this.generate(pattern, tense);
    }

    generateModified(originalSentence,
                     tense,
                     shouldApplyPronomCOD,
                     shouldApplyPronomCOI,
                     shouldApplyPronomLieu,
                     shouldApplyPronomComplement,
                     shouldApplyNegation){
        let generator = new Generator();
        let sentence1 = generator.applyTense(originalSentence, tense);

        // Il faut cet ordre : COD, COI, LIEU

        if (shouldApplyPronomCOD){
            sentence1 = generator.applyPronom(sentence1, WordTypes.COD);
        }
        if (shouldApplyPronomCOI){
            sentence1 = generator.applyPronom(sentence1, WordTypes.COI);
        }
        if (shouldApplyPronomLieu){
            sentence1 = generator.applyPronom(sentence1, WordTypes.LIEU);
        }
        if (shouldApplyPronomComplement){
            sentence1 = generator.applyPronom(sentence1, WordTypes.COMPLEMENT);
        }
        if (shouldApplyNegation){
            sentence1 = generator.applyNegation(sentence1);
        }

        let sentenceRenderer1 = new SentenceRenderer(sentence1);
        sentenceRenderer1.render(tense);

        return sentence1;
    }

}

// export default SentenceGenerator;
// export var WordTypes;
