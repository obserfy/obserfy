import React, {FC, useState} from "react"
import BackNavigation from "../BackNavigation/BackNavigation";
import {EDIT_CLASS_URL, SETTINGS_URL} from "../../routes";
import {Box, Card, Flex} from "theme-ui";
import Typography from "../Typography/Typography";
import {Link} from "../Link/Link";
import {useGetStudents} from "../../api/students/useGetStudents";
import SearchBar from "../SearchBar/SearchBar";
import Pill from "../Pill/Pill";
export const PageListOfStudents: FC = () => {
    const students=useGetStudents()
    const [searchTerm,setSearchTerm]=useState("")
    const filteredStudents = students.data?.filter(
        (student) =>
            student.name.match(new RegExp(searchTerm, "i"))
    )
    return (
    <Flex
        sx={{
            flexDirection: "column",
            maxWidth: "maxWidth.md",
        }}
        mx="auto"
    >
        <BackNavigation to={SETTINGS_URL} text="Settings" />
        <Box px={3} pb={3} pt={2}>
            <SearchBar
                sx={{ width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Box>
        {/*{classes.status === "loading" && <LoadingState />}*/}
        {/*{haveNoClass && <NoClassPlaceholder />}*/}
        {(students.data?.length ?? 0) > 0 && (
            <Flex sx={{ alignItems: "center" }} m={3} mb={4}>
                <Typography.H3
                    mr="auto"
                    sx={{
                        lineHeight: 1,
                    }}
                >
                    Students
                </Typography.H3>
            </Flex>
        )}
        {filteredStudents?.map(({ id, name,active }) => (
            <Link key={id} to={EDIT_CLASS_URL(id)}>
                <Card mx={3} mb={2} p={3}>
                    <Typography.Body
                    >
                        {name}
                    </Typography.Body>
                    <Pill
                        mx={0}
                        mt={2}
                        style={{width:'fit-content'}}
                        text={active?"active":"inactive"}
                        backgroundColor={active?"green":"red"}
color={"white"}
                        // backgroundColor={`materialStage.${stage.toLocaleLowerCase()}`}
                    />
                </Card>
            </Link>
        ))}
    </Flex>
)}

export default PageListOfStudents
