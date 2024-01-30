'use strict';

window.addEventListener('load', () => {
    //Här kickar ni igång ert program
});

/**
 * Hämtar hem alla användare i vår localStorage lista, alternativt skapar och populerar den med det som finns i users.js
 * 
 * @returns {[...{username: string, password: string}]} Returnerar en array med objekt innehållande {username, password}
 */
function getUsers() {

    //Om users inte existerar i localStorage => lägg till de users vi har förberett till localStorage. (Du kan alltså ta bort alla användare och lägga 
    // in nya utan att den populeras igen. Det är bara när man tar bort den helt som dessa läggs i automatiskt)
    if(!localStorage.getItem('users')){
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
function addUser(username, password){
    /*
     * vi kör getUsers för att hämta listan med användare och lägger dessa i en ny array, där vi även lägger till den nya användaren (därav de 
     * tre punkterna på funktions-namnet som betyder att vi vill ha alla värden från returvärdet, samt något mer) och sätter users i localStorage 
     * efter den nya arrayen som det bildar!
     * 
     * ID får vi fram genom att kolla om listan har någon på sista plats (alltså om den är tom eller inte) och sätter id numret efter antingen sista 
     * IDt +1, eller 1 för en tom array.
     * 
     */
    localStorage.setItem('users', JSON.stringify([...getUsers(), {username: username, password:password, id:getUsers()[getUsers().length-1]?.id+1 || 1}]));
}

/**
 * Tar bort en användare från listan. Finns inte användaren så händer inget (alltså om fel ID har kommit in som parameter)
 * 
 * @param {number} userId Användarens ID nummer
 * 
 * @returns {void} returnerar inget
 */
function removeUser(userId){
    localStorage.setItem('users', JSON.stringify(getUsers().filter(user => user.id !== userId)));
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
function setCurrentUser(userId){
    oGameData.currentUser = getUsers().filter(user => user.id === userId)[0] || {};
}