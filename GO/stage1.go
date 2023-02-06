//Compression de données/Run-length encoding
//https://fr.wikibooks.org/wiki/Compression_de_donn%C3%A9es/Run-length_encoding

//TODO :
// Faire en sorte que les goroutine de codage écrive dans un slice référencant les num de ligne et le resultat codé
// Se servir de ce slices pour écrire dans un fichier par la suite.

package main

import (
	"bufio"
	"fmt"
	"io"
	"math"
	"os"
)

type res struct {
	res  string
	line int
}

func codage(s string, line int, canal chan res) {
	final := res{res: "", line: line}
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
			final.res += fmt.Sprint(nb + 1)
		}
		final.res += string(s[i])
		i += nb
	}
	canal <- final
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

func insert(slice []string, index int, value string) []string {

	// Grow the slice by one element.
	slice = slice[0 : len(slice)+1]

	// Use copy to move the upper part of the slice out of the way and open a hole.
	copy(slice[index+1:], slice[index:])

	// Store the new value.
	slice[index] = value

	// Return the result.
	return slice
}

func ecrireFichier(s []string, fichier string) {
	file, err := os.OpenFile(fichier, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0600)
	defer file.Close() // on ferme automatiquement à la fin de notre programme

	if err != nil {
		panic(err)
	}

	// écrire dans le fichier
	for i := 0; i < len(s); i++ {
		_, err = file.WriteString(s[i])
	}

	if err != nil {
		panic(err)
	}
}

func main() {

	canal := make(chan res)

	// Ouvrir le fichier
	file, err := os.Open("adn.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}
	defer file.Close()

	// Créer un nouveau Reader pour lire le fichier
	reader := bufio.NewReader(file)
	numLigne := 0

	// Lire le fichier ligne par ligne et l'insérer dans un slice
	final := []string{}
	resultat := res{}
	for {
		numLigne++
		line, err := reader.ReadString('\n')
		if err != nil {
			if err != io.EOF {
				fmt.Println("Erreur lors de la lecture du fichier :", err)
			}
			break
		}
		go codage(line, numLigne, canal)
		resultat = <-canal
		final = append(final, "")
		final = append(final[:resultat.line], append([]string{resultat.res}, final[resultat.line:]...)...)

	}
	ecrireFichier(final[:], "resultat.txt")
}
