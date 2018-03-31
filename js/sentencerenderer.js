

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
        "partir":{
            'present':["pars", "pars", "part", "partons", "partez", "partent"]
        },
        "déplacer":{
            'present':["déplace", "déplaces", "déplace", "déplaçons", "déplacez", "déplacent"]
        },
        "rendre":{
            'present':["rends", "rends", "rend", "rendons", "rendez", "rendent"],
            'participepassé':"rendu"
        },
        "prendre":{
            'present':["prends", "prends", "prend", "prenons", "prenez", "prennent"],
            'participepassé':"pris"
        }
    },
    'pronominalVerbePronoms' : ["me", "te", "se", "nous", "vous", "se"],
    'conjugaisonVerbePremierGroupe' : {
        'present':["e", "es", "e", "ons", "ez", "ent"]
    }
};

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
        if (patternElement.subset == "ville"){
            return "à "+patternElement.word;
        } else if (patternElement.subset == "country"){
            return "en "+patternElement.word;
        }
        return "";
    }
}

class SentenceRenderer {
    constructor(sentence){
        this._sentence = sentence;
        this._context = new RenderContext();
        this._conjugator = new Conjugator();
        this._lieuRenderer = new LieuRenderer();
    }

    _startsWithVoyelle(word){
        let voyelles = {'a':1, 'e':1, 'i':1, 'o':1, 'u':1, 'y':1};
        return (word.substr(0, 1) in voyelles);
    }
    _endsWithVoyelle(word){
        let voyelles = {'e':1};
        return (word.slice(-1) in voyelles);
    }

    render(tense){
        let me = this;
        this._sentence.forEach(function(item){
            console.log(item);
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
            } else if (wordType == WordTypes.LIEU){
                word = me._lieuRenderer.render(item);
            } else if (wordType == WordTypes.PARTICIP){
                word = me._conjugator.conjugateVerbe(item.particip, me._context, 'participepassé');
            } else if (wordType == WordTypes.VERBE){
                word = me._conjugator.conjugateVerbe(item.word, me._context, tense);
            } else if (wordType == WordTypes.COD){
                word = item.word;
            }
            console.log(word);
            item.renderedWord = word;
        });

        let prev = null;
        this._sentence.forEach(function(item){
            let word = item.renderedWord;
            if (me._startsWithVoyelle(word) && prev){
                prev.renderedWord = prev.renderedWord.substr(0, prev.renderedWord.length-1)+"'";
                prev.appostrophed = true;
                prev = null;
            } else if (me._endsWithVoyelle(word)){
                prev = item;
            } else {
                prev = null
            }
        });

        // this._sentence.forEach(function(item){
        //     let word = item.renderedWord;
        //     console.log(word);
        // });

    }
};

