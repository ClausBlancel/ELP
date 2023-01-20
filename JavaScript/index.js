// Importation des modules
const readline = require('readline')
const { exec } = require('child_process')
const { spawn } = require('child_process')
const process = require('process')
const path = require('path')
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
        keep : "bg",
    }
}

// Définition des fonctions

/**
 * Liste les processus en cours d'exécution
 */
function listProcesses() {
    spawn(CMDS.lp, {
        stdio: 'inherit',
        shell: true
    })
}

// background execution
// exec(CMDS.lp, (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
// });


/**
 * Kill, Pause ou Continue un processus à partir de son PID
 * @param {string} param 
 * @param {int} pid 
 */
function killProcess(param, pid) {
    try {
        spawn(CMDS.bing.cmd + " " + CMDS.bing[param] + " " + pid, {
            stdio: 'inherit',
            shell: true
            })
    } catch (error) {
        console.log(error)
    }
}

// background execution
// exec(CMDS.bing.cmd + " " + CMDS.bing[param] + " " + pid, (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
// });

/**
 * Exécute un fichier en fonction de son chemin relatif ou absolu ou s'il est dans le PATH
 * @param {string} p 
 */
function ex(p) {
    // try {
    //     exec(p, (err, stdout, stderr) => {
    //         console.log(stdout);
    //     });
    // } catch (error) {
        try {
            spawn(p, {
                stdio: 'inherit',
                shell: true
            })            
        } catch (error) {
            console.log(error)
        }
    // }
}


/**
 * Détache un processus du CLI
 * @param {int} pid 
 */
function keep(pid) {
    try {
        exec(CMDS.keep + " " + pid, (err, stdout, stderr) => {
            console.log(stdout);
        });
    } catch (error) {
        console.log(error)
    }
}

/**
 * Fonction principale
 */
function main() {
    // Crée une interface
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})

    keypress(process.stdin);

    process.stdin.on('keypress', function (ch, key) {
      if (key && key.ctrl && key.name == 'p') {
        console.log('Ctrl+P => Sortie du programme');
        rl.close();
      }
    });
    
    process.stdin.setRawMode(true);
    
    // Lance le premier prompt
    rl.prompt()

    // Crée un évènement 'line' qui s'exécute en cas de retour chariot
    rl.on('line', async (line) => {
        if (line == "exit") {
            process.exit()
        } else if (line.startsWith("lp")) {
            listProcesses()
        } else if (line.startsWith("bing")) {
            killProcess(line.split(" ")[1], line.split(" ")[2])
        } else if (line.startsWith("ex")) {
            ex(line.split(" ")[1])
        } else if (line.startsWith("keep")) {
            keep(line.split(" ")[1])
        } else {
            console.log("Commande inconnue")
        }
        rl.prompt()
    })

    // Ferme le prompt en cas de fermeture (Ctrl-D / Ctrl-C)
    rl.on('close', () => process.exit())

}

main()