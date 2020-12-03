import React, { FC } from "react"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { t, Trans } from "@lingui/macro"
import { StaticImage } from "gatsby-plugin-image"
import { useLingui } from "@lingui/react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/Button/Button"

const IndexPage: FC = () => {
  const { i18n } = useLingui()

  return (
    <Layout>
      <SEO
        title={t`Record Keeping & Communication tool for Montessori Schools`}
      />
      <div className="justify-center pt-8 md:pt-16">
        <div className="md:flex flex-row-reverse items-center mb-32">
          <div className="w-full bg-cover bg-center mb-4 md:mb-0">
            <StaticImage
              src="../images/hero.png"
              className="w-full"
              alt={i18n._(t`Montessori record keeping on phone and laptop`)}
              transformOptions={{ fit: "cover" }}
              blurredOptions={{}}
              layout="fluid"
              quality={80}
            />
          </div>
          <div className="prose prose-lg md:prose-lg max-w-xl px-4">
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
            className="md:-ml-4 w-full"
            layout="fluid"
            alt={i18n._(t`Teacher dashboard for managing observations data`)}
            transformOptions={{ fit: "cover" }}
            blurredOptions={{}}
            quality={80}
          />
          <div className="px-5 mt-5">
            <p className="font-bold text-lg text-green-700 mb-5">
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
            className="w-full"
            alt={i18n._(
              t`Dashboard for parents to see their child's progress in realtime`
            )}
            transformOptions={{ fit: "cover" }}
            blurredOptions={{}}
            quality={80}
            layout="fluid"
          />
          <div className="px-5 mt-5">
            <p className="font-bold text-lg text-green-700 mb-5">
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
                We help you empower parents, providing custom dashboard for them
                to access and making it{" "}
                <GreenBold>
                  easy to share your data and collaborate with parents on their
                  child&apos;s education.
                </GreenBold>
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
            "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1040%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(0%2c 227%2c 153%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c686.03C124.941%2c668.33%2c210.429%2c560.523%2c312.895%2c486.873C409.329%2c417.559%2c519.787%2c366.675%2c583.626%2c266.533C652.996%2c157.714%2c698.304%2c29.822%2c686.159%2c-98.655C673.741%2c-230.021%2c605.283%2c-349.95%2c516.152%2c-447.249C428.561%2c-542.867%2c318.03%2c-636.136%2c188.488%2c-641.932C63.514%2c-647.523%2c-20.035%2c-512.265%2c-139.943%2c-476.602C-259.187%2c-441.136%2c-412.188%2c-520.808%2c-503.358%2c-436.162C-593.181%2c-352.766%2c-576.448%2c-203.427%2c-565.675%2c-81.332C-556.43%2c23.441%2c-475.744%2c102.938%2c-446.865%2c204.076C-410.717%2c330.668%2c-465.088%2c487.868%2c-375.577%2c584.408C-285.574%2c681.478%2c-131.066%2c704.598%2c0%2c686.03' fill='%2300ba7e'%3e%3c/path%3e%3cpath d='M1440 917.2919999999999C1504.152 901.2180000000001 1536.584 832.518 1590.751 794.5740000000001 1641.922 758.7280000000001 1709.694 749.763 1748.759 701.005 1793.337 645.366 1835.4270000000001 575.13 1822.787 504.964 1810.176 434.957 1732.309 400.83000000000004 1685.099 347.62 1638.587 295.197 1613.864 216.485 1547.323 194.49 1480.535 172.414 1412.519 216.79700000000003 1344.591 235.06799999999998 1274.852 253.82600000000002 1184.6390000000001 243.72899999999998 1143.522 303.1 1101.865 363.252 1147.38 444.942 1148.58 518.1 1149.5529999999999 577.422 1136.834 634.608 1149.908 692.48 1165.554 761.739 1175.2559999999999 841.126 1231.379 884.62 1288.166 928.6279999999999 1370.311 934.754 1440 917.2919999999999' fill='%230dffb0'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1040'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
          }}
        >
          <div className="prose prose-lg mb-6">
            <h2 className="text-center text-black mb-2">
              <Trans>Try it now</Trans>
            </h2>
            <p className="text-center text-black">
              <Trans>Give it a try now with a 30-days free trial</Trans>
            </p>
          </div>
          <a href="https://app.obserfy.com/register" className="block">
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
