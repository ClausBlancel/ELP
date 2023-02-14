# ELP

Repo des projets du module ELP en : GO, Elm et JavaScript

## JavaScript

Avant de lancer le programme il faut se déplacer dans le répertoire JavaScript et lancer :

    npm install

Ensuite lancer le CLI avec la commande :

    node index.js


## GO

Ce programme permet de coder des lignes de caractères en synthétisant les multiples. 
Exemple : AAAABBBBCDA -> 4A4BCDA

 - stage0.go utilise un fichier texte "adn.txt" dans lequel sont écrit des lignes de caractère puis il écrit dans un fichier "resultat.txt" le codage de chaque ligne
 - stage1.go utilise le même principe mais chaque ligne est codée dans une goroutine séparée avant d'être insérée dans le fichier "resultat.txt"
 - server.go est un serveur utlisant un socket TCP. Il renvoi au client la chaîne de caractère codée à partir de la chaîne initialement envoyée par le client. Ce serveur peut supporter de multiples clients.
 - client.go se connecte au serveur et propose à l'utilisateur d'entrer une chaîne de caractère puis retourne sa version codé par le serveur.
 
Pour lancer un programme go, il est nécessaire d'utiliser la commande :

    go run programme.go
    
Pensez à remplacer programme.go par le programme voulu.

Pour le client et le serveur, il est nécessaire de lancer le programme server.go avant les client.go.



## ELM

Pour accéder au fichier .txt avec l'ensembles des mots, le programme fait une requête Http sur `localhost:5500`.

Il faut donc avoir un serveur local de lancé sur ce port pour que le code fonctionne.
