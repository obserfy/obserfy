package postgres

import (
	"crypto/tls"
	"fmt"
	"time"

	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	richErrors "github.com/pkg/errors"
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
		(*StudentToClass)(nil),
		(*Guardian)(nil),
		(*GuardianToStudent)(nil),
		(*StudentMaterialProgress)(nil),
		(*User)(nil),
		(*Observation)(nil),
		(*Session)(nil),
		(*UserToSchool)(nil),
		(*Attendance)(nil),
		(*PasswordResetToken)(nil),
		(*LessonPlanDetails)(nil),
		(*LessonPlan)(nil),
		(*File)(nil),
		(*FileToLessonPlan)(nil),
		(*LessonPlanToStudents)(nil),
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
	Id      string `pg:"type:uuid"`
	Name    string
	Areas   []Area `pg:"fk:curriculum_id"`
	Schools []School
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

type Gender int

const (
	NotSet Gender = iota
	Male
	Female
)

type Student struct {
	Id          string `json:"id" pg:",type:uuid"`
	Name        string `json:"name"`
	SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
	School      School
	DateOfBirth *time.Time
	Classes     []Class `pg:"many2many:student_to_classes,joinFK:class_id"`
	Gender      Gender  `pg:"type:int"`
	DateOfEntry *time.Time
	Note        string
	CustomId    string
	Active      *bool `pg:",notnull,default:true"`
	ProfilePic  string
	Guardians   []Guardian   `pg:"many2many:guardian_to_students,joinFK:guardian_id"`
	LessonPlans []LessonPlan `pg:"many2many:lesson_plan_to_students,joinFK:lesson_plan_id"`
}

type Guardian struct {
	Id       string `pg:"type:uuid"`
	Name     string `pg:",notnull"`
	Email    string
	Phone    string
	Note     string
	SchoolId string `pg:"type:uuid"`
	School   School
	Children []Student `pg:"many2many:guardian_to_students,joinFK:student_id"`
}

type GuardianRelationship int

const (
	Others GuardianRelationship = iota
	Mother
	Father
)

type GuardianToStudent struct {
	StudentId    string `pg:"type:uuid,on_delete:CASCADE"`
	Student      Student
	GuardianId   string `pg:"type:uuid,on_delete:CASCADE"`
	Guardian     Guardian
	Relationship GuardianRelationship `pg:"type:int"`
}

type StudentToClass struct {
	StudentId string `pg:"type:uuid,on_delete:CASCADE"`
	Student   Student
	ClassId   string `pg:"type:uuid,on_delete:CASCADE"`
	Class     Class
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
	Guardian     []Guardian
}

type Attendance struct {
	Id        string `json:"id" pg:",type:uuid"`
	StudentId string `pg:"type:uuid,on_delete:CASCADE"`
	Student   Student
	ClassId   string `pg:"type:uuid,on_delete:CASCADE"`
	Class     Class
	Date      time.Time `json:"date"`
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid"`
	School   School
	UserId   string `pg:",type:uuid"`
	User     User
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
	SchoolId string `pg:"type:uuid,on_delete:CASCADE"`
	School   School
	Name     string
	// Only use the time of day and timezone (WIB 8.30AM).
	// Ignore other data
	StartTime time.Time `pg:",notnull"`
	EndTime   time.Time `pg:",notnull"`
	Weekdays  []Weekday
	Students  []Student `pg:"many2many:student_to_classes,joinFK:student_id"`
}

type Weekday struct {
	ClassId string       `pg:",pk,type:uuid,on_delete:CASCADE"`
	Day     time.Weekday `pg:",pk,use_zero"`
	Class   Class
}

type (
	// TODO: Lesson plan might need an explicit relationship to a school.
	LessonPlanDetails struct {
		Id                string `pg:"type:uuid"`
		Title             string
		Description       *string
		ClassId           string `pg:"type:uuid,on_delete:SET NULL"`
		SchoolId          string `pg:"type:uuid,on_delete:CASCADE"`
		Class             Class
		Files             []File `pg:"many2many:file_to_lesson_plans,joinFK:file_id"`
		RepetitionType    int    `pg:",use_zero"`
		RepetitionEndDate time.Time
		LessonPlans       []*LessonPlan

		// Why we have area here? because we want to allow users
		// to be able to select an area, without selecting material.
		// AreaId should be ignored on application logic when MaterialId is set.
		Area       Area
		AreaId     string `pg:"type:uuid,on_delete:SET NULL"`
		Material   Material
		MaterialId string `pg:"type:uuid,on_delete:SET NULL"`
	}

	// Each plan can have some more additional students attached to it.
	LessonPlanToStudents struct {
		LessonPlan   LessonPlan
		LessonPlanId string `pg:"type:uuid,on_delete:CASCADE"`
		Student      Student
		StudentId    string `pg:"type:uuid,on_delete:CASCADE"`
	}

	LessonPlan struct {
		Id                  string     `pg:"type:uuid"`
		Date                *time.Time `pg:",notnull"`
		LessonPlanDetailsId string     `pg:"type:uuid"`
		LessonPlanDetails   LessonPlanDetails
		Students            []Student `pg:"many2many:lesson_plan_to_students,joinFK:student_id"`
	}

	File struct {
		Id          string `pg:"type:uuid,pk"`
		SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
		School      School
		Name        string
		LessonPlans []LessonPlan `pg:"many2many:file_to_lesson_plans,joinFK:lesson_plan_id"`
		ObjectKey   string
	}

	FileToLessonPlan struct {
		LessonPlanDetailsId string `pg:"type:uuid,on_delete:CASCADE"`
		LessonPlanDetails   LessonPlanDetails
		FileId              string `pg:"type:uuid,on_delete:CASCADE"`
		File                File
	}
)
