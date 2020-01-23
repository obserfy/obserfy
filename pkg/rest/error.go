package rest

type ErrorJson struct {
	Error ErrorPayload `json:"Error"`
}

type ErrorPayload struct {
	Message string `json:"message"`
}


