const states = require("../data/states.json");

function isStateEntry(value) {
  return value && typeof value === "object" && typeof value.name === "string";
}

function getAllStates(req, res) {
  const stateList = Object.keys(states)
    .filter((key) => isStateEntry(states[key]))
    .map((key) => ({
      id: key,
      name: states[key].name,
    }));

  res.json(stateList);
}

function getState(req, res) {
  const stateName = decodeURIComponent(req.params.state).toLowerCase();
  const state = states[stateName];

  if (!isStateEntry(state)) {
    return res.status(404).json({ error: "State not found" });
  }

  res.json(state);
}

function getStateCategory(req, res) {
  const stateName = decodeURIComponent(req.params.state).toLowerCase();
  const category = req.params.category.toLowerCase();
  const state = states[stateName];

  if (!isStateEntry(state)) {
    return res.status(404).json({ error: "State not found" });
  }

  if (!Object.prototype.hasOwnProperty.call(state, category)) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.json({
    state: state.name,
    category,
    data: state[category],
  });
}

module.exports = {
  getAllStates,
  getState,
  getStateCategory,
};
