import { Map } from "immutable";

// Currencies
const experience = {id: "experience", icon: "⭐", name: "EXPERIENCE"};
const gold = {id: "gold", icon: "💰", name: "GOLD"};
const fire = {id: "fire", icon: "🔥", name: "FIRE"};
const water = {id: "water", icon: "🌊", name: "WATER"};
const earth = {id: "earth", icon: "🌱", name: "EARTH"};
const air = {id: "air", icon: "🌪", name: "AIR"};
const soul = {id: "soul", icon: "🌌", name: "SOUL"};
const elements = [fire, water, earth, air]
const startCurrencies = [experience, gold]
const currencies = [experience, gold, fire, water, earth, air]
const allCurrencies = [experience, gold, fire, water, earth, air, soul]

const currencyById = (id) => {
  switch (id) {
    case fire.id:
      return fire
    case water.id:
      return water
    case earth.id:
      return earth
    case air.id:
      return air
    case experience.id:
      return experience
    case gold.id:
      return gold
  }
}

module.exports = {
  experience,
  gold,
  elements,
  currencies,
  fire,
  water,
  earth,
  air,
  soul,
  allCurrencies,
  startCurrencies,
  currencyById
}

export default currencyById;