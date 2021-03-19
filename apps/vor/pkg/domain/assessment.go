package domain

//const (
//	PRESENTED = iota
//	PRACTICED
//	MASTERED
//)

func GetAssessmentName(stage int) string {
	if stage == 0 {
		return "Presented"
	}
	if stage == 1 {
		return "Practiced"
	}
	if stage == 2 {
		return "Mastered"
	}
	return ""
}
