/// <reference types="cypress" />
// Auth0 login flow for gaia
import { Auth0UserProfile } from "auth0-js"

const Iron = require("@hapi/iron")
const auth0 = require("auth0-js")

const auth = new auth0.WebAuth({
  domain: Cypress.env("AUTH0_DOMAIN"),
  clientID: Cypress.env("AUTH0_CLIENT_ID"),
})

export const loginTestUser = () => {
  return new Cypress.Promise((resolve, reject) => {
    auth.client.loginWithDefaultDirectory(
      {
        username: Cypress.env("GAIA_USERNAME"),
        password: Cypress.env("GAIA_PASSWORD"),
        audience: `https://${Cypress.env("AUTH0_DOMAIN")}/api/v2/`,
        scope: "openid profile email",
        client_secret: Cypress.env("AUTH0_CLIENT_SECRET"),
      },
      (err: Error, response: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      }
    )
  })
}

export const getUserInfo = (accessToken: string) => {
  return new Cypress.Promise<Auth0UserProfile>((resolve, reject) => {
    auth.client.userInfo(accessToken, (err: Error, user: any) => {
      if (err) {
        reject(err)
      }
      resolve(user)
    })
  })
}

export const seal = (thingToEncrypt: object) => {
  return new Cypress.Promise((resolve, reject) => {
    try {
      Iron.seal(
        thingToEncrypt,
        Cypress.env("AUTH0_COOKIE_SECRET"),
        Iron.defaults
      ).then((encryptedThing: string) => {
        resolve(encryptedThing)
      })
    } catch (error) {
      reject(error)
    }
  })
}
