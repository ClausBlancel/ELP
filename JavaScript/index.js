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
        }
    }
}

// Définition des fonctions

// Liste les processus
function listProcesses() {
    exec(CMDS.lp, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
    });
}

// Tue, pause ou continue un processus en fonction du paramètre
function killProcess(param, pid) {
    exec(CMDS.bing.cmd + " " + CMDS.bing[param] + " " + pid, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
    });
}

// Exécute un fichier en fonction de son chemin relatif ou absolu ou s'il est dans le PATH
function ex(p) {
    try {
        const resolvedPath = path.resolve(p)
        exec(resolvedPath, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(stdout);
        });
    } catch (error) {
        spawn(p, {
            stdio: 'inherit',
            shell: true
        })
    }
}

// Fonction principale
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
        }
        rl.prompt()
    })

    // Ferme le prompt en cas de fermeture (Ctrl-D / Ctrl-C)
    rl.on('close', () => process.exit())

}

main()