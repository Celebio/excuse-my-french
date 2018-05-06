

function addRandomWelcomes(){
    var body = document.body;

    let welcomeInDifferentLanguages = [
        "Bienvenida",
        "Xoş gəlmişsiniz",
        "Rahajeng rauh",
        "Salamat datang",
        "Horas!",
        "आईं ना",
        "Benvinguda",
        "Bien binidu",
        "歡迎光臨",
        "Buď vítán",
        "Welcome",
        "Miawoe zɔ",
        "Vælkomin",
        "Willkommen",
        "αλώς Ήλθες ",
        "V byenvini",
        "Isten hozta ",
        "Benvenuti ",
        "Voschata",
        "Кош келиңиз!",
        "კაი მოხთით",
        "Wëllkomm",
        "Selamat datang",
        "Pjila’si ",
        "तुमचं स्वागत असो",
        "Хош келдинъиз",
        "T'aves baxtalo",
        "Välkommen ",
        "Räxim itegez",
        "ཕེབས་པར་དགའ་བསུ་ཞུ།",
        "Hoş geldiniz ",
        "Yaa ɛna",
        "Benvegnesti",
        "Merhbe",
        "Kíimak 'oolal"
    ];

    for (let i=0; i<welcomeInDifferentLanguages.length; i++){
        let word = welcomeInDifferentLanguages[i];
        console.log(word);
        let d = document.createElement("div");
        d.className = "welc";
        if (Math.random() > 0.5){
            d.className += " welcToLeft";
        } else {
            d.className += " welcToRight";
        }
        d.style.left = (parseInt(Math.random()*2000, 10))+'px';
        d.style.top = (parseInt(Math.random()*1000, 10))+'px';
        d.innerHTML = word;

        body.appendChild(d);
    }
}



addRandomWelcomes();
