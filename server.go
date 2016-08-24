package main

import (
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/codegangsta/negroni"
)

func main() {
	log.Info("Starting generator")
	n := negroni.Classic()
	n.Use(negroni.NewStatic(http.Dir("dist")))
	n.Run(":3030")
}
