//_______________________________________ ETC ____________________________
/**
 * Settes til "true" om gjeldende nettleser er Google Chrome
 * @type {boolean}
 */
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);




/* ________ <testing> ________ */
var peopleArray = [];
function createPerson(firstNameInput, lastNameInput){
    peopleArray.push({firstName: firstNameInput, lastName: lastNameInput});
    let fullName = getObjectByKeyValue(peopleArray, firstName, lastName);
}





//_______________________________________ KEYSTROKES ____________________________
document.addEventListener("keypress", function() { keyIsPressed(event.keyCode) });
var keyPressed = "";
var echoKeys = false;
/**
 * Method keyIsPressed inputs a unicode number and outputs the associated character, & triggers a secondary function med knappen som er trykket, som jeg kan legge inn der jeg trenger den.
 * @param keyCode (number) - unicode koden til key'en som er presset.
 */
function keyIsPressed(keyCode){
    keyPressed = String.fromCharCode(keyCode);

    if(echoKeys===true) console.log("↓"+keyPressed);
    keyPressedFunction(keyPressed);
}









//_______________________________________ REMOVE ELEMENTS ____________________________
/**
 * @prop
 * Når element oppgis med ".remove()" suffix, kjøres en funksjon som definerer outerHTML (hele elementet, inkludert tags) til ingenting.
 */
Element.prototype.remove = function(){
    this.outerHTML="";
}; NodeList.prototype.remove = HTMLCollection.prototype.remove = function(){
    this.outerHTML="";
};
// bruk .remove() etter et element for å fjerne dem.
// I.E.: document.getElementById("mainImage").remove();  /  document.getElementsByClassName("fancyDiv").remove();



/**
 * Objekt med removal funksjoner. Call funksjon via <objektnavn>.<funksjonnavn>(parameter). I.E. "remove.inner("circleEl")
 * @type {{outer: remove.outer, inner: remove.inner}}
 */
const remove = { /* ikke putt prototypes her */
    /**
     * fjerner gitt element fra dokumentet (samme som .remove, men som funksjon.)
     * @param elementId {String} - ID til et element.
     */
    outer: function(elementId){ document.getElementById(elementId).outerHTML=""; },
    /**
     * fjerner inneholdet av elementet
     * @param elementId {String} - ID til et element.
     */
    inner: function(elementId){ document.getElementById(elementId).innerHTML=""; }
};





//_______________________________________ ARRAY/OBJECT MANIPULATION  ______________
/**
 * method getKeyByKeyValue() returns the name of the key which has the value given, in the given object.
 * @param object {Object} - navnet til objektet
 * @param verdi {String | Number} - verdien på key'en
 * @returns {String} - navnet til key'en
 */
function getKeyByKeyValue(object, verdi) {
    return String(object.keys(object).find(key=>object[key]===verdi));
}

/**
 * method getObjectByKeyValue() returns the object inside an array which contains a given key with the given value
 * @param array {Array} - Navn på arrayet objektet er i
 * @param key {String} - Navnet på key'en i objektet
 * @param value {String | Number} - verdien til key'en
 * @returns {String} - navnet på objektet
 */
function getObjectByKeyValue(array, key, value) {
    for (let i=0; i < array.length; i++) {
        if (array[i].key === value){
            console.log("getObjectByKeyValue() index = "+i);
            return array[i];
        }
    }
}



// TODO - lag class manipulation functions
// <remove class from element> <add class to element> <delete all with x class>







//_______________________________________ PLAY AUDIO _______________
var echoAudio = false; //if echoAudio=true, reports audio events i konsoll

var currentlyPlayingAudio = new Audio(); //global variabel for å kunne sette musikken på pause. Hindrer ikke simultane lyder, men lar deg bare påvirke den nyeste lyden som blir spilt.

/** Method playAudio() plays sound file with given filepath, once.
 * @param filePath {String} - file path with source audio + file extension. */
function playAudio(filePath) {
    currentlyPlayingAudio = new Audio(filePath);

    currentlyPlayingAudio.play();
    if(echoAudio===true) console.log("♪ started");
    endOfAudio = false;
    audioFallback(filePath);

}
/** Method playAudioEz() plays sound file from the folder "Resources/audio" with given filepath, once.
 * @param file {String} - file/file path with source audio + file extension.
 * Time-saving method for when I need to play a lot of audio, and the audio is in the resources/audio folder. */
function playAudioEz(file){
    currentlyPlayingAudio = new Audio("Resources/audio/"+file);
    currentlyPlayingAudio.play();
    if(echoAudio===true) console.log("♪ started");
    endOfAudio = false;
    audioFallback();

}

/** method stopAudio() pauses currentlyPlayingAudio and sets it's time to 0, meaning currentlyPlayingAudio will be played from the beginning if unpaused. */
function stopAudio(){
    currentlyPlayingAudio.currentTime = 0;
    currentlyPlayingAudio.pause();
    if(echoAudio===true) console.log("♪ stopped");
}

/** method pauseAudio() pauses currentlyPlayingAudio without resetting time. */
function pauseAudio(){
    if(isAudioPlaying()===true){
        currentlyPlayingAudio.pause();
        if(echoAudio===true) console.log("♪ paused");
    }else if(isAudioPlaying()===false){
        currentlyPlayingAudio.play();
        if(echoAudio===true) console.log("♪ unpaused")
    }
}

/** Method isAudioPlaying() returns "true" if currentlyPlayingAudio is not paused, false if it is. */
function isAudioPlaying(){
    return!currentlyPlayingAudio.paused; //returns true if currentlyPlayingAudio is not paused
}

/** Catches audio if it fails, and replays it. Fixes some errors, like some instances of "Uncaught (in promise) DOMException" , which frequents in Chrome. */
function audioFallback(){
    const playPromise = currentlyPlayingAudio.play();
    if (playPromise !== null){
        playPromise.catch(() => { currentlyPlayingAudio.play(); });
    }
}

/** variable endOfAudio is set to true when currentlyPlayingAudio ends, and endOfAudioFunction is also triggered, to be used where needed. */
var endOfAudio = false;
currentlyPlayingAudio.onended = function(){
    console.log("♪ ended.");
    endOfAudio = true;
    audioEnded(currentlyPlayingAudio);
    currentlyPlayingAudio="";
};

/** method fastForward adds (seconds) amount of seconds to currentlyPlayingAudio's current time.
 * @param seconds (number) - the amount of seconds to skip forwards */
function fastForward(seconds){
    let prevTime = currentTime();

    currentlyPlayingAudio.currentTime += seconds;

    console.log(prevTime+"  ->  +"+ seconds + "s  ->  "+currentTime());
}
function currentTime(){
    let time = currentlyPlayingAudio.currentTime;
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time - minutes * 60); //.toString().slice(0,-7)

    if(minutes.toString().length < 2)  minutes= "0"+minutes;
    if(seconds.toString().length < 2)  seconds= "0"+seconds;

    return minutes+"m"+seconds+"s"; //alt: return array with [minutes, seconds];
}

/*function loadAudio(file){
    var audio = new Audio("Resources/audio/"+file+".mp3");
    audio.addEventListener('canplaythrough', currentTime, false);
}
var filesToPreload =
    [   "Haruomi Hosono - Sports Men",
        "Junko Yagami - Tasogare no Bay City (Twilight's Bay City)",
        "Kikuchi Momoko - Mystical Composer",
        "Mariya Takeuchi - Plastic Love",
        "Meiko Nakahara - Dance in the memories",
        "Tatsuro Yamashita - Magic Ways",
        "Tatsuro Yamashita - Ride On Time",
        "Tatsuro Yamashita - Sparkle",
        "Yasuha - Flyday Chinatown"
    ];
for(let i=0; i<filesToPreload.length; i++){
    loadAudio(filesToPreload[i]);
}*/


//_____________________________________________ GRAFMAKER _________________________________________
/**
 * Method lagGraf() lager sidelengs søylediagram med gitt data array
 * @param data {Array} - Navn på arrayet med dataen
 * @param canvasId {String} - ID til Canvas man vil generere grafen i
 */
function lagGraf(data, canvasId) {
    let canvas = document.getElementById(canvasId);
    let G = canvas.getContext("2d");
    let textWidth = 200;
    let totalWidth = canvas.width;                  /* canvas bredden er statisk */
    let columnWidth = totalWidth - textWidth - 15;
    canvas.height = data.length * 30;

    let highestValue = 0;     //Største verdien i arrayet, begrenser bredden på søylen
    for (let i=0; i<data.length; i++) { //Finner den største verdien i dataarrayet
        if (data[i].verdi > highestValue) {
            highestValue = data[i].verdi;
        } }
    G.font = "20px 'Times New Roman'"; //Først tekstørrelse så font
    G.textAlign = "end"; //Høyrejusterer teksten, høyre side av teksten plasseres på punktet den skrives til. Forhindrer overlapping med søylene og ser fint ut.
    G.textBaseline = "hanging"; //Teksten plasseres nedenfor punktet den skrives til

    for (let i=0; i < data.length; i++) {
        let width = (data[i].verdi / highestValue) * columnWidth;
        G.fillStyle = "#000000";
        G.fillText(data[i].label + "(" + data[i].verdi + ")", textWidth, (30 * i) + 3);
        G.fillStyle = "hsl(" + i * 30 + ",100%, 70%)";
        G.fillRect(textWidth + 5, (30 * i) + 3, width, 24);
    }
}

/**
 * resetGraf() Tømmer ett gitt array og lager ny graf av det. Til bruk sammen med lagGraf()
 */
function resetGraf(array) {
    array = [];
    lagGraf(array);
}

/**
 * method addObjectToArray() legger et objekt med gitt navn og gitt verdi inn i gitt array.
 * @param key1 {String | Number | Object | Array} - første key
 * @param key2 {Number | String | Object | Array} - andre key
 * @param array {Array} - Arrayet som dette objektet legges inn i
 */
function addObjectToArray(array, key1, key2, label1, label2) {
    let object = {};
    object[label1] = key1;
    object[label2] = key2;
    array.push(object);
}



//____________________________________ FIND SMALLEST NUMBER OF AN ARRAY ______________________
//var numbersArray1=[30,7,19,412,5,39,4,-3,1,0];
//numbersArray1.name = 'numbersArray1';
const minNumb = {
    index: function(array){                     //alt: let min = Math.min.apply(null, numbers);
        for (let i = 0; i < array.length; i++) {
            if (array[i] < array[minIndex]) {
                var minIndex = i;
            }}return minIndex;
    }, 
    numb: function(array){
        return array[minNumb.numb(array)];
    },
    delete: function(array){
        let min = minNumb.numb(array);
        array.splice(array.indexOf(min), 1);
        return numbers;
    }
} ;
// f.eks. /** Overfører minste tall til et nytt array og fjerner det fra det gamle
// smallestNumbers.push(minNumb.index(numbersArray2))
// minNumb.delete(numbersArray2)





//_______________________________________ knick knacks ____________________________


/**
 * coolDown disables given element for given amount of time, running functions "coolDownStart" at start and "coolDownEnd" at end, which I can use where I need.
 * @param elementId
 * @param seconds
 */
function coolDown(elementId, seconds){
    coolDownStart(elementId);
    document.getElementById(elementId).disabled = true;
    setTimeout(function(){
        document.getElementById(elementId).disabled = false;
        coolDownEnd(elementId);
        }, seconds*1000);
}
var isCoolDown = false;
function coolDownStart(elementId){
    isCoolDown = true;
    document.getElementById(elementId).classList.add("disabled");
} function coolDownEnd(elementId){
    isCoolDown = false;
    document.getElementById(elementId).classList.remove("disabled");
}


function removeQuotes(string){
    for (let i=0; i<string.length; i++){
        string[i] = string[i].replace("\"", "");
    }
    return string;
} //jeg gjør om mange relativt enkle koder og styles til funksjoner og classes, for å gjøre koden mer readable, som er veldig viktig.