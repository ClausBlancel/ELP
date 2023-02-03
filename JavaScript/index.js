// Importation des modules
const readline = require('readline')
const { exec } = require('child_process')
const process = require('process')
const keypress = require('keypress');

// Définition d'un dictionnaire de commandes en fonction de l'OS
OS = process.platform
CMDS = {}

if (OS == "win32") {
    CMDS = {
        lp : "tasklist",
        bing : {
            cmd : "taskkill",
            "-k" : "/f /pid",
            "-p" : "/s /pid", // marche pas
            "-c" : "/r /pid"  // marche pas
        }
    }
} else if (OS == "linux") {
    CMDS = {
        lp : "ps -aux",
        bing : {
            cmd : "kill",
            "-k" : "-KILL",
            "-p" : "-STOP",
            "-c" : "-CONT"
        },
    }
}

// Définition des fonctions

/**
 * Exécute une commande dans un processus enfant
 * @param {string} command
 * @returns {Promise}
 */
function execute_command(command) {
    try {
        return new Promise ((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`)
                    reject(error)
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                    reject(stderr)
                }
                console.log(`${stdout}`)
                resolve(stdout)
            })
        })      
    } catch (error) {
        console.log(error)
    }
}


/**
 * Détache un processus du CLI
 * @param {int} pid 
 */
function keep(pid) {

}

/**
 * Fonction principale
 */
async function main() {
    // Crée une interface
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    rl.setPrompt('>>>')

    keypress(process.stdin);

    process.stdin.on('keypress', function (ch, key) {
      if (key && key.ctrl && key.name == 'p') {
        console.log('Ctrl+P => Sortie du programme');
        rl.close();
      }
    });
    
    process.stdin.setRawMode(true);

    // Affiche le premier prompt
    rl.prompt()

    // Attend une ligne de commande 
    rl.on('line', async (line) => {
        // Si la ligne de commande se termine par un point d'exclamation, on exécute la commande en arrière-plan
        if (line.endsWith("!")) {
            if (line.startsWith("lp")) {
                execute_command(CMDS.lp)
                
            } else if (line.startsWith("bing")) {
                var args = line.split(" ")
                execute_command(CMDS.bing.cmd + " " + CMDS.bing[args[1]] + " " + args[2])

            } else if (line.startsWith("ex")) {
                execute_command(line.split(" ")[1])     

            } else if (line.startsWith("keep")) {
                keep(line.split(" ")[1])

            } else if (line == "") {
                // Ne rien faire
            } else {
                console.log("Commande inconnue")

            }

        // Sinon, on attend la fin de l'exécution de la commande
        } else {
            if (line.startsWith("lp")) {
                await execute_command(CMDS.lp) // liste les processus

            } else if (line.startsWith("bing")) {
                var args = line.split(" ")
                await execute_command(CMDS.bing.cmd + " " + CMDS.bing[args[1]] + " " + args[2]) // tue un processus, le suspend ou le reprend

            } else if (line.startsWith("ex")) {
                await execute_command(line.split(" ")[1]) // exécute un fichier en fonction de son chemin relatif ou absolu ou s'il est dans le PATH

            } else if (line.startsWith("keep")) {
                await keep(line.split(" ")[1])

            } else if (line == "") {
                // Ne rien faire
            } else {
                console.log("Commande inconnue")

            }

        }
        rl.prompt()
    }).on('close', () => process.exit()) // Quitte le programme si Ctrl+D / Ctrl+C

}

main()