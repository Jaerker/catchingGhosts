'use strict';

/* Här har ni tillgång till ett globalt objekt som är valfritt att använda. Lägga gärna till era egna variabler här inne. */
/* Ni har även tillgång till metoderna top() och left() som anropas genom oGameData.top() osv. */

let oGameData = {
    
    currentUser: {},
    
    //Metod som räknar fram och returnerar ett numeriskt värde som skall utgöra left-koordinaten (CSS) för ett img-element.
    left : function() {
        return Math.round(Math.random() * ( window.innerWidth - 300)) + 1;
    },

    //Metod som räknar fram och returnerar ett numeriskt värde som skall utgöra top-koordinaten (CSS) för ett img-element.
    top : function() {
        return Math.round(Math.random() * ( window.innerHeight - 300)) + 1;
    }
};
