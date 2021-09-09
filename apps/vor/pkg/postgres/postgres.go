package postgres

import (
	"crypto/tls"
	"fmt"
	"github.com/google/uuid"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	richErrors "github.com/pkg/errors"
)

func Connect(user string, password string, addr string, tlsConfig *tls.Config, database string) *pg.DB {
	db := pg.Connect(&pg.Options{
		User:      user,
		Password:  password,
		Addr:      addr,
		Database:  database,
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

func InitTables(db *pg.Tx) error {
	_, err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	if err != nil {
		return richErrors.Wrap(err, "failed to create extension")
	}
	// Register many2many tables
	for _, model := range []interface{}{
		(*ImageToStudents)(nil),
		(*StudentToClass)(nil),
		(*GuardianToStudent)(nil),
		(*UserToSchool)(nil),
		(*ObservationToImage)(nil),
		(*FileToLessonPlan)(nil),
		(*LessonPlanToStudents)(nil),
		(*VideoToStudents)(nil),
	} {
		orm.RegisterTable(model)
	}

	// CreateAll tables
	for _, model := range []interface{}{
		(*Curriculum)(nil),
		(*Area)(nil),
		(*Subject)(nil),
		(*Material)(nil),
		(*Subscription)(nil),
		(*School)(nil),
		(*Image)(nil),
		(*Class)(nil),
		(*Weekday)(nil),
		(*Student)(nil),
		(*ImageToStudents)(nil),
		(*StudentToClass)(nil),
		(*Guardian)(nil),
		(*GuardianToStudent)(nil),
		(*StudentMaterialProgress)(nil),
		(*User)(nil),
		(*Session)(nil),
		(*UserToSchool)(nil),
		(*Attendance)(nil),
		(*PasswordResetToken)(nil),
		(*LessonPlanDetails)(nil),
		(*LessonPlanLink)(nil),
		(*LessonPlan)(nil),
		(*Observation)(nil),
		(*ObservationToImage)(nil),
		(*File)(nil),
		(*FileToLessonPlan)(nil),
		(*LessonPlanToStudents)(nil),
		(*Video)(nil),
		(*VideoToStudents)(nil),
		(*ProgressReport)(nil),
		(*StudentReport)(nil),
		(*StudentReportsAreaComment)(nil),
		(*StudentReportAssessment)(nil),
	} {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{IfNotExists: true, FKConstraints: true})
		if err != nil {
			return richErrors.Wrap(err, "Error initializing db")
		}
	}
	return nil
}

type Session struct {
	Token  string `pg:",pk,type:uuid"`
	UserId string
}

type Curriculum struct {
	Id           string `pg:"type:uuid"`
	Name         string
	Areas        []Area   `pg:"rel:has-many,fk:curriculum_id"`
	Schools      []School `pg:"rel:has-many"`
	Descriptions string
}

type Area struct {
	Id           string     `pg:"type:uuid"`
	CurriculumId string     `pg:"type:uuid,on_delete:CASCADE"`
	Curriculum   Curriculum `pg:"rel:has-one"`
	Name         string
	Subjects     []Subject `pg:"rel:has-many,fk:area_id"`
	Description  string
}

type Subject struct {
	Id          string `pg:"type:uuid"`
	AreaId      string `pg:"type:uuid,on_delete:CASCADE"`
	Area        Area   `pg:"rel:has-one"`
	Name        string
	Materials   []Material `pg:"rel:has-many,fk:subject_id"`
	Order       int        `pg:",use_zero"`
	Description string
}

type Material struct {
	Id          string  `pg:"type:uuid"`
	SubjectId   string  `pg:"type:uuid,on_delete:CASCADE"`
	Subject     Subject `pg:"rel:has-one"`
	Name        string
	Order       int `pg:",use_zero"`
	Description string
}

type StudentMaterialProgress struct {
	MaterialId string   `pg:",pk,type:uuid,on_delete:CASCADE"`
	Material   Material `pg:"rel:has-one"`

	StudentId string  `pg:",pk,type:uuid,on_delete:CASCADE"`
	Student   Student `pg:"rel:has-one"`

	Stage     int `pg:",notnull,use_zero"` // TODO: should be renamed to assessment
	UpdatedAt time.Time
}

type Gender int

const (
	NotSet Gender = iota
	Male
	Female
)

type Student struct {
	Id             string `json:"id" pg:",type:uuid"`
	Name           string `json:"name"`
	SchoolId       string `pg:"type:uuid,on_delete:CASCADE"`
	School         School `pg:"rel:has-one"`
	DateOfBirth    *time.Time
	Classes        []Class `pg:"many2many:student_to_classes,join_fk:class_id"`
	Gender         Gender  `pg:"type:int"`
	DateOfEntry    *time.Time
	Note           string
	CustomId       string
	Active         *bool `pg:",notnull,default:true"`
	ProfilePic     string
	Guardians      []Guardian   `pg:"many2many:guardian_to_students,join_fk:guardian_id"`
	LessonPlans    []LessonPlan `pg:"many2many:lesson_plan_to_students,join_fk:lesson_plan_id"`
	ProfileImageId string       `pg:",type:uuid,on_delete:SET NULL"`
	Images         []Image      `pg:"many2many:image_to_students,join_fk:image_id"`
	Videos         []Video      `pg:"many2many:video_to_students"`
	ProfileImage   Image        `pg:"rel:has-one"`
}

type Guardian struct {
	Id       string `pg:"type:uuid"`
	Name     string `pg:",notnull"`
	Email    string
	Phone    string
	Note     string
	Address  string
	SchoolId string    `pg:"type:uuid"`
	School   School    `pg:"rel:has-one"`
	Children []Student `pg:"many2many:guardian_to_students,join_fk:student_id"`
}

type GuardianRelationship int

const (
	Others GuardianRelationship = iota
	Mother
	Father
)

type GuardianToStudent struct {
	StudentId    string               `pg:"type:uuid,on_delete:CASCADE,pk"`
	Student      Student              `pg:"rel:has-one"`
	GuardianId   string               `pg:"type:uuid,on_delete:CASCADE,pk"`
	Guardian     Guardian             `pg:"rel:has-one"`
	Relationship GuardianRelationship `pg:"type:int"`
}

type StudentToClass struct {
	StudentId string  `pg:"type:uuid,on_delete:CASCADE"`
	Student   Student `pg:"rel:has-one"`
	ClassId   string  `pg:"type:uuid,on_delete:CASCADE"`
	Class     Class   `pg:"rel:has-one"`
}

type Observation struct {
	Id                 string    `json:"id" pg:",type:uuid,default:uuid_generate_v4()"`
	StudentId          string    `pg:",type:uuid,on_delete:CASCADE"`
	Student            *Student  `pg:"rel:has-one"`
	ShortDesc          string    `json:"shortDesc"`
	LongDesc           string    `json:"longDesc"`
	CategoryId         string    `json:"categoryId"`
	CreatedDate        time.Time `json:"createdDate"`
	EventTime          time.Time
	CreatorId          string     `pg:",type:uuid,on_delete:SET NULL"`
	Creator            *User      `pg:"rel:has-one"`
	LessonPlan         LessonPlan `pg:"rel:has-one"`
	LessonPlanId       string     `pg:"type:uuid,on_delete:SET NULL"`
	Guardian           Guardian   `pg:"rel:has-one"`
	GuardianId         string     `pg:"type:uuid,on_delete:SET NULL"`
	Area               Area       `pg:"rel:has-one"`
	AreaId             uuid.UUID  `pg:"type:uuid,on_delete:SET NULL"`
	Images             []Image    `pg:"many2many:observation_to_images,join_fk:image_id"`
	VisibleToGuardians bool       `pg:",notnull,default:false"`
}

type ObservationToImage struct {
	Observation   Observation `pg:"rel:has-one"`
	ObservationId string      `pg:"type:uuid,on_delete:CASCADE"`
	Image         Image       `pg:"rel:has-one"`
	ImageId       uuid.UUID   `pg:"type:uuid,on_delete:CASCADE"`
}

type Subscription struct {
	Id                 uuid.UUID `pg:",type:uuid"`
	CancelUrl          string
	Currency           string
	Email              string
	EventTime          time.Time
	MarketingConsent   bool
	NextBillDate       time.Time
	Status             string
	SubscriptionId     string
	SubscriptionPlanId string
	PaddleUserId       string
	UpdateUrl          string
}

type School struct {
	Id             string       `json:"id" pg:",type:uuid"`
	Name           string       `json:"name"`
	InviteCode     string       `json:"inviteCode"`
	Users          []User       `pg:"many2many:user_to_schools,join_fk:user_id"`
	CurriculumId   string       `pg:",type:uuid,on_delete:SET NULL"`
	Curriculum     Curriculum   `pg:"rel:has-one"`
	Guardian       []Guardian   `pg:"rel:has-many"`
	SubscriptionId uuid.UUID    `pg:",type:uuid,on_delete:SET NULL"`
	Subscription   Subscription `pg:"rel:has-one"`
	CreatedAt      time.Time    `pg:"default:now()"`
}

type Attendance struct {
	Id        string    `json:"id" pg:",type:uuid"`
	StudentId string    `pg:"type:uuid,on_delete:CASCADE"`
	Student   Student   `pg:"rel:has-one"`
	ClassId   string    `pg:"type:uuid,on_delete:CASCADE"`
	Class     Class     `pg:"rel:has-one"`
	Date      time.Time `json:"date"`
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid,unique:school_user"`
	School   School `pg:"rel:has-one"`
	UserId   string `pg:",type:uuid,unique:school_user"`
	User     User   `pg:"rel:has-one"`
}

type User struct {
	Id       string `json:"id" pg:",type:uuid"`
	Email    string `pg:",unique"`
	Name     string
	Password []byte
	Schools  []School `pg:"many2many:user_to_schools,join_fk:school_id"`
}

type PasswordResetToken struct {
	Token     string    `pg:",pk,type:uuid"`
	CreatedAt time.Time `pg:",notnull"`
	ExpiredAt time.Time `pg:",notnull"`
	UserId    string    `pg:",type:uuid,on_delete:CASCADE,notnull"`
	User      User      `pg:"rel:has-one"`
}

type Class struct {
	Id       string `pg:"type:uuid"`
	SchoolId string `pg:"type:uuid,on_delete:CASCADE"`
	School   School `pg:"rel:has-one"`
	Name     string
	// Only use the time of day and timezone (WIB 8.30AM).
	// Ignore other data
	StartTime time.Time `pg:",notnull"`
	EndTime   time.Time `pg:",notnull"`
	Weekdays  []Weekday `pg:"rel:has-many"`
	Students  []Student `pg:"many2many:student_to_classes,join_fk:student_id"`
}

type Weekday struct {
	ClassId string       `pg:",pk,type:uuid,on_delete:CASCADE"`
	Day     time.Weekday `pg:",pk,use_zero"`
	Class   Class        `pg:"rel:has-one"`
}

type (
	// TODO: Lesson plan might need an explicit relationship to a school.
	LessonPlanDetails struct {
		Id                string `pg:"type:uuid"`
		Title             string
		Description       string
		UserId            string `pg:",type:uuid"`
		User              User   `pg:"rel:has-one"`
		ClassId           string `pg:"type:uuid,on_delete:SET NULL"`
		SchoolId          string `pg:"type:uuid,on_delete:CASCADE"`
		Class             Class  `pg:"rel:has-one"`
		Files             []File `pg:"many2many:file_to_lesson_plans,join_fk:file_id"`
		RepetitionType    int    `pg:",use_zero"`
		RepetitionEndDate time.Time
		LessonPlans       []*LessonPlan    `pg:"rel:has-many"`
		Links             []LessonPlanLink `pg:"rel:has-many"`

		// Why we have area here? because we want to allow users
		// to be able to select an area, without selecting material.
		// AreaId should be ignored on application logic when MaterialId is set.
		Area       Area     `pg:"rel:has-one"`
		AreaId     string   `pg:"type:uuid,on_delete:SET NULL"`
		Material   Material `pg:"rel:has-one"`
		MaterialId string   `pg:"type:uuid,on_delete:SET NULL"`
	}

	// Each plan can have some more additional students attached to it.
	LessonPlanToStudents struct {
		LessonPlan   LessonPlan `pg:"rel:has-one"`
		LessonPlanId string     `pg:"type:uuid,on_delete:CASCADE"`
		Student      Student    `pg:"rel:has-one"`
		StudentId    string     `pg:"type:uuid,on_delete:CASCADE"`
	}

	LessonPlan struct {
		Id                  string            `pg:"type:uuid"`
		Date                *time.Time        `pg:",notnull"`
		LessonPlanDetailsId string            `pg:"type:uuid"`
		LessonPlanDetails   LessonPlanDetails `pg:"rel:has-one"`
		Students            []Student         `pg:"many2many:lesson_plan_to_students,join_fk:student_id"`
	}

	File struct {
		Id          string `pg:"type:uuid,pk"`
		SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
		School      School `pg:"rel:has-one"`
		Name        string
		LessonPlans []LessonPlanDetails `pg:"many2many:file_to_lesson_plans,join_fk:lesson_plan_details_id"`
		ObjectKey   string
	}

	FileToLessonPlan struct {
		LessonPlanDetailsId string            `pg:"type:uuid,on_delete:CASCADE"`
		LessonPlanDetails   LessonPlanDetails `pg:"rel:has-one"`
		FileId              string            `pg:"type:uuid,on_delete:CASCADE"`
		File                File              `pg:"rel:has-one"`
	}

	Image struct {
		Id        uuid.UUID `pg:"type:uuid"`
		SchoolId  string    `pg:"type:uuid,on_delete:cascade"`
		School    School    `pg:"rel:has-one"`
		ObjectKey string
		CreatedAt time.Time `pg:"default:now()"`
	}

	ImageToStudents struct {
		StudentId string  `pg:"type:uuid,on_delete:CASCADE"`
		Student   Student `pg:"rel:has-one"`
		ImageId   string  `pg:"type:uuid,on_delete:CASCADE"`
		Image     Image   `pg:"rel:has-one"`
	}

	LessonPlanLink struct {
		Id                  uuid.UUID `pg:"type:uuid"`
		Title               string
		Url                 string
		Image               string
		Description         string
		LessonPlanDetails   LessonPlanDetails `pg:"rel:has-one"`
		LessonPlanDetailsId string            `pg:"type:uuid,on_delete:CASCADE"`
	}

	Video struct {
		Id            uuid.UUID `pg:"type:uuid"`
		AssetId       string
		PlaybackId    string
		PlaybackUrl   string
		ThumbnailUrl  string
		UploadUrl     string
		UploadId      string
		Status        string
		UploadTimeout int32
		CreatedAt     time.Time
		User          User   `pg:"rel:has-one"`
		UserId        string `pg:"type:uuid,on_delete:SET NULL"`
		School        School `pg:"rel:has-one"`
		SchoolId      string `pg:"type:uuid,on_delete:SET NULL"`
	}

	VideoToStudents struct {
		StudentId string    `pg:"type:uuid,on_delete:CASCADE"`
		Student   Student   `pg:"rel:has-one"`
		VideoId   uuid.UUID `pg:"type:uuid,on_delete:CASCADE"`
		Video     Video     `pg:"rel:has-one"`
	}

	ProgressReport struct {
		Id          uuid.UUID `pg:"type:uuid"`
		SchoolId    string    `pg:"type:uuid,on_delete:CASCADE"`
		School      School    `pg:"rel:has-one"`
		Title       string
		PeriodStart time.Time
		PeriodEnd   time.Time
		Published   bool

		StudentReports    []StudentReport `pg:"rel:has-many"`
		FreezeAssessments bool
	}

	StudentReport struct {
		StudentId uuid.UUID `pg:"type:uuid,pk"`
		Student   Student   `pg:"rel:has-one"`

		ProgressReport   ProgressReport `pg:"rel:has-one"`
		ProgressReportId uuid.UUID      `pg:"type:uuid,pk,on_delete:CASCADE"`

		AreaComments []StudentReportsAreaComment `pg:"rel:has-many"`

		GeneralComments string
		Ready           bool
	}

	StudentReportsAreaComment struct {
		StudentReportProgressReportId uuid.UUID     `pg:"type:uuid,pk"`
		StudentReportStudentId        uuid.UUID     `pg:"type:uuid,pk"`
		StudentReport                 StudentReport `pg:"rel:has-one"`

		AreaId uuid.UUID `pg:"type:uuid,pk"`
		Area   Area      `pg:"rel:has-one"`

		Comments string
	}

	StudentReportAssessment struct {
		StudentReportProgressReportId uuid.UUID     `pg:"type:uuid,pk"`
		StudentReportStudentId        uuid.UUID     `pg:"type:uuid,pk"`
		StudentReport                 StudentReport `pg:"rel:has-one"`

		MaterialId string   `pg:"type:uuid,on_delete:CASCADE,pk"`
		Material   Material `pg:"rel:has-one"`

		Assessment int `pg:",notnull,use_zero"`
		UpdatedAt  time.Time
	}
)

// PartialUpdateModel makes it easy to partially update a table using go-pg by enforcing some
// rules.
// 1. accepts a pointer to differentiate between empty/zero values (empty strings, false, etc) and ignored values
// 2. nil values will be dropped and ignored
// 3. empty/zero values will be saved and therefore passed to go-pg (usually resulting in NULL being saved)
// 4. other values will be passed to go-pg
//
// Usage example:
//	planDetails := make(PartialUpdateModel)
//	planDetails.AddStringColumn("description", planInput.Description)
//	planDetails.AddStringColumn("title", planInput.Title)
//  planDetails.AddIdColumn("material_id", planInput.MaterialId)
//	db.Model(planDetails.GetModel()).
//		TableExpr("lesson_plan_details").
//		Where("id = ?", planInput.Id).
//		Update()
//
// In this example, if planInput.Description contains nil and title contains a valid name, then go-pg would only update
// the title, ignoring description column completely. PartialUpdateModel also doesn't contains any information about the
// table that is being operated on. It cares only about which column names should be updated and with what value.
type PartialUpdateModel map[string]interface{}

func (u *PartialUpdateModel) AddStringColumn(name string, value *string) {
	if value != nil {
		(*u)[name] = value
	}
}

func (u *PartialUpdateModel) AddIntColumn(name string, value *int) {
	if value != nil {
		(*u)[name] = value
	}
}

func (u *PartialUpdateModel) AddBooleanColumn(name string, value *bool) {
	if value != nil {
		(*u)[name] = value
	}
}

func (u *PartialUpdateModel) AddDateColumn(name string, value *time.Time) {
	if value != nil {
		(*u)[name] = value
	}
}

// If value is nil, we ignore it. If we pass in uuid.Nil, we'll set the value in postgres to NULL
// otherwise, we just pass in the UUID to postgres normally.
func (u *PartialUpdateModel) AddUUIDColumn(name string, value *uuid.UUID) {
	if value != nil {
		if *value == uuid.Nil {
			(*u)[name] = nil
		} else {
			(*u)[name] = value
		}
	}
}

func (u *PartialUpdateModel) AddIdColumn(name string, value *string) {
	if value != nil {
		(*u)[name] = value
		if *value == "" {
			(*u)[name] = nil
		}
	}
}

// GetModel generates a model that is valid for use in go-pg v10. The model doesn't contains table name.
// Table name will need to be provided to go-pg manually on query.
func (u *PartialUpdateModel) GetModel() *map[string]interface{} {
	model := (map[string]interface{})(*u)
	return &model
}

func (u *PartialUpdateModel) IsEmpty() bool {
	return len(*u) == 0
}
