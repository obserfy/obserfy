package user

type (
	User struct {
		Id    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	UserSchool struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}

	Store interface {
		GetUser(userId string) (*User, error)
		GetSchools(userId string) ([]UserSchool, error)
		AddSchool(userId string, invite string) error
	}
)
