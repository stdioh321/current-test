import Chance from "chance";
const chance = new Chance();

export const columnsAndLeads = Array.from(
  { length: chance.integer({ min: 2, max: 5 }) },
  (_, i) => ({
    id: chance.guid(),
    title: chance.name(),
    leads: Array.from({ length: chance.integer({ min: 2, max: 4 }) }, () => ({
      id: chance.guid(),
      // title: chance.sentence({ words: 3 }),
      title: chance.age({ min: 18, max: 65 }),
      uniqueValue: chance.floating({ min: 1, max: 100 }),
    })),
  })
);
