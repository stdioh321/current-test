import Chance from "chance";
const chance = new Chance();

export const columnsAndLeads = Array.from(
  { length: chance.integer({ min: 2, max: 10 }) },
  (_, i) => ({
    id: chance.guid(),
    title: chance.name(),
    leads: Array.from(
      { length: chance.integer({ min: 2, max: 4 }) },
      (_, index) => ({
        id: chance.guid(),
        title: `${index} ${chance.name()}`,
        uniqueValue: chance.floating({ min: 1, max: 100 }),
      })
    ),
  })
);
