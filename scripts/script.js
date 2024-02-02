"use strict";

window.addEventListener('load', () => {
  //Här kickar ni igång ert program
  document.querySelector('#create').addEventListener('click', registerUser);
  document.querySelectorAll('#loginToggle, #registrationToggle').forEach(btn => btn.addEventListener('click', toggleForms));
  document.querySelector('#play').addEventListener('click', validateLogin);

});

/**
 * Hämtar hem alla användare i vår localStorage lista, alternativt skapar och populerar den med det som finns i users.js
 *
 * @returns {[...{username: string, password: string}]} Returnerar en array med objekt innehållande {username, password}
 */
function getUsers() {
  //Om users inte existerar i localStorage => lägg till de users vi har förberett till localStorage. (Du kan alltså ta bort alla användare och lägga
  // in nya utan att den populeras igen. Det är bara när man tar bort den helt som dessa läggs i automatiskt)

  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  //Skickar tillbaka localStorage listan som nu är populerad med användare
  return JSON.parse(localStorage.getItem('users'));

}

/**
 * Lägger in användare i användarlistan.
 *
 * @param {string} username Användarnamnet för personen som läggs till i användarlistan
 * @param {string} password Lösenordet för personen som läggs till i användarlistan
 * @returns {void} returnerar inget.
 */
function addUser(username, password) {
  /*
   * vi kör getUsers för att hämta listan med användare och lägger dessa i en ny array, där vi även lägger till den nya användaren (därav de
   * tre punkterna på funktions-namnet som betyder att vi vill ha alla värden från returvärdet, samt något mer) och sätter users i localStorage
   * efter den nya arrayen som det bildar!
   *
   * ID får vi fram genom att kolla om listan har någon på sista plats (alltså om den är tom eller inte) och sätter id numret efter antingen sista
   * IDt +1, eller 1 för en tom array.
   *
   */
  localStorage.setItem(
    'users',
    JSON.stringify([
      ...getUsers(),
      {
        username: username,
        password: password,
        id: getUsers()[getUsers().length - 1]?.id + 1 || 1,
      },
    ])
  );
}

/**
 * Tar bort en användare från listan. Finns inte användaren så händer inget (alltså om fel ID har kommit in som parameter)
 *
 * @param {number} userId Användarens ID nummer
 *
 * @returns {void} returnerar inget
 */
function removeUser(userId) {
  localStorage.setItem(
    'users',
    JSON.stringify(getUsers().filter((user) => user.id !== userId))
  );
}

/**
 * Sätter användaren för spelrundan. Kan vara bra att köra denna funktion när man lyckats logga in eller registrera en ny
 * användare, och bara passera in själva ID:t om man har det tillgängligt, underlättar väldigt om vi ska använda oss av att ta bort användare.
 *
 *
 * @param {number} userId Användarens ID nummer
 *
 * @return {void} returnerar inget
 */
function setCurrentUser(userId) {
  oGameData.currentUser =
    getUsers().filter((user) => user.id === userId)[0] || {};
}

function toggleForms(event) {
    event.preventDefault();
    document.querySelectorAll('#formLogin, #formRegistration').forEach(div => div.classList.toggle('main__form--hidden'));
}


function registerUser(event) {
  event.preventDefault();
  const message = document.querySelector('#registrationMsg'); 

  const username = document.querySelector('#registerUsername').value;
  const password = document.querySelector('#registerPassword').value;
  const passwordAgain = document.querySelector('#registerPasswordAgain').value;

  if (username.length === 0 || password.length === 0 || passwordAgain.length === 0) {
    message.textContent = 'Du måste skriva något i rutorna!';
  }
  else {

    if (getUsers().some((user) => user.name === username)) {
      message.textContent = 'Användaren finns redan!';
    } else if (password !== passwordAgain) {
      message.textContent = 'Lösenordet stämmer inte överens!';
    } else {
      addUser(username, password);
      document.querySelector('#loginMsg').textContent = 'Användare skapad!';
    }

  }


}

function toggleFormDivs(){
    document.querySelector('#formWrapper').classList.toggle('main__form-wrapper--hidden');
}

function startGame() {
    toggleFormDivs();
    //valjer plats för att placera spöken
    const mainRef = document.querySelector('main');
    //random antal spöken
    oGameData.ghosts = Math.floor(Math.random() * 6 + 10);

    //skapar div för att placera spöken på skärmen
    let gameDiv = document.createElement('div');
    gameDiv.id = 'game';
    
    //loopar igenom varje spöke och skapar en bild för varje
    for(let i = 0; i < oGameData.ghosts; i ++) {
        let img = document.createElement('img');

        img.src = oGameData.ghostImg;
        img.dataset.state = 'ghost';

        //ger spöken position
        img.style.position = 'absolute';
        img.style.left = oGameData.left() + 'px'; 
        img.style.top = oGameData.top() + 'px'; 

        img.addEventListener('mouseenter', checkCollision);
        gameDiv.appendChild(img);
    }
    mainRef.appendChild(gameDiv);
}


function checkCollision(event) {
    //när vi mouseenter spöke bilden ändras till nät
    if(event.target.dataset.state === 'ghost') {
        event.target.src = oGameData.netImg;
        event.target.dataset.state = 'net';
        //och vi får pöäng för varje spöke
        oGameData.score++;
    } else {
        //om vi mouseenter nät andras det till spöke igen
        event.target.src = oGameData.ghostImg;
        event.target.dataset.state = 'ghost';
        //förlorar poäng
        oGameData.score--;
    }
       //kollar om spelet är slut (kollar poäng)
    isGameFinished();
}

function isGameFinished() {
    //om poäng är samma som spöke antal då vann vi
    if(oGameData.score === oGameData.ghosts) {
        const gameDiv = document.querySelector('#game');
        //tar bort div med spöken
        gameDiv.remove();
        //visar meddelande
        const loginMsg = document.querySelector('#loginMsg');
        loginMsg.textContent = `${oGameData.currentUser.name} vann! Du fångade ` + oGameData.score + ` spöken!`;
        toggleFormDivs();
    
        //rensar score och antal spöken
        oGameData.score = 0;
        oGameData.ghosts = 0;
    }
}



// Kontrollera inloggning
function validateLogin(event) {
  event.preventDefault();
  // Hämtar användarnamn, lösenord och svar på fråga från formuläret
  const userName = document.querySelector('#loginUsername').value; // Hämtar användarnamnet från formuläret.
  const passWord = document.querySelector('#loginPassword').value; // Hämtar lösenordet från formuläret.
  const question = document.querySelector('#question').checked; // Hämtar svar på fråga från formuläret.

  try {
    // Kontrollerar om användarnamn, lösenord och frågan är ifyllda
    if (userName === '') {
      throw {
        'nodeRef': document.querySelector('#loginUsername'), // Referens till HTML-elementet där användarnamnet ska fyllas i.
        'msg': 'Username is required!' // Visar ett felmeddelande om användarnamnet saknas.
      };
    } 
    if (passWord === '') {
      throw {
        'nodeRef': document.querySelector('#loginPassword'), // Referens till HTML-elementet där lösenordet ska fyllas i.
        'msg': 'Password is required!' // Visar ett felmeddelande om lösenordet saknas.
      };
    } 
    if (!question) {
      throw {
        'nodeRef': document.querySelector('#question'), // Referens till HTML-elementet där en ruta ska bockas i.
        'msg': 'Confirm that you are not afraid of ghosts!' // Visar ett felmeddelande om man glömt klicka i svaret.
      };
    }
    // Hämtar uppgifter från users.js
    const users = getUsers();
    const user = users.find(user => user.name === userName && user.password === passWord); // Letar efter en användare med användarnamn och lösenord
    // Kastar ett fel om ingen matchande användare hittas
    if (!user) {
      throw {
        'nodeRef': document.querySelector('#loginUsername'),
        'msg': 'Invalid username or password!' // Visar ett felmeddelande om användarnamnet eller lösenordet är ogiltigt.
      };
    } 
    oGameData.currentUser = user;
    startGame();
    return true; // Returnerar true om allt stämmer.
    

  } catch (error) {
    document.querySelector('#loginMsg').textContent = error.msg; // Visar felmeddelandet i formuläret.
    return false; // Returnerar false eftersom inloggningen misslyckades.
  }
}

