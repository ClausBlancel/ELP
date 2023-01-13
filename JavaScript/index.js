// Importe le module readline
const readline = require('readline')
const { exec } = require('child_process')
const process = require('process')

CMDS = {}
OS = process.platform

if (OS == "win32") {
    CMDS = {
        lp : "tasklist",
        bing : {
            cmd : "taskkill",
            "-k" : "/f /pid",
            "-p" : "/s /pid",
            "-c" : "/r /pid"
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

async function listProcesses() {
    exec(CMDS.lp, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
    });
}

async function killProcess(param, pid) {
    exec(CMDS.bing.cmd + " " + CMDS.bing[param] + " " + pid, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
    });
}

async function main() {
    // Crée une interface
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})

    // Lance le premier prompt
    rl.prompt()

    // Crée un évènement 'line' qui s'exécute en cas de retour chariot
    rl.on('line', async (line) => {
        if (line == "exit") {
            process.exit()
        } else if (line == "lp") {
            await listProcesses()
        } else if (line.startsWith("bing")) {
            await killProcess(line.split(" ")[1], line.split(" ")[2])
        }
        rl.prompt()
    })

    // Ferme le prompt en cas de fermeture (Ctrl-D / Ctrl-C)
    rl.on('close', () => process.exit())

}

main()