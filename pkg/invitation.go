package main

import (
	"github.com/go-chi/chi"
	"net/http"
)

type Invitation struct {
	Id       string
	SchoolId string
}

func createInvitationSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/code", getCode(env))
	//r.Get("/new-code", generateNewCode(env))
	return r
}

func getCode(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//session, err := getSessionFromCtx(w, r, env.logger)
		//if err != nil {
		//
		//}
	}
}
