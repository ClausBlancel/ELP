// Importation des modules
const prompt = require('prompt')
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
            switch (param) {
                case "-k":
                    console.log("Processus " + pid + " tué")
                    break;

                case "-p":
                    console.log("Processus " + pid + " mis en pause")
                    break;

                case "-c":
                    console.log("Processus " + pid + " relancé")
                    break;
            
                default:
                    break;
            }
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
        spawn(p, {
            stdio: 'inherit',
            shell: true
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
    try {
        spawn(CMDS.keep + " " + pid, {
            stdio: 'inherit',
            shell: true
        })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Fonction principale
 */
function main() {
    // keypress(process.stdin);

    // process.stdin.on('keypress', function (ch, key) {
    //   if (key && key.ctrl && key.name == 'p') {
    //     console.log('Ctrl+P => Sortie du programme');
    //     rl.close();
    //   }
    // });
    
    // process.stdin.setRawMode(true);
    
    prompt.start();

    new Promise((resolve, reject) => {
        prompt.get(['command'], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.command)
            }
        })
    })
    

}

main()