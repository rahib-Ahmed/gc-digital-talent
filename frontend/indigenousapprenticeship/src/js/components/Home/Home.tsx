import React from "react";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { imageUrl } from "@common/helpers/router";

import Banner from "../Banner/Banner";
import Card from "../Card/Card";
import Heading from "../Heading/Heading";
import Step from "../Step/Step";
import Quote from "../Quote/Quote";

import BarChart from "../Svg/BarChart";
import Calendar from "../Svg/Calendar";
import People from "../Svg/People";
import RadiatingCircles from "../Svg/RadiatingCircles";
import ThickCircle from "../Svg/ThickCircle";
import TrendingUp from "../Svg/TrendingUp";
import Triangle from "../Svg/Triangle";

import useQuote from "../../hooks/useQuote";
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../../indigenousApprenticeshipConstants";
import CTAButtons from "../CallToAction/CTAButtons";

const Home: React.FunctionComponent = () => {
  const intl = useIntl();
  const quote = useQuote();
  return (
    <div data-h2-overflow="b(x, hidden)">
      <div
        className="hero"
        data-h2-position="b(relative)"
        data-h2-overflow="b(all, hidden)"
      >
        <div
          className="hero__content"
          data-h2-position="b(absolute)"
          data-h2-width="b(100)"
        >
          <div data-h2-container="b(center, full)">
            <div
              data-h2-padding="b(all, s) s(all, l)"
              data-h2-display="b(flex)"
              data-h2-flex-direction="b(column)"
              data-h2-align-items="b(center)"
              data-h2-justify-content="b(space-between)"
            >
              <div className="hero__logo" data-h2-width="m(50)">
                <h1 data-h2-margin="b(top, xs)">
                  <img
                    data-h2-width="b(100)"
                    src={imageUrl(
                      INDIGENOUSAPPRENTICESHIP_APP_DIR,
                      "logo-en-lg.png",
                    )}
                    alt={intl.formatMessage({
                      defaultMessage:
                        "IT Apprenticeship Program for Indigenous Peoples",
                      description:
                        "Homepage title for Indigenous Apprenticeship Program",
                    })}
                  />
                </h1>
              </div>
              <div
                className="hero__apply"
                data-h2-display="b(flex)"
                data-h2-justify-content="b(center)"
                data-h2-width="m(25)"
              >
                <Button color="ia-primary" mode="solid" block>
                  {intl.formatMessage({
                    defaultMessage: "Apply Now",
                    description: "Button text to apply for program",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <img
          className="hero__image"
          src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "hero.jpg")}
          alt=""
          data-h2-position="b(relative)"
        />
      </div>
      <div
        className="about-program"
        data-h2-container="m(center, m)"
        data-h2-margin="m(bottom, xxl)"
        data-h2-padding="b(all, l)"
        data-h2-position="b(relative)"
        data-h2-bg-color="b(white)"
        data-h2-radius="b(s)"
      >
        <div data-h2-display="m(flex)" data-h2-align-items="m(flex-start))">
          <div
            className="program__image-wrapper"
            data-h2-position="b(relative)"
            data-h2-padding="m(left, l) m(right, xxl)"
          >
            <img
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                "indigenous-woman-smiling.jpg",
              )}
              className="program__image"
              alt=""
              data-h2-margin="b(top, xxs)"
              data-h2-position="b(relative)"
              data-h2-radius="b(s)"
              data-h2-shadow="b(xs)"
            />
            <div
              className="circle circle--top-right"
              data-h2-position="b(absolute)"
              data-h2-bg-color="b(ia-pink)"
            />
            <div
              className="circle circle--lg circle--bottom-left"
              data-h2-position="b(absolute)"
              data-h2-bg-color="b(ia-purple)"
            />
            <img
              src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "feathers.png")}
              className="about-program__feathers"
              alt=""
              data-h2-position="b(absolute)"
            />
          </div>
          <div>
            <Heading className="about-program__title">
              {intl.formatMessage({
                defaultMessage: "About the Program",
                description: "Program information section title",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The IT Apprenticeship Program for Indigenous Peoples is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT).",
                description: "First paragraph about the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the Program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The Program has been developed by, with, and for Indigenous peoples from across Canada.  Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                description: "Second paragraph about the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Apprentices who are involved in the program say that it is “life-changing”, that it represents “a chance to have a better life through technology”, and that “there are no barriers to succeeding in this program”.",
                description: "Third paragraph about the program",
              })}
            </p>
            <div data-h2-visibility="b(invisible) m(visible)">
              <CTAButtons />
            </div>
          </div>
        </div>
      </div>
      <div
        className="learn-program"
        data-h2-container="m(center, m)"
        data-h2-margin="m(top-bottom, xxl)"
        data-h2-padding="b(all, l)"
        data-h2-position="b(relative)"
        data-h2-bg-color="b(white)"
        data-h2-radius="b(s)"
      >
        <div data-h2-display="m(flex)">
          <div
            className="learn-program__content"
            data-h2-position="b(relative)"
          >
            <Heading
              data-h2-margin="b(top, xxs)"
              className="learn-program__title"
            >
              {intl.formatMessage({
                defaultMessage: "What will I learn in this apprenticeship?",
                description: "What applicants will learn sections heading",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Apprentices follow a 24-month structured program consisting of a mix of on-the-job learning and formal training.",
                description:
                  "First paragraph what will you learn at the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "They are partnered with a peer to facilitate job shadowing and supervised work, and they are assigned a mentor who provides experienced counsel and guidance over the course of the program.",
                description:
                  "First paragraph what will you learn at the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "At the end of their 24-month term, apprentices will have marketable and in-demand certifications and skills, as well as the confidence necessary to contribute as part of Canada’s digital workforce, both within and outside the federal public service.",
                description:
                  "First paragraph what will you learn at the program",
              })}
            </p>
            <div data-h2-visibility="b(visible) m(invisible)">
              <CTAButtons />
            </div>
          </div>
          <div
            className="program__image-wrapper"
            data-h2-position="b(relative)"
            data-h2-padding="m(right-left, m)"
          >
            <img
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                "man-on-computer.jpg",
              )}
              className="program__image"
              alt=""
              data-h2-position="b(relative)"
            />
            <img
              src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "gloves.png")}
              className="learn-program__gloves"
              alt=""
              data-h2-position="b(absolute)"
              data-h2-width="b(100)"
            />
            <RadiatingCircles
              className="learn-program__circles"
              data-h2-font-color="b(ia-lightgray)"
              data-h2-position="b(absolute)"
              data-h2-width="b(100)"
            />
          </div>
        </div>
      </div>
      <div
        className="who-program"
        data-h2-container="m(center, m)"
        data-h2-margin="m(top-bottom, xxl)"
        data-h2-padding="b(all, l)"
        data-h2-position="b(relative)"
        data-h2-bg-color="b(white)"
        data-h2-radius="b(s)"
      >
        <div data-h2-display="m(flex)">
          <div
            className="program__image-wrapper"
            data-h2-position="b(relative)"
            data-h2-padding="b(right-left, m)"
          >
            <img
              src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "applicant.jpg")}
              className="program__image"
              data-h2-position="b(relative)"
              alt=""
            />
            <Triangle
              className="who-program__triangle"
              data-h2-position="b(absolute)"
              data-h2-width="b(100)"
              data-h2-font-color="b(ia-purple)"
            />
          </div>
          <div>
            <Heading className="about-program__title">
              {intl.formatMessage({
                defaultMessage: "Who is the program for?",
                description: "Heading for section about who the program is for",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The Program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Metis, and if you have a passion for technology, then this Program is for you!",
                description: "First paragraph about who the program is for",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If you are not sure if this Program is right for you, please contact us and a member of our team will be happy to meet with you to answer any questions you may have”.",
                description: "Second paragraph about who the program is for",
              })}
            </p>
            <div data-h2-display="m(flex)">
              <div
                data-h2-width="m(50)"
                data-h2-margin="b(bottom, m) m(right, s)"
              >
                <Button color="ia-primary" mode="solid" block>
                  {intl.formatMessage({
                    defaultMessage: "See Eligibility Criteria",
                    description: "Button text for program eligibility criteria",
                  })}
                </Button>
              </div>
              <div
                data-h2-position="b(relative)"
                data-h2-width="m(50)"
                data-h2-margin="b(bottom, m) m(right, s)"
              >
                <img
                  src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "ulu.png")}
                  className="who-program__ulu"
                  alt=""
                  data-h2-position="b(absolute)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="quote-wrapper"
        data-h2-padding="b(top-bottom, xl)"
        style={{
          backgroundImage: `url(${imageUrl(
            INDIGENOUSAPPRENTICESHIP_APP_DIR,
            "quote-bg.jpg",
          )})`,
        }}
      >
        <div data-h2-container="b(center, m)">
          <Heading
            light
            data-h2-font-color="b(white)"
            data-h2-text-align="b(center)"
          >
            {intl.formatMessage({
              defaultMessage: "What We’re Hearing",
              description: "Heading for the quotes sections",
            })}
          </Heading>
          <Quote {...quote} />
        </div>
      </div>
      <div
        className="apply-program"
        data-h2-padding="b(top-bottom, xxl)"
        style={{
          backgroundImage: `url(${imageUrl(
            INDIGENOUSAPPRENTICESHIP_APP_DIR,
            "apply-bg.jpg",
          )})`,
        }}
      >
        <div data-h2-container="b(center, m)">
          <div
            className="apply-program__box"
            data-h2-bg-color="b(ia-lightpurple)"
            data-h2-font-color="b(ia-white)"
            data-h2-shadow="b(m)"
          >
            <div
              className="apply-program__box__image"
              style={{
                backgroundImage: `url(${imageUrl(
                  INDIGENOUSAPPRENTICESHIP_APP_DIR,
                  "lower-back.jpg",
                )})`,
              }}
            />
            <div
              className="apply-program__box__text"
              data-h2-padding="b(all, m) m(left, xxl) m(right, l)"
            >
              <Heading
                light
                data-h2-display="b(flex)"
                data-h2-flex-direction="b(column)"
                data-h2-margin="b(top, xxs)"
                data-h2-font-color="b(ia-white)"
                data-h2-font-size="b(h3)"
              >
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "Is the IT Apprenticeship Program right for you?",
                    description: "Application box heading part one",
                  })}
                </span>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Apply today!",
                    description: "Application box heading part two",
                  })}
                </span>
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Apply today to start your journey to a career in Information Technology.",
                  description: "Application box content",
                })}
              </p>
              <Button color="ia-primary" mode="solid">
                {intl.formatMessage({
                  defaultMessage: "Apply Now",
                  description: "Button text to apply for program",
                })}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="portal-panel"
        data-h2-bg-color="b(ia-purple)"
        data-h2-font-color="b(ia-white)"
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, xl)"
      >
        <div
          className="portal-panel__inner"
          data-h2-container="b(center, m)"
          data-h2-position="b(relative)"
        >
          <div
            className="portal-panel__banner-wrapper"
            data-h2-display="b(flex)"
            data-h2-justify-content="b(center)"
          >
            <Banner>
              <Heading
                color="white"
                data-h2-margin="b(top-bottom, xxs)"
                data-h2-font-size="b(h3)"
              >
                {intl.formatMessage({
                  defaultMessage: "Coming Soon!",
                  description: "Heading for a coming soon section",
                })}
              </Heading>
            </Banner>
          </div>
          <div data-h2-text-align="b(center)">
            <Heading light color="white" data-h2-margin="b(top, xxs)">
              {intl.formatMessage({
                defaultMessage:
                  "IT Apprenticeship Program for Indigenous Peoples + The Indigenous Talent Portal",
                description: "heading for indigenous talent portal section",
              })}
            </Heading>
            <div
              data-h2-container="b(center, s)"
              data-h2-margin="b(top-bottom, xl)"
            >
              <Heading as="h3" color="white">
                {intl.formatMessage({
                  defaultMessage: "How it Will Work",
                  description:
                    "heading for how the indigenous talent portal will work",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Soon, applicants will be able to apply using an online, interactive tool that will be available on this website. Here’s what we’re working on:",
                  description:
                    "Description of how the indigenous talent portal will work",
                })}
              </p>
            </div>
            <div
              data-h2-display="m(flex)"
              data-h2-margin="b(top-bottom, xl)"
              className="portal-panel__steps"
            >
              <div className="portal-panel__step">
                <Step
                  position="1"
                  title={intl.formatMessage({
                    defaultMessage: "Self-Identify",
                    description: "How it works, step 1 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Applicants are asked to self-Identify via the Honesty Pledge which was designed by the Indigenous community.",
                      description: "How it works, step 1 content",
                    })}
                  </p>
                </Step>
              </div>
              <div className="portal-panel__step">
                <Step
                  position="2"
                  title={intl.formatMessage({
                    defaultMessage: "Provide your Information",
                    description: "How it works, step 2 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "We want to learn about you and about your interest/passion in the area of IT!",
                      description: "How it works, step 2 content sentence 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "We’ll invite you to create a profile which will be saved and submitted as your actual application.",
                      description: "How it works, step 2 content sentence 2",
                    })}
                  </p>
                </Step>
              </div>
              <div className="portal-panel__step">
                <Step
                  position="3"
                  title={intl.formatMessage({
                    defaultMessage: "Submit your Profile as your Application",
                    description: "How it works, step 3 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You'll be prompted to confirm the information you provided",
                      description: "How it works, step 3 content sentence 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Upon submission, a team member will contact you within 3-5 business days.",
                      description: "How it works, step 3 content sentence 2",
                    })}
                  </p>
                </Step>
              </div>
            </div>
            <div
              data-h2-container="b(center, s)"
              data-h2-margin="b(top-bottom, xl)"
            >
              <Heading as="h3" color="white">
                {intl.formatMessage({
                  defaultMessage: "Strategy",
                  description:
                    "Heading for strategy for the indigenous talent portal",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "In collaboration with the IT Apprenticeship Program for Indigenous Peoples, the Indigenous Talent Portal will begin with a focus on IT and technology talent, which will:",
                  description:
                    "Description for strategy for the indigenous talent portal",
                })}
              </p>
            </div>
            <div
              data-h2-display="m(flex)"
              data-h2-margin="b(top-bottom, xl)"
              className="portal-panel__strategy"
            >
              <div
                className="portal-panel__strategy__item"
                data-h2-width="b(100) s(50) m(25)"
              >
                <Card
                  Icon={People}
                  title={intl.formatMessage({
                    defaultMessage: "High Demand",
                    description: "Talent portal strategy item 1 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Address the great demand for Indigenous talent in IT.",
                      description: "Talent portal strategy item 1 content",
                    })}
                  </p>
                </Card>
              </div>
              <div
                className="portal-panel__strategy__item"
                data-h2-width="b(100) s(50) m(25)"
              >
                <Card
                  Icon={TrendingUp}
                  title={intl.formatMessage({
                    defaultMessage: "Grow",
                    description: "Talent portal strategy item 2 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Allow for growth in its recruitment scope by targeting other occupational areas in the future.",
                      description: "Talent portal strategy item 2 content",
                    })}
                  </p>
                </Card>
              </div>
              <div
                className="portal-panel__strategy__item"
                data-h2-width="b(100) s(50) m(25)"
              >
                <Card
                  Icon={BarChart}
                  title={intl.formatMessage({
                    defaultMessage: "Assess",
                    description: "Talent portal strategy item 3 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Allow for data and feedback to be collected and leveraged to improve the service.",
                      description: "Talent portal strategy item 3 content",
                    })}
                  </p>
                </Card>
              </div>
              <div
                className="portal-panel__strategy__item"
                data-h2-width="b(100) s(50) m(25)"
              >
                <Card
                  Icon={Calendar}
                  title={intl.formatMessage({
                    defaultMessage: "Launch",
                    description: "Talent portal strategy item 4 heading",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Aim to launch the program in the early half of 2022.",
                      description: "Talent portal strategy item 4 content",
                    })}
                  </p>
                </Card>
              </div>
            </div>
          </div>
          <div
            className="talent-portal-wrapper"
            data-h2-position="b(relative)"
            data-h2-margin="b(top, xxl)"
          >
            <div
              className="talent-portal-card"
              data-h2-position="b(relative)"
              data-h2-margin="b(top-bottom, l)"
              data-h2-bg-color="b(ia-lightpurple)"
              data-h2-font-color="b(ia-white)"
              style={{
                backgroundImage: `url(${imageUrl(
                  INDIGENOUSAPPRENTICESHIP_APP_DIR,
                  "iap-logo-watermark.png",
                )})`,
              }}
            >
              <div data-h2-display="m(flex)">
                <div
                  className="talent-portal-card__content"
                  data-h2-padding="b(all, l)"
                >
                  <Heading color="white" light data-h2-margin="b(top, xxs)">
                    {intl.formatMessage({
                      defaultMessage: "About the Indigenous Talent Portal",
                      description: "Talent Portal information heading",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Indigenous Talent Portal was built for the Indigenous community, by the Indigenous community.",
                      description: "Talent portal information sentence 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "It is a platform designed to host employment opportunities for Indigenous peoples in a way that recognizes and showcases their unique talents, ideas, skills and passion.",
                      description: "Talent portal information sentence 2",
                    })}
                  </p>
                </div>
                <img
                  className="talent-portal-card__image"
                  src={imageUrl(
                    INDIGENOUSAPPRENTICESHIP_APP_DIR,
                    "indigenous-woman.png",
                  )}
                  alt=""
                />
              </div>
            </div>
            <Triangle
              className="talent-portal__triangle"
              data-h2-position="b(absolute)"
              data-h2-width="b(75)"
              data-h2-font-color="b(ia-lightpurple)"
            />
          </div>
        </div>
        <RadiatingCircles
          className="portal-panel__bg-item portal-panel__circles"
          data-h2-font-color="b(ia-pink)"
          data-h2-position="b(absolute)"
          data-h2-width="b(50)"
        />
        <ThickCircle
          className="portal-panel__bg-item portal-panel__thick-circle"
          data-h2-position="b(absolute)"
        />
      </div>
    </div>
  );
};

export default Home;
