//Compression de données/Run-length encoding
//https://fr.wikibooks.org/wiki/Compression_de_donn%C3%A9es/Run-length_encoding

package main

import (
	"fmt"
	"math"
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
func codage(s string) string {
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
	return res
}

func decodage(s string) string {
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
	return res
}

func main() {
	name := "aab12cdddd"
	debut, fin := decoupage(name)
	println(debut)
	println(fin)

}
