'use strict';

/* Här har ni tillgång till ett globalt objekt som är valfritt att använda. Lägga gärna till era egna variabler här inne. */
/* Ni har även tillgång till metoderna top() och left() som anropas genom oGameData.top() osv. */

let oGameData = {
   
    

    //Metod som räknar fram och returnerar ett numeriskt värde som skall utgöra left-koordinaten (CSS) för ett img-element.
    left : function() {

        let left = 0;
        if(this.ghost.width > this.net.width) {
            left = this.ghost.width;
        } else {
            left = this.net.width;
        }
        
        return Math.round(Math.random() * ( window.innerWidth - left )) + 1;
    },

    //Metod som räknar fram och returnerar ett numeriskt värde som skall utgöra top-koordinaten (CSS) för ett img-element.
    top : function() {

        let top = 0;
        if(this.ghost.height > this.net.height) {
            top = this.ghost.height;
        } else {
            top = this.net.height;
        }

        return Math.round(Math.random() * ( window.innerHeight - top )) + 1;
    }
};
