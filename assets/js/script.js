// === VARIABLES
let oCanvasHTML = document.querySelector("canvas");
let oContexte = oCanvasHTML.getContext("2d");

let nHauteurCanvas = oCanvasHTML.height;
let nLargeurCanvas = oCanvasHTML.width;

let sEtat = "intro";

let scores = [4, 7, 8, 3980, -3, 30, 50]
scores.sort()

function trierScore(elementA, elementB) {
    if (elementA < elementB) {
        return 1;
    } else if (elementA > elementB) {
        return -1
    } else {
        return 0;
    }
}

function trierMots(elementA, elementB) {

    elementA = elementA.toLowerCase()
    elementB = elementB.toLowerCase()

    if (elementA.localeCompare(elementB) < 1) {
        return -1;
    } else if (elementA > elementB) {
        return 1;
    } else {
        return 0;
    }
}

let mots = ["patate", "carotte", "radis", "tomate", "brocoli", "épinards", "endives"]
mots.sort(trierMots);


let listeCartes = [
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "blue", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "blue", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "green", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "green", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "yellow", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "yellow", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "purple", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "purple", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "orange", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "orange", estVisible: false },
];

let nbPairesTrouvees = 0;

// Cartes choisies par le joueur, si c'est null, aucune carte n'a été choisie
let choixCarte1 = null;
let choixCarte2 = null;

// Bouton pour démarrer sur l'écran d'intro
let oBoutonDemarrer = { x: nLargeurCanvas / 2 - 100, y: nHauteurCanvas - 100, largeur: 200, hauteur: 50, texte: "DÉMARRER", teinte: 0 };

// sons du jeu
let sons = {
    paireTrouvee: new Audio("assets/audio/sonPaire.wav"),
    finPartie: new Audio("assets/audio/sonFinPartie.wav"),
    erreur: new Audio("assets/audio/sonErreur.wav"),
};

sons.paireTrouvee.volume = 0.2;
sons.finPartie.volume = 0.2;
sons.erreur.volume = 0.8;

// === FONCTION D'INITIALISATION DU JEU ===
function initialiser() {
    setInterval(boucleJeu, 1000 / 60);
    window.addEventListener("click", onClicCanvas);
}

function redemarrerJeu() {
    melangerCartes()
}

// === Boucle de jeu ===
function boucleJeu() {
    oContexte.clearRect(0, 0, nLargeurCanvas, nHauteurCanvas);

    if (sEtat == "intro") {
        dessinerMenu();
    } else if (sEtat == "jeu") {
        dessinerCartes();
        dessinerUI();
    }
}

//=== FONCTIONS D'ÉCOUTEURs D'ÉVÉNEMENTS ===
function onClicCanvas(evenement) {
    let curseurX = evenement.offsetX;
    let curseurY = evenement.offsetY;

    if (sEtat == "intro" && detecterClicObjet(curseurX, curseurY, oBoutonDemarrer) == true) {
        sEtat = "jeu";
    } else if (sEtat == "jeu") {
        let carteTrouvee = null;

        for (let i = 0; i < listeCartes.length; i++) {
            let carte = listeCartes[i];
            let collisionclic = detecterClicObjet(curseurX, curseurY, carte)
            if (collisionclic == true) {
                carteTrouvee = carte;
                break
            }
        }// Fin for

        if(carteTrouvee != null && carteTrouvee.estVisible == false){
            if (choixCarte1==null){
                choixCarte1 = carteTrouvee;
                carteTrouvee.estVisible = true;
            } else if (choixCarte2 == null && carteTrouvee != choixCarte1){
                choixCarte2 = carteTrouvee;
                carteTrouvee.estVisible = true;
                validerFin();
            }
        }
    }
}

// === FONCTIONS D'AFFICHAGE DES ÉLÉMENTS DE JEU ===
function dessinerMenu() {
    oBoutonDemarrer.teinte++;

    if (oBoutonDemarrer.teinte >= 360) {
        oBoutonDemarrer.teinte = 0;
    }

    // Titre
    oContexte.fillStyle = "#333";
    oContexte.font = "bold 40px Arial";
    oContexte.textAlign = "center";
    oContexte.fillText("JEU DES PAIRES", nLargeurCanvas / 2, 100);

    // Instructions
    oContexte.font = "20px Arial";
    oContexte.fillText("Trouvez toutes les paires", nLargeurCanvas / 2, 150);

    // Bouton démarrer
    oContexte.fillStyle = `hsl(${oBoutonDemarrer.teinte}, 50%, 50%)`;
    oContexte.fillRect(oBoutonDemarrer.x, oBoutonDemarrer.y, oBoutonDemarrer.largeur, oBoutonDemarrer.hauteur);

    // Texte
    oContexte.fillStyle = "#fff";
    oContexte.font = "bold 24px Arial";
    oContexte.textAlign = "center";
    oContexte.fillText(oBoutonDemarrer.texte, oBoutonDemarrer.x + oBoutonDemarrer.largeur / 2, oBoutonDemarrer.y + oBoutonDemarrer.hauteur / 2 + 8);
}

function dessinerCartes() {
    for (let i = 0; i < listeCartes.length; i++) {
        let carte = listeCartes[i];

        let colonne = i % 4;
        let rangee = Math.floor(i / 4);
        let paddingX = colonne * 35
        let paddingY = rangee * 35;
        carte.x = colonne * carte.largeur + paddingX;
        carte.y = rangee * carte.hauteur + paddingY;

        if (carte.estVisible == true) {
            oContexte.fillStyle = carte.couleur
        } else {
            oContexte.fillStyle = "grey"
        }

        if (carte.estVisible){
             oContexte.fillStyle = carte.couleur
        }
       
        oContexte.fillRect(carte.x, carte.y, carte.largeur, carte.hauteur)

    }

}

function dessinerUI() {
    oContexte.fillStyle = "Black"
    oContexte.font = "30px Nazalization"
    oContexte.fillText(
        `Paires trouvée: ${nbPairesTrouvees}`,
        nLargeurCanvas / 2,
        nHauteurCanvas / 2, 
    );

 }

// === FONCTIONS DE LOGIQUE DES CARTES ===

   


function triAleatoire(elementA, elementB) {
    ;
    let tri = Math.random() * 2 - 1;
    return tri;
}
function trouverCarte(curseurX, curseurY) {
    for (let i = 0; i < listeCartes.length; i ++){
        let carte = listeCartes[i]
        if (detecterClicObjet == carte){
            return carte;
        }
    }
}

function validerFin() { 
    setTimeout(function(){
        
    })
}

// === FONCTIONS UTILITAIRES ===
function detecterClicObjet(curseurX, curseurY, objet) {
    if (curseurX >= objet.x && curseurX <= objet.x + objet.largeur && curseurY >= objet.y && curseurY <= objet.y + objet.hauteur) {
        return true;
    }
    return false;
}

window.addEventListener("load", initialiser);
