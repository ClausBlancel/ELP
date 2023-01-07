// Importe le module readline
const readline = require('readline')

/**
 * Fonction qui crée un prompt qui va boucler
 * 
 * @returns {readline.ReadLine} L'interface configurée
 */
function createReadlineInterface() {
    // Crée un objet readline
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    // Crée un évènement 'line' qui s'exécute en cas de retour chariot
    // Dans ce cas là il relance un prompt pour avoir une boucle
    rl.on('line', () => rl.prompt())

    // Ferme le prompt en cas de fermeture (Ctrl-D)
    rl.on('close', () => process.exit())
    
    // Lance un prompt
    rl.prompt()

    return rl
}

createReadlineInterface()