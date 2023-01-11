//Compression de données/Run-length encoding
//https://fr.wikibooks.org/wiki/Compression_de_donn%C3%A9es/Run-length_encoding

package main

import (
	"fmt"
)

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
	//On remarque que les chiffres sont codés de manière croissantes de 0 = 48 et 9 = 57
	for i := 0; i < len(s); i++ {
		nb = int(s[i] - 48)
		//Condition déterminant si le caractère est un nombre
		if s[i] <= 57 && s[i] >= 48 {
			//Boucle permettant de trouver le nombre si il comporte plus d'un chiffre
			for j := i + 1; j < len(s); j++ {
				if s[j] > 57 && s[j] < 48 {
					break
				}
			}
		}
		res += string(s[i])
		i += nb
	}
	return res
}

func main() {
	name := "12112"
	a := int(name[1])
	print(a)
}
