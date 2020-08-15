import React, {FC, useState} from "react"
import { useQueryString } from "../hooks/useQueryString"
interface Props {
    childId: string
}
const Navbar: FC<Props> = ({ childId }) => {
    const [active, setActive] = useState("gallery")

    return (
        <div className="sticky top-0 bg-surface border-b">
            <nav className="w-full flex max-w-3xl mx-auto pt-3">
                {/*<div*/}
                {/*  className="mx-3 py-1 border-b-2 border-black text-sm px-2"*/}
                {/*  style={{ marginBottom: "-1px" }}*/}
                {/*>*/}
                {/*  Lesson Plans*/}
                {/*</div>*/}
                <ul className="flex">
                    <li className="-mb-px mr-1">
                        <a className={`bg-white inline-block py-2 px-4 text-blue-700 font-semibold ${active === 'lesson-plan' ? 'border-b border-black' : ''}`}
                           href="/">Lesson P</a>
                    </li>
                    <li className="mr-1" onClick={() => setActive('gallery')}>
                        <a className={`${active === 'gallery' ? 'border-b border-black' : ''} bg-white inline-block py-2 px-4 text-blue-700 font-semibold`}
                           href={`/gallery?childId=${childId}`}>Gallery</a>
                    </li>
                    <li className="mr-1">
                        <a className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
                           href="#">Tab</a>
                    </li>
                    <li className="mr-1">
                        <a className="bg-white inline-block py-2 px-4 text-gray-400 font-semibold" href="#">Tab</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
