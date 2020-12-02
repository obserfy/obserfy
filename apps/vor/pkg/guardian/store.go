package guardian

type (
	Guardian struct {
		Id      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Phone   string `json:"phone"`
		Note    string `json:"note"`
		Address string `json:"address"`
	}

	Store interface {
		CheckPermission(userId string, guardianId string) (bool, error)
		GetGuardian(id string) (*Guardian, error)
		DeleteGuardian(id string) (int, error)
		UpdateGuardian(
			id string,
			name *string,
			email *string,
			phone *string,
			note *string,
			address *string,
		) (int, error)
	}
)
