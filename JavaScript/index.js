// Importation des modules
const readline = require('readline')
const { spawn } = require('child_process')
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
 * Liste les processus en cours d'exécution
 */
async function listProcesses() {
    try {
        return new Promise((resolve, reject) => {
            spawn(CMDS.lp, {
                stdio: 'inherit',
                shell: true
            }).on('close', (code) => {
                resolve(code)
            })
        })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Kill, Pause ou Continue un processus à partir de son PID
 * @param {string} param 
 * @param {int} pid 
 */
function killProcess(param, pid) {
    try {
        return new Promise((resolve, reject) => {
            spawn(CMDS.bing.cmd + " " + CMDS.bing[param] + " " + pid, {
                stdio: 'inherit',
                shell: true
            }).on('close', (code) => {
                resolve(code)
            })
        })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Exécute un fichier en fonction de son chemin relatif ou absolu ou s'il est dans le PATH
 * @param {string} p 
 */
function ex(p) {
    try {
        return new Promise ((resolve, reject) => {
            spawn(p, {
                stdio: 'inherit',
                shell: true
            }).on('close', (code) => {
                resolve(code)
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
        if (line.endsWith("!")) {
            if (line.startsWith("lp")) {
                listProcesses()
            } else if (line.startsWith("bing")) {
                var args = line.split(" ")
                killProcess(args[1], args[2])
            } else if (line.startsWith("ex")) {
                ex(line.split(" ")[1])            
            } else if (line.startsWith("keep")) {
                keep(line.split(" ")[1])
            } else if (line == "") {
                // Ne rien faire
            } else {
                console.log("Commande inconnue")
            }
        } else {
            if (line.startsWith("lp")) {
                await listProcesses()
            } else if (line.startsWith("bing")) {
                var args = line.split(" ")
                await killProcess(args[1], args[2])
            } else if (line.startsWith("ex")) {
                await ex(line.split(" ")[1])            
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