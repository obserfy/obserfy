package main

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"net/http"
)

func createArea(curriculumId string, areaName string) postgres.Area {
	return postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: curriculumId,
		Name:         areaName,
		Subjects:     nil,
	}
}

func createSubject(areaId string, subjectName string, order int) postgres.Subject {
	return postgres.Subject{
		Id:        uuid.New().String(),
		AreaId:    areaId,
		Name:      subjectName,
		Materials: nil,
		Order:     order,
	}
}

func createMaterials(subjectId string, materialNames []string) []postgres.Material {
	var materials []postgres.Material

	for idx, name := range materialNames {
		materials = append(materials, postgres.Material{
			Id:        uuid.New().String(),
			SubjectId: subjectId,
			Name:      name,
			Order:     idx,
		})
	}

	return materials
}

func createCulturalArea(curriculumId string) postgres.Area {
	cultural := createArea(curriculumId, "Cultural")
	geography := createSubject(cultural.Id, "Geography", 0)
	geography.Materials = createMaterials(geography.Id, []string{
		"Sandpaper Globe",
		"Continent Globe",
		"Puzzle Map of The World",
		"Puzzle Map of Asia",
		"Puzzle Map of Africa",
		"Puzzle Map of Europe",
		"Puzzle Map of North America",
		"Puzzle Map of South America",
		"Puzzle Map of Australia",
		"Animals of the World",
		"Puzzle Map of Indonesia",
		"Puzzle Map of Indonesia Provence",
		"Introduction of the Three Elements; Land, water and Air",
		"Land and Water Forms",
		"Land and Water Form Cards",
		"Land and Water Definitions",
		"Flags",
	})
	history := createSubject(cultural.Id, "History", 1)
	history.Materials = createMaterials(history.Id, []string{
		"Daily Calendar",
		"Sequence Cards",
		"Birthday Celebration",
		"Time Line of Child's Life",
		"History Stories",
		"Clock",
	})
	zoology := createSubject(cultural.Id, "Zoology", 2)
	zoology.Materials = createMaterials(zoology.Id, []string{
		"Body part of animals",
		"Classified Nomenclature Cards",
		"Animal Puzzle",
		"Animals of the World",
		"Vertebrate and Invertebrate",
		"Animal Sorting Game",
	})
	botany := createSubject(cultural.Id, "Botany", 3)
	botany.Materials = createMaterials(botany.Id, []string{
		"Preparing the outdoor environment",
		"Preparing the indoor environment",
		"Nature Table",
		"Classified Cards",
		"Parts of the Tree",
		"Botany Cabinet",
		"Definitions of the Parts of the Tree",
		"Leaf Cabinet",
		"Gathering Seeds",
	})
	science := createSubject(cultural.Id, "Science", 4)
	science.Materials = createMaterials(science.Id, []string{
		"The Human Body",
		"Use of a Magnifying Glass",
		"Use of a Magnet",
		"Feeling Box",
		"Sink and Float",
		"Living and Non-Living Things",
		"Raising Water Level with Washers",
		"Mixing colors",
	})
	cultural.Subjects = []postgres.Subject{geography, history, zoology, botany, science}
	return cultural
}

func createLanguageArea(curriculumId string) postgres.Area {
	language := createArea(curriculumId, "Language")
	oral := createSubject(language.Id, "Oral Language", 5)
	oral.Materials = createMaterials(oral.Id, []string{
		"Story Telling",
		"Reading Story",
		"Rhymes",
		"Songs",
		"Enrichment of Vocabulary",
		"Letter sound Songs",
		"I Spy Game",
	})
	written := createSubject(language.Id, "Written Language", 6)
	written.Materials = createMaterials(written.Id, []string{
		"Inset for Design",
		"Sand Paper Letters",
		"Introduction to Large Movable Alphabet",
		"Sand Tray",
		"Tracing Lines",
		"Writing letters on the lined chalk board",
		"Pink box 1 ; objects + LMA",
		"Pink box 2 ; picture cards + LMA",
		"Pink box 3 ; objects and word cards",
		"Pink box 4 ; picture cards and word cards",
		"Pink box 5 ; silent reading",
		"Box 6 ; sight words",
		"Pink words list",
		"Pink phrases",
		"Pink sentences",
		"Reading books",
		"Blue box 1 ; objects + LMA",
		"Blue box 2 ; picture cards + LMA",
		"Blue box 3 ; objects and word cards",
		"Blue box 4 ; picture cards and word cards",
		"Blue box 5 ; silent reading",
		"Blue box 6 ; sight words",
		"Blue phrases",
		"Blue sentences",
		"Reading books",
		"Introduction to Phonogram",
		"Small Movable Alphabet",
		"Phonogram dictionary:",
		"ai – ai, ay, ei, a-e",
		"ee – ee, ea, y, ie, e-e",
		"ie – ie, y, igh, i-e",
		"oa – oa, ow, oe, o-e",
		"ue – ue, oo, ew, u-e",
		"or – or, au, ough, aw",
		"er – er, ir, ur",
		"ou – ou, ow",
		"oy – oy, oi",
		"s – ce/ci, cy, s",
		"j – ge/gi, j",
		"f – ph, f",
		"e – e, ea",
		"shun – sion/tion – there is no reading folder for this",
		"Phonogram objects and Small Movable Alphabet",
		"Phonogram pictures cards and word cards",
		"Phonogram word list",
		"Phonogram phrases",
		"Phonogram Sentences",
		"Reading books",
		"Noun",
		"Verb",
		"Adjective",
		"Singular *",
		"Plural *",
		"Early Grammar",
	})
	language.Subjects = []postgres.Subject{oral, written}
	return language
}

func createMathArea(curriculumId string) postgres.Area {
	math := createArea(curriculumId, "Math")
	toTen := createSubject(math.Id, "Counting Numbers through Ten", 0)
	toTen.Materials = createMaterials(toTen.Id, []string{
		"Number Rods",
		"Sandpaper Numbers",
		"Number Rods and Cards",
		"Spindle Boxes",
		"Cards and Counters",
		"Memory Game",
		"Introduction to Decimal System one of each",
		"Formation of Numbers",
		"Introduction to Decimal system nine of each",
		"Teens Board",
		"Ten Boards",
		"Addition Snake Game",
		"Addition Strip Board",
		"Addition Charts",
		"Subtraction Snake Game",
		"Subtraction Strip Board",
		"Multiplication Bead",
		"Multiplication Board",
		"Multiplication Charts",
		"Division Board",
	})
	bankGame := createSubject(math.Id, "Bank Game", 1)
	bankGame.Materials = createMaterials(bankGame.Id, []string{
		"Addition",
		"Multiplication",
		"Subtraction",
		"Division",
		"Stamp Game",
		"Word Problem",
		"Fractions",
	})
	math.Subjects = []postgres.Subject{toTen, bankGame}
	return math
}

func createPracticalLifeArea(curriculumId string) postgres.Area {
	practicalLife := createArea(curriculumId, "Practical Life")
	preliminaryExercise := createSubject(practicalLife.Id, "Preliminary Exercise", 0)
	preliminaryExercise.Materials = createMaterials(preliminaryExercise.Id, []string{
		"Carrying a mat",
		"Unrolling/rolling a mat",
		"Carrying a chair",
		"Carrying a table",
		"Carrying a tray",
		"Carrying a jug",
		"Carrying a scissor",
		"Opening and closing a door",
		"Turning pages of a book",
		"Opening and closing bottles",
		"Folding Cloths",
		"Pouring grains",
		"Pouring water",
		"Spooning grains",
		"Transferring objects",
	})
	careOfSelf := createSubject(practicalLife.Id, "Care of Self", 1)
	careOfSelf.Materials = createMaterials(careOfSelf.Id, []string{
		"Washing Hands",
		"Dressing Frame :",
		"Buttons",
		"Snaps",
		"Hook and Eye",
		"Zipper",
		"Bow",
		"Lacing",
		"Safety Pins",
	})
	careOfEnvironment := createSubject(practicalLife.Id, "Care of Environment", 2)
	careOfEnvironment.Materials = createMaterials(careOfEnvironment.Id, []string{
		"Dusting a table",
		"Washing a table",
		"Arranging Flowers",
		"Setting a table",
		"Sweeping",
	})
	classroomSkills := createSubject(practicalLife.Id, "Classroom Skills", 3)
	classroomSkills.Materials = createMaterials(classroomSkills.Id, []string{
		"Sharpening Pencil",
		"Use of Scissors: cutting straight lines",
		"Use of Scissors: cutting curve lines",
		"Use of Scissors: cutting shapes",
		"Use of ruler",
		"Use of glue with applicator",
	})
	graceAndCourtesy := createSubject(practicalLife.Id, "Grace and Courtesy", 4)
	graceAndCourtesy.Materials = createMaterials(graceAndCourtesy.Id, []string{
		"Greeting a person",
		"Thank you",
		"Excuse me",
		"Introduction of one's self",
		"Yawning",
		"Coughing",
		"Interrupting",
		"Offering Help",
	})
	controlOfMovement := createSubject(practicalLife.Id, "Control of Movement", 5)
	controlOfMovement.Materials = createMaterials(controlOfMovement.Id, []string{
		"How to walk",
		"Walking on the Line",
		"Silence game",
	})
	practicalLife.Subjects = []postgres.Subject{
		preliminaryExercise,
		careOfSelf,
		careOfEnvironment,
		classroomSkills,
		graceAndCourtesy,
		controlOfMovement,
	}
	return practicalLife
}

func createSensorialArea(curriculumId string) postgres.Area {
	sensorial := createArea(curriculumId, "Sensorial")
	visualSense := createSubject(sensorial.Id, "Visual Sense", 0)
	visualSense.Materials = createMaterials(visualSense.Id, []string{
		"Cylinder Blocks",
		"Pink Tower",
		"Broad Stair",
		"Long Rods",
		"Color tablets 1",
		"Color Tablets 2",
		"Color Tablets 3",
		"Geometric Presentation Tray",
		"Geometric Cabinet",
		"Constructive Triangles: Triangular Box",
		"Constructive Triangles: Small Hexagonal Box",
		"Constructive Triangles: Large Hexagonal Box ",
		"Constructive Triangles: Rectangular Box",
		"Constructive Triangles: Blue Rectangular Box",
		"Knobless Cylinder",
		"Knobbed cylinder",
		"Binomial Cube",
		"Trinomial Cube",
	})
	tactileSense := createSubject(sensorial.Id, "Tactile Sense", 1)
	tactileSense.Materials = createMaterials(tactileSense.Id, []string{
		"Touch Boards",
		"Touch Tablets",
		"Touch Fabric",
		"Baric Tablet",
		"Thermic Tablets",
		"Geometric Solid",
		"Mystery Bag",
	})
	auditorySense := createSubject(sensorial.Id, "Auditory Sense", 2)
	auditorySense.Materials = createMaterials(auditorySense.Id, []string{
		"Sound Boxes",
	})
	olfactorySense := createSubject(sensorial.Id, "Olfactory Sense", 3)
	olfactorySense.Materials = createMaterials(olfactorySense.Id, []string{
		"Smelling Jars",
	})
	gustatory := createSubject(sensorial.Id, "Gustatory", 4)
	gustatory.Materials = createMaterials(gustatory.Id, []string{
		"Tasting Jar",
	})
	sensorial.Subjects = []postgres.Subject{
		visualSense,
		tactileSense,
		auditorySense,
		olfactorySense,
		gustatory,
	}
	return sensorial
}

func createDefaultCurriculum() postgres.Curriculum {
	curriculum := postgres.Curriculum{
		Id:    uuid.New().String(),
		Name:  "Montessori",
		Areas: nil,
	}
	cultural := createCulturalArea(curriculum.Id)
	language := createLanguageArea(curriculum.Id)
	math := createMathArea(curriculum.Id)
	practicalLife := createPracticalLifeArea(curriculum.Id)
	sensorial := createSensorialArea(curriculum.Id)

	curriculum.Areas = []postgres.Area{
		math,
		practicalLife,
		language,
		sensorial,
		cultural,
	}
	return curriculum
}

func insertFullCurriculum(school postgres.School, curriculum postgres.Curriculum) func(tx *pg.Tx) error {
	return func(tx *pg.Tx) error {
		// Save the curriculum tree.
		if err := tx.Insert(&curriculum); err != nil {
			return err
		}
		for _, area := range curriculum.Areas {
			if err := tx.Insert(&area); err != nil {
				return err
			}
			for _, subject := range area.Subjects {
				if err := tx.Insert(&subject); err != nil {
					return err
				}
				for _, material := range subject.Materials {
					if err := tx.Insert(&material); err != nil {
						return err
					}
				}
			}
		}

		// Update the school with the new curriculum id
		school.CurriculumId = curriculum.Id
		if err := tx.Update(&school); err != nil {
			return err
		}
		return nil
	}
}

func createCurriculumSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/areas/{areaId}", getArea(env))
	r.Method("GET", "/areas/{areaId}/subjects", getAreaSubjects(env))
	r.Method("GET", "/subjects/{subjectId}/materials", getSubjectMaterials(env))
	return r
}

func getArea(env Env) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Get area
		var dbArea postgres.Area
		if err := env.db.Model(&dbArea).
			Column("id", "name").
			Where("id=?", areaId).
			Select(); err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find area with specified ID", err}
		}

		// Write response
		response := responseBody{
			Id:   dbArea.Id,
			Name: dbArea.Name,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getAreaSubjects(env Env) rest.Handler {
	type simplifiedSubject struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		var subjects []postgres.Subject
		if err := env.db.Model(&subjects).
			Where("area_id=?", areaId).
			Select(); err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find subject with specified area ID", err}
		}

		// Write response
		var response []simplifiedSubject
		for _, subject := range subjects {
			response = append(response, simplifiedSubject{
				Id:    subject.Id,
				Name:  subject.Name,
				Order: subject.Order,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getSubjectMaterials(env Env) rest.Handler {
	type simplifiedMaterial struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		var materials []postgres.Material
		if err := env.db.Model(&materials).
			Where("subject_id=?", subjectId).
			Select(); err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find materials with the specified subject id", err}
		}

		// Write response
		var response []simplifiedMaterial
		for _, subject := range materials {
			response = append(response, simplifiedMaterial{
				Id:    subject.Id,
				Name:  subject.Name,
				Order: subject.Order,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}
