// Importe le module readline
const readline = require('readline')

// Crée une interface
const rl = readline.createInterface({input: process.stdin, output: process.stdout})

// Lance le premier prompt
rl.prompt()

// Crée un évènement 'line' qui s'exécute en cas de retour chariot
rl.on('line', (line) => {
    if (line == "exit") {
        process.exit()
    } else 
    if (line != "") {
        console.log(`Coucou ${line} !`) 
    }
    rl.prompt()
})

// Ferme le prompt en cas de fermeture (Ctrl-D)
rl.on('close', () => process.exit())
