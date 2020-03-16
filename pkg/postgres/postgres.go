package postgres

import (
	"crypto/tls"
	"fmt"
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	richErrors "github.com/pkg/errors"
	"time"
)

func Connect(user string, password string, addr string, tlsConfig *tls.Config) *pg.DB {
	db := pg.Connect(&pg.Options{
		User:      user,
		Password:  password,
		Addr:      addr,
		Database:  "defaultdb",
		TLSConfig: tlsConfig,
	})

	// Wait until connection is healthy
	for {
		_, err := db.Exec("SELECT 1")
		if err == nil {
			break
		} else {
			fmt.Println("Error: PostgreSQL is down")
			fmt.Println(err)
			time.Sleep(1000 * time.Millisecond)
		}
	}
	return db
}

func InitTables(db *pg.DB) error {
	for _, model := range []interface{}{
		(*Curriculum)(nil),
		(*Area)(nil),
		(*Subject)(nil),
		(*Material)(nil),
		(*School)(nil),
		(*Class)(nil),
		(*Weekday)(nil),
		(*Student)(nil),
		(*StudentMaterialProgress)(nil),
		(*User)(nil),
		(*Observation)(nil),
		(*Session)(nil),
		(*UserToSchool)(nil),
		(*PasswordResetToken)(nil),
	} {
		err := db.CreateTable(model, &orm.CreateTableOptions{IfNotExists: true, FKConstraints: true})
		if err != nil {
			return richErrors.Wrap(err, "Error initializing db")
		}
	}
	return nil
}

type Session struct {
	Token  string `pg:",pk" pg:",type:uuid"`
	UserId string
}
type Curriculum struct {
	Id    string `pg:"type:uuid"`
	Name  string
	Areas []Area `pg:"fk:curriculum_id"`
}

type Area struct {
	Id           string `pg:"type:uuid"`
	CurriculumId string `pg:"type:uuid,on_delete:CASCADE"`
	Curriculum   Curriculum
	Name         string
	Subjects     []Subject `pg:"fk:area_id"`
}

type Subject struct {
	Id        string `pg:"type:uuid"`
	AreaId    string `pg:"type:uuid,on_delete:CASCADE"`
	Area      Area
	Name      string
	Materials []Material `pg:"fk:subject_id"`
	Order     int        `pg:",use_zero"`
}

type Material struct {
	Id        string `pg:"type:uuid"`
	SubjectId string `pg:"type:uuid,on_delete:CASCADE"`
	Subject   Subject
	Name      string
	Order     int `pg:",use_zero"`
}

type StudentMaterialProgress struct {
	MaterialId string `pg:",pk,type:uuid,on_delete:CASCADE"`
	Material   Material
	StudentId  string `pg:",pk,type:uuid,on_delete:CASCADE"`
	Student    Student
	Stage      int
	UpdatedAt  time.Time
}

type Student struct {
	Id          string `json:"id" pg:",type:uuid"`
	Name        string `json:"name"`
	SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
	School      School
	DateOfBirth *time.Time
}

type Observation struct {
	Id          string `json:"id" pg:",type:uuid"`
	StudentId   string `pg:",type:uuid,on_delete:CASCADE"`
	Student     *Student
	ShortDesc   string    `json:"shortDesc"`
	LongDesc    string    `json:"longDesc"`
	CategoryId  string    `json:"categoryId"`
	CreatedDate time.Time `json:"createdDate"`
	EventTime   *time.Time
	CreatorId   string `pg:",type:uuid,on_delete:SET NULL"`
	Creator     *User
}

type School struct {
	Id           string `json:"id" pg:",type:uuid"`
	Name         string `json:"name"`
	InviteCode   string `json:"inviteCode"`
	Users        []User `pg:"many2many:user_to_schools,joinFK:user_id"`
	CurriculumId string `pg:",type:uuid,on_delete:SET NULL"`
	Curriculum   Curriculum
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid"`
	UserId   string `pg:",type:uuid"`
}

type User struct {
	Id       string `json:"id" pg:",type:uuid"`
	Email    string `pg:",unique"`
	Name     string
	Password []byte
	Schools  []School `pg:"many2many:user_to_schools,joinFK:school_id"`
}

type PasswordResetToken struct {
	Token     string    `pg:",pk,type:uuid"`
	CreatedAt time.Time `pg:",notnull"`
	ExpiredAt time.Time `pg:",notnull"`
	UserId    string    `pg:",type:uuid,on_delete:CASCADE,notnull"`
	User      User
}

type Class struct {
	Id       string `pg:"type:uuid"`
	SchoolId string `pg:"type:uuid"`
	School   School
	Name     string
	// Only use the time of day and timezone (WIB 8.30AM).
	// Ignore other data
	StartTime time.Time `pg:",notnull"`
	EndTime   time.Time `pg:",notnull"`
	Weekdays  []Weekday
}

type Weekday struct {
	ClassId string       `pg:",pk,type:uuid"`
	Day     time.Weekday `pg:",pk"`
	Class   Class
}
