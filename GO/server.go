package main

import (
	"bufio"
	"fmt"
	"math"
	"net"
	"strings"
)

func connection(c net.Conn) {

	for {
		netData, err := bufio.NewReader(c).ReadString('\n')
		if err != nil {
			fmt.Println(err)
			return
		}
		if strings.TrimSpace(string(netData)) == "STOP" {
			fmt.Println("Fermeture du serveur TCP")
			return
		}

		fmt.Print("-> ", string(netData))
		c.Write([]byte(codage(string(netData))))
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

	PORT := ":9999"
	l, err := net.Listen("tcp", PORT)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer l.Close()

	for {
		c, err := l.Accept()
		if err != nil {
			fmt.Println(err)
			return
		}
		go connection(c)

	}

}
