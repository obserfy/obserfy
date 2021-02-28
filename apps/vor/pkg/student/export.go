package student

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/postgres"
	richErrors "github.com/pkg/errors"
	"github.com/signintech/gopdf"
)

func ExportCurriculumPdf(curriculum domain.Curriculum, progress []postgres.StudentMaterialProgress) (*gopdf.GoPdf, error) {
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{
		PageSize: *gopdf.PageSizeA4,
	}) //595.28, 841.89 = A4
	pdf.AddPage()

	err := loadFonts(pdf)
	if err != nil {
		return nil, err
	}

	for _, area := range curriculum.Areas {
		err := printTitle(pdf, area.Name)
		if err != nil {
			return nil, err
		}

		for _, subject := range area.Subjects {
			err := printSubject(pdf, subject.Name)
			if err != nil {
				return nil, err
			}

			for _, material := range subject.Materials {
				err := printMaterial(pdf, material.Name)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	return pdf, nil
}

func printTitle(pdf *gopdf.GoPdf, title string) error {
	pdf.Br(24)
	err := pdf.SetFont("inter-bold", "", 24)
	if err != nil {
		return richErrors.Wrap(err, "set fonts")
	}

	preventPageYOverflow(pdf)
	err = pdf.Cell(nil, title)
	if err != nil {
		return err
	}
	pdf.Br(14)
	return nil
}

func printSubject(pdf *gopdf.GoPdf, subject string) error {
	pdf.Br(32)
	err := pdf.SetFont("inter-regular", "", 14)
	if err != nil {
		return richErrors.Wrap(err, "set fonts")
	}

	preventPageYOverflow(pdf)
	err = pdf.Cell(nil, subject)
	if err != nil {
		return err
	}
	pdf.Br(24)
	return nil
}

func printMaterial(pdf *gopdf.GoPdf, material string) error {
	pdf.Br(14)
	err := pdf.SetFont("inter-regular", "", 12)
	if err != nil {
		return richErrors.Wrap(err, "set fonts")
	}

	preventPageYOverflow(pdf)
	err = pdf.Cell(nil, material)
	if err != nil {
		return err
	}
	pdf.Br(14)
	return nil
}

func loadFonts(pdf *gopdf.GoPdf) error {
	err := pdf.AddTTFFont("inter-regular", "./Inter-Regular.ttf")
	if err != nil {
		return richErrors.Wrap(err, "failed to add regular font")
	}

	err = pdf.AddTTFFont("inter-bold", "./Inter-Bold.ttf")
	if err != nil {
		return richErrors.Wrap(err, "failed to add bold font")
	}
	return nil
}

func preventPageYOverflow(pdf *gopdf.GoPdf) {
	y := pdf.GetY()
	maxHeight := gopdf.PageSizeA4.H - 25
	if y > maxHeight {
		pdf.AddPage()
	}
}
