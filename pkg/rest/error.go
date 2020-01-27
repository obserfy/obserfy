package rest

type ErrorJson struct {
	Error ErrorPayload `json:"error"`
}

type ErrorPayload struct {
	Message string `json:"message"`
}


