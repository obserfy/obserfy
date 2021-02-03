import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { StaticImage } from "gatsby-plugin-image"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import Button from "../components/Button/Button"
import Layout from "../components/layout"
import SEO from "../components/seo"
import WaveyBg from "../images/wavey-bg.svg"

const IndexPage: FC = () => {
  const { i18n } = useLingui()

  return (
    <Layout>
      <SEO
        title={t`Montessori record keeping software`}
        description={t`Montessori record keeping software and parent communication tool. Bridging the gap between schools and parents.`}
      />
      <div className="justify-center pt-8 md:pt-16">
        <div className="md:flex flex-row-reverse items-center mb-32">
          <div className="w-full bg-cover bg-center mb-4 md:mb-0">
            <StaticImage
              src="../images/hero.png"
              className="w-full"
              alt={i18n._(t`Montessori record keeping on phone and laptop`)}
              layout="constrained"
              width={704}
              formats={["auto", "webp", "avif"]}
              placeholder="blurred"
            />
          </div>
          <div className="prose prose-lg md:prose-lg max-w-xl px-4 w-full">
            <h1 className="text-4xl md:text-5xl">
              <Trans>Run your Montessori School efficiently</Trans>
            </h1>
            <p className="my-8 text-gray-700 font-body">
              <Trans>
                <GreenBold>Store</GreenBold> your student&apos;s data.{" "}
                <GreenBold>Plan</GreenBold> their lessons. And{" "}
                <GreenBold>share</GreenBold> it all with parents with ease, on
                one platform built for the need of Montessori Schools.
              </Trans>
            </p>
            <div className="sm:flex">
              <a
                href="https://app.obserfy.com/register"
                className="block mb-3 sm:mb-0 sm:mr-3"
              >
                <Button className="w-full sm:w-auto ">
                  <Trans>Try for Free</Trans>
                </Button>
              </a>
              <Link to="/contact">
                <Button secondary className="w-full sm:w-auto ">
                  <Trans>Contact Us</Trans>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start mb-16 lg:mb-0 md:mt-64 relative">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-1/2 -left-8 -top-16 md:-left-32 md:-top-32"
          >
            <path
              fill="#00E399"
              d="M38.7,-72.5C46.5,-62.6,46.7,-44.8,48.9,-31.4C51.1,-18,55.4,-9,59,2.1C62.5,13.1,65.3,26.2,62.7,38.9C60.1,51.6,52,63.9,40.7,66.9C29.3,70,14.6,63.9,2.5,59.5C-9.6,55.2,-19.3,52.6,-26.7,47.3C-34.1,41.9,-39.3,33.8,-50.6,25.5C-61.9,17.1,-79.3,8.6,-79.2,0C-79.2,-8.5,-61.7,-17,-53.4,-30.5C-45,-43.9,-45.8,-62.2,-38.4,-72.4C-31,-82.5,-15.5,-84.3,0,-84.3C15.5,-84.3,30.9,-82.3,38.7,-72.5Z"
              transform="translate(100 100)"
            />
          </svg>

          <StaticImage
            src="../images/vor.png"
            className="md:-ml-2 flex-3"
            alt={i18n._(t`Teacher dashboard for managing observations data`)}
            layout="constrained"
            width={900}
            formats={["auto", "webp", "avif"]}
            placeholder="blurred"
          />

          <div className="px-5 mt-5 flex-2">
            <p className="font-bold text-lg text-green-700 mb-5 font-body">
              <Trans>Digital record keeping</Trans>
            </p>
            <div className="prose prose-lg pr-6 max-w-xl">
              <h2>
                <Trans>Simplifying the work that teachers do</Trans>
              </h2>
              <p>
                <Trans>
                  Managing student records using paper and spreadsheets can be
                  messy. Data can easily slip through the cracks.
                </Trans>
              </p>
              <p>
                <Trans>
                  We help simplify teacher&apos;s work by providing{" "}
                  <GreenBold>
                    one simple place for you to keep your student records
                  </GreenBold>{" "}
                  so that your data are accessible for all teachers, and easily
                  shareable to parents.
                </Trans>
              </p>
            </div>
          </div>
        </div>

        <div className="prose md:flex justify-between max-w-full mb-40 px-5">
          <div className="w-full pr-6">
            <h3>
              <Trans>Record Observations</Trans>
            </h3>
            <p>
              <Trans>
                We help you keep your student observation in one place, so its
                available to every teachers, anytime, anywhere.
              </Trans>
            </p>
          </div>

          <div className="w-full pr-6">
            <h3>
              <Trans>Plan student&apos;s lesson</Trans>
            </h3>
            <p>
              <Trans>
                Plan your student&apos;s lesson ahead of time, and share them
                with other teachers, and even with parents.
              </Trans>
            </p>
          </div>

          <div className="w-full pr-6">
            <h3>
              <Trans>Track student&apos;s curriculum progress</Trans>
            </h3>
            <p>
              <Trans>
                Easily keep track of your student&apos;s progress through your
                curriculum in one place, making building reports easier.
              </Trans>
            </p>
          </div>

          <div className="w-full">
            <h3>
              <Trans>Built with speed and simplicity in mind</Trans>
            </h3>
            <p>
              <Trans>
                We focus on keeping Obserfy fast to help you get your job done
                faster, and easy to use even if you are new to Montessori.
              </Trans>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse md:items-start relative lg:mb-0 mb-16 mt-32">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-1/2 -top-16 md:-top-32"
          >
            <path
              fill="#00E399"
              d="M23.8,-40.4C35,-34.8,51,-36.7,56.3,-31.3C61.6,-25.8,56.3,-12.9,52.7,-2.1C49.1,8.7,47.2,17.5,46.7,31.4C46.3,45.3,47.2,64.3,39.7,74.1C32.1,83.9,16.1,84.4,4.8,76C-6.4,67.6,-12.7,50.3,-19.8,40.3C-26.9,30.2,-34.8,27.4,-45.9,21.9C-57,16.4,-71.3,8.2,-71.7,-0.3C-72.2,-8.7,-58.7,-17.4,-52.1,-30.6C-45.4,-43.8,-45.6,-61.5,-38,-69.1C-30.5,-76.8,-15.2,-74.5,-4.4,-66.8C6.3,-59.1,12.7,-46,23.8,-40.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <StaticImage
            src="../images/gaia.png"
            alt={i18n._(
              t`Dashboard for parents to see their child's progress in realtime`
            )}
            layout="constrained"
            width={900}
            formats={["auto", "webp", "avif"]}
            placeholder="blurred"
          />
          <div className="px-5 mt-5">
            <p className="font-bold text-lg text-green-700 mb-5 font-body">
              <Trans>Parent communication</Trans>
            </p>
            <div className="prose prose-lg pr-6 max-w-xl">
              <h2>
                <Trans>
                  Tools for building a more transparent and collaborative
                  schools
                </Trans>
              </h2>
              <p>
                <Trans>
                  Collaboration between parents and schools are important,
                  especially in the post-COVID 19 world.
                </Trans>
              </p>
              <p>
                <Trans>
                  We help you empower parents, providing custom dashboard for
                  them to access and making it{" "}
                  <GreenBold>
                    easy to share your data and collaborate with parents on
                    their child&apos;s education.
                  </GreenBold>
                </Trans>
              </p>
            </div>
          </div>
        </div>

        <div className="prose md:flex justify-between max-w-full px-4 mb-24">
          <div className="w-full pr-6">
            <h3>
              <Trans>Share curriculum progress with parents</Trans>
            </h3>
            <p>
              <Trans>
                Let parents see and keep track of their child&apos;s progress
                through your school&apos;s curriculum in realtime.
              </Trans>
            </p>
          </div>

          <div className="w-full pr-6">
            <h3>
              <Trans>Share lesson plans</Trans>
            </h3>
            <p>
              <Trans>
                Share lesson plans/tasks that parents can execute at home, along
                with some resources to guide them.
              </Trans>
            </p>
          </div>

          <div className="w-full pr-6">
            <h3>
              <Trans>Collaborate on Observations</Trans>
            </h3>
            <p>
              <Trans>
                Allow parents to post observations at home about their
                children&apos;s task, and see observations that teachers had
                created.
              </Trans>
            </p>
          </div>

          <div className="w-full">
            <h3>
              <Trans>Share photos</Trans>
            </h3>
            <p>
              <Trans>
                Easily share photos of your students with their parents, and
                allow parents to post photos of their children doing tasks
                assigned to them outside of school.
              </Trans>
            </p>
          </div>
        </div>
      </div>
      <div className="px-3">
        <div
          className="
              border border-green-600
              rounded-3xl w-full
              py-8
              px-4
              flex flex-col items-center
              bg-primary
              bg-cover
              bg-center
              shadow-lg
              relative
              overflow-hidden
            "
        >
          <img
            alt="decoration"
            src={WaveyBg}
            className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
          />
          <div className="prose prose-lg mb-6 relative">
            <h2 className="text-center text-black mb-2">
              <Trans>Try it now</Trans>
            </h2>
            <p className="text-center text-black">
              <Trans>Give it a try now with a 30-days free trial</Trans>
            </p>
          </div>
          <a href="https://app.obserfy.com/register" className="block relative">
            <Button secondary className="border-green-600">
              <Trans>Try for Free</Trans>
            </Button>
          </a>
        </div>
      </div>
    </Layout>
  )
}

const GreenBold: FC = ({ children }) => (
  <b className="text-green-700">{children}</b>
)

export default IndexPage
