// Importe le module readline
const readline = require('readline');
  

// Crée un objet readline avec les flux d'entrée et de sortie standard
const prompts = readline.createInterface(process.stdin, process.stdout);
  
// Methode de question :
//  - Premier argument = Requête
//  - Deuxième argument = Gestionnaire qui interprète la réponse
prompts.question('>>', (response) => {
  
    console.log(`Bonjour ${response} !`);
      
    // Terminer le processus
    process.exit();
});