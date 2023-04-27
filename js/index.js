/*******************************************************************************
    Contrôler l'affichage du démarrage d'une partie de jeu
*******************************************************************************/
// Extraits audio à utiliser dans l'interface du jeu
let audio = {
    succes: new Audio('media/succes.wav'),
    echec: new Audio('media/echec.wav')
};

// Saisir les éléments du DOM à utiliser pour gérer la scène du jeu
let sectionLettresDuMot = document.querySelector('.lettres-du-mot');
let sectionLettresDisponibles = document.querySelector('.lettres-disponibles');
let h2Indice = document.querySelector('h2.indice');
let btnNouvellePartie = document.querySelector('.btn-nouvelle-partie');
let curseur = document.querySelector('.curseur');
let racine = document.querySelector(':root');

// Gérer le bouton "Nouvelle partie"
btnNouvellePartie.addEventListener('click', demarrer);

// Gérer le double-clic de l'indice
h2Indice.addEventListener('dblclick', devoilerIndice);

/**
 * Afficher l'indice du mot en ajoutant la classe appropriée à l'élément 
 * le contenant, et désactiver le curseur personnalisé.
 * (utilisée lorsque le bloc HTML contenant l'indice de jeu est double-cliqué)
 * @param {Event} event : objet Event de l'événement en cours 
 */
function devoilerIndice(event) {
    event.target.classList.add('devoiler');
    // On ajuste les classes du curseur personnalisé une fois que l'indice est dévoilée
    // Voir aussi la fonction 'devoilerIndice' pour une meilleure compréhension
    curseur.classList.remove('c-indice');
    curseur.innerText = "";
}

/**
 * Démarrer une nouvelle partie
 * (utilisée lorsque le bouton correspondant est cliqué)
 */
function demarrer() {
    // Remettre la scène de jeu à son état initial
    reinitialiser();

    // Choisir un mot au hasard dans le tableau "mots" (ce tableau se trouve 
    // dans l'autre fichier JS inclut dans la page HTML ;-))
    let positionMotAleatoire = Math.floor(Math.random() * mots.length);
    let objetMotChoisi = mots[positionMotAleatoire];

    // Obtenir les chaînes du mot et de l'indice
    let mot = objetMotChoisi.mot;
    let indice = objetMotChoisi.indice;

    // Insérer le texte de l'indice dans l'élément saisit ci-dessus
    h2Indice.innerText = indice;

    // Composer l'aire du jeu
    let divLettre;
    for (let lettre of mot) {
        divLettre = document.createElement('div');
        // Remarquer qu'on veut s'assurer que les lettres sont affichées en majuscule
        divLettre.innerText = lettre.toUpperCase();
        // Associer une classe ayant comme nom la lettre courante (sera utile
        // uniquement pour vérifier le résultat plus loin dans le code)
        divLettre.classList.add(lettre.toUpperCase());
        sectionLettresDuMot.append(divLettre);
    }
}

/**
 * Afficher le clavier des lettres
 * (utilisée au démarrage de la page)
 */
function afficherClavier() {
    // Vider la section du clavier
    sectionLettresDisponibles.innerHTML = "";
    let spanLettre;
    for (let lettre of "abcdefghijklmnopqrstuvwxyz") {
        // Créer l'élément span
        spanLettre = document.createElement('span');
        // Lui ajouter la lettre dans son contenu texte
        spanLettre.innerText = lettre.toUpperCase();
        // Lui associer le gestionnaire d'événement 'clic'
        spanLettre.addEventListener('click', validerLettre);
        spanLettre.addEventListener('mouseover', changerCurseurBouton);
        spanLettre.addEventListener('mouseout', changerCurseurBouton);
        // L'insérer dans la section appropriée
        sectionLettresDisponibles.append(spanLettre);
    }
}

/**
 * Valider une lettre pour le mot à deviner
 * (utilisée lorsqu'on clique une lettre du clavier)
 * @param {Event} event : objet Event de l'événement en cours 
 */
function validerLettre(event) {
    let toucheChoisie = event.target;
    let lettreChoisie = toucheChoisie.innerText;
    // Vérifier s'il y a cette lettre dans le mot à deviner (on se rappelle 
    // que nous avions ajouté une classe nommée suivant la lettre à chaque élément 
    // contenant une lettre du mot à deviner)
    // On suppose pour commencer que la lettre n'est pas bonne ...
    let etatVerif = 'echec';
    // ... puis on cherche le tableau des éléments du DOM qui ont cette lettre 
    // parmi leurs classes CSS ...
    let lettresDevinees = sectionLettresDuMot.querySelectorAll('.' + lettreChoisie);
    // ... si le tableau retourné contient des éléments ...
    if (lettresDevinees.length > 0) {
        // ... alors la lettre est bonne (elle est dans le mot à deviner !)
        etatVerif = 'succes';
    }
    // En fin de compte, on peut jouer le son correspondant à l'état de la 
    // vérification ('echec' ou 'succes') ...
    audio[etatVerif].play();
    // ... on rembobine vite le son pour qu'il puisse être 're-joué' même en rafale :
    audio[etatVerif].currentTime = 0;
    /* ... et on désactive cette touche:
     * en enlevant le gestionnaire d'événement
     * et, en associant la classe CSS qui va illustrer si la lettre choisie était bonne ou non
     */
    toucheChoisie.removeEventListener('click', validerLettre);
    toucheChoisie.classList.add('choisie-' + etatVerif);

    // On parcourt toutes les cases du mot à deviner qui contiennent la lettre 
    // choisie ... 
    for (let chaqueLettreDevinee of lettresDevinees) {
        // ... et on affiche la lettre en lui associant la classe CSS appropriée
        chaqueLettreDevinee.classList.add('devoiler');
    }
}

/**
 * Réinitialiser la scène du jeu 
 * (utilisée lorsqu'on démarre une nouvelle partie)
 */
function reinitialiser() {
    // Remettre le voile sur l'indice
    h2Indice.classList.remove('devoiler');

    // Vider la section du mot à deviner
    while (sectionLettresDuMot.children.length>0) {
        sectionLettresDuMot.firstChild.remove();
    }

    // Reconstruire le clavier des lettres
    afficherClavier();
}

/************************** CURSEUR *******************************************/
window.addEventListener('mousemove', bougerCurseur);

// Utile pour cacher le curseur lorsque la souris ne survole plus la fenêtre du 
// navigateur
window.addEventListener('mouseover', basculerAffichageCurseur);
window.addEventListener('mouseout', basculerAffichageCurseur);

// Changer le curseur lorsqu'on survol le H2 d'indice du mot
h2Indice.addEventListener('mouseover', changerCurseurIndice);
h2Indice.addEventListener('mouseout', changerCurseurIndice);

// Changer le curseur lorsqu'on survol le bouton "Nouvelle partie"
btnNouvellePartie.addEventListener('mouseover', changerCurseurBouton);
btnNouvellePartie.addEventListener('mouseout', changerCurseurBouton);


/**
 * Déplacer le curseur personnalisé pour suivre la position du pointeur de souris
 * @param {Event} event : objet Event de l'événement en cours 
 */
function bougerCurseur(event) {
    racine.style.setProperty("--mouse-x", event.clientX + "px");
    racine.style.setProperty("--mouse-y", event.clientY + "px");
}

/**
 * Cacher ou afficher le curseur personnalisé lorsque le pointeur de souris
 * sort de la zone de la fenêtre du navigateur ou y rentre.
 * @param {Event} event : objet Event de l'événement en cours 
 */
function basculerAffichageCurseur(event) {
    if (event.type == 'mouseout') {
        curseur.classList.add('inactif');
    } else {
        curseur.classList.remove('inactif');
    }
}

/**
 * Modifier la forme et le contenu du curseur personnalisé lorsqu'on survole
 * l'élément qui contient l'indice sur mot à deviner.
 * @param {Event} event : objet Event de l'événement en cours 
 */
function changerCurseurIndice(event) {
    // Lorsqu'on survol l'indice ET l'indice n'est pas visible
    if (event.type == 'mouseover' && !event.target.classList.contains('devoiler')) {
        curseur.classList.add('c-indice');
        curseur.innerText = "Double-clic pour dévoiler l'indice";
    } else {
        curseur.classList.remove('c-indice');
        curseur.innerText = "";
    }
}

/**
 * Modifier la forme du curseur personnalisé lorsqu'on survole un élément qui 
 * contient un bouton cliquable dans la page.
 * @param {Event} event : objet Event de l'événement en cours 
 */
function changerCurseurBouton(event) {
    // Lorsqu'on survol un "bouton"
    if (event.type == 'mouseover') {
        curseur.classList.add('c-bouton');
    } else {
        curseur.classList.remove('c-bouton');
    }
}