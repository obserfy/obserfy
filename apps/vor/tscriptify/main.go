/**
Generates typescripts interfaces from golang structs that we use on our APIs

Run with `yarn run gen:models`
*/
package main

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/google/uuid"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
	"time"
)

func main() {
	converter := typescriptify.New().Add(domain.ProgressReport{})
	converter.WithIndent("  ")
	converter.ManageType(uuid.UUID{}, typescriptify.TypeOptions{TSType: "string"})
	converter.ManageType(time.Time{}, typescriptify.TypeOptions{TSType: "string"})
	converter.CreateInterface = true

	err := converter.ConvertToFile("src/__generated__/models.ts")
	if err != nil {
		panic(err.Error())
	}
}
