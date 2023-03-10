//Compression de données/Run-length encoding
//https://fr.wikibooks.org/wiki/Compression_de_donn%C3%A9es/Run-length_encoding

/*
TODO:
- lire un fichier avec des retour a la ligne déjà fait
- faire une goroutine pour coder chaque ligne indépendament
*/
package main

import (
	"bufio"
	"fmt"
	"io"
	"math"
	"os"
	"time"
)

// On coupe le string en deux au niveau de l'indice donné
func doublestring(s string, a int) (string, string) {
	if a < len(s) {
		debut := ""
		fin := ""
		for i := 0; i < a; i++ {
			debut += string(s[i])
		}
		for i := a; i < len(s); i++ {
			fin += string(s[i])
		}
		return debut, fin
	} else {
		return "0", "0"
	}
}

func decoupage(s string) (string, string) {
	//On regarde a gauche de la moitié si ya un chiffre
	if s[len(s)/2-1] >= 48 && s[len(s)/2-1] <= 57 {
		//On regarde si y'en a un a droite aussi
		if s[len(s)/2] >= 48 && s[len(s)/2] <= 57 {
			//Si oui alors on parcourt la chaine de caractère vers la droite et on s'arrète quand il n'y a plus de chiffre
			nbchiffre := 1
			for i := len(s)/2 + 1; i < len(s); i++ {
				if s[i] < 48 || s[i] > 57 {
					break
				}
				nbchiffre++
			}
			println(nbchiffre)
			println(len(s) / 2)
			if nbchiffre >= len(s)/2 {
				return "0", "0"
			}
			return doublestring(s, len(s)/2+nbchiffre+1)
		} else {
			return doublestring(s, len(s)/2+1)
		}
		//Si ya pas de chiffre a gauche on retourne à la moitié
	} else {
		return doublestring(s, len(s)/2+1)
	}
}
func codage(s string, canal chan string) {
	res := ""
	nb := 0
	for i := 0; i < len(s); i++ {
		nb = 0
		for j := i + 1; j < len(s); j++ {
			if s[j] != s[i] {
				break
			}
			nb++
		}
		if nb != 0 {
			res += fmt.Sprint(nb + 1)
		}
		res += string(s[i])
		i += nb
	}
	canal <- res
}

func decodage(s string, canal chan string) {
	res := ""
	nb := 0
	nbchiffre := 0
	h := 0
	j := 0
	//On remarque que les chiffres sont codés de manière croissantes de 0 = 48 et 9 = 57
	for i := 0; i < len(s); i++ {
		nbchiffre = 1
		nb = 0
		//Condition déterminant si le caractère est un nombre
		if s[i] >= 48 && s[i] <= 57 {
			//On détermine d'abord le nombre de chiffre dans le nombre
			for h = i + 1; h < len(s); h++ {
				if s[h] < 48 || s[h] > 57 {
					break
				}
				nbchiffre++
			}
			//Boucle donnant le nombre inscrit dans la chaîne de caractère
			for j = i; j < i+nbchiffre; j++ {
				nb += int(math.Pow(10, float64(nbchiffre-j+i-1))) * int(s[j]-48)
			}
			//On ajoute le nombre de lettre trouvé dans le résultat final
			for h := 0; h < nb; h++ {
				res += string(s[i+nbchiffre])
			}
			i += nbchiffre

		} else {
			res += string(s[i])
		}
	}
	canal <- res
}

func ecrireFichier(s string, fichier string) {
	file, err := os.OpenFile(fichier, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0600)
	defer file.Close() // on ferme automatiquement à la fin de notre programme

	if err != nil {
		panic(err)
	}

	_, err = file.WriteString(s + "\n") // écrire dans le fichier
	if err != nil {
		panic(err)
	}
}

func main() {

	start := time.Now()

	canal := make(chan string)

	// Ouvrir le fichier
	file, err := os.Open("adn.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}
	defer file.Close()

	// Créer un nouveau Reader pour lire le fichier
	reader := bufio.NewReader(file)

	// Lire le fichier ligne par ligne
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			if err != io.EOF {
				fmt.Println("Erreur lors de la lecture du fichier :", err)
			}
			break
		}
		go codage(line, canal)
		go ecrireFichier(<-canal, "resultat.txt")
	}

	end := time.Now()
	println(end.Sub(start))
}
