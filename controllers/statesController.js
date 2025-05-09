const State = require('../models/States');
const statesData = require('../models/statesData.json');

const getAllStates = async (req, res) => {
    const contig = req.query.contig;
    let states = statesData;

    if (contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const statesWithFunFacts = await Promise.all(states.map(async state => {
        const stateInDb = await State.findOne({ stateCode: state.code });
        return {
            ...state,
            funfacts: stateInDb ? stateInDb.funfacts : []
        };
    }));

    res.json(statesWithFunFacts);
};

const getState = async (req, res) => {
    const state = statesData.find(state => state.code === req.code);
    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }
    const stateInDb = await State.findOne({ stateCode: req.code });
    const response = { ...state }; 
    if (stateInDb && stateInDb.funfacts.length > 0) {
        response.funfacts = stateInDb.funfacts; 
    }
    res.json(response);
};



const getFunFact = async (req, res) => {
    const stateInDb = await State.findOne({ stateCode: req.code });
    const state = statesData.find(state => state.code === req.code);
    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }
    if (stateInDb && stateInDb.funfacts && stateInDb.funfacts.length > 0) {
        const randomFunFact = stateInDb.funfacts[Math.floor(Math.random() * stateInDb.funfacts.length)];
        res.json({ funfact: randomFunFact });
    } else {
        res.json({ message: `No Fun Facts found for ${state.state}` }); 
    }
};


const createFunFact = async (req, res) => {
    const { funfacts } = req.body;
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    let stateInDb = await State.findOne({ stateCode: req.code });
    if (stateInDb) {
        stateInDb.funfacts.push(...funfacts);
    } else {
        stateInDb = new State({
            stateCode: req.code,
            funfacts: funfacts
        });
    }
    await stateInDb.save();
    res.json(stateInDb);
};

const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const stateInDb = await State.findOne({ stateCode: req.code });
    const state = statesData.find(state => state.code === req.code);

    // Validate index
    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    // Validate funfact
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    // Check if state exists in statesData.json
    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Check if fun facts exist
    if (!stateInDb || !stateInDb.funfacts || stateInDb.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }

    // Check if index is valid
    if (index < 1 || index > stateInDb.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }

    // Update fun fact
    stateInDb.funfacts[index - 1] = funfact;
    await stateInDb.save();
    res.json(stateInDb);
};


const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const stateInDb = await State.findOne({ stateCode: req.code });
    const state = statesData.find(state => state.code === req.code);

    // Validate index
    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    // Check if state exists in statesData.json
    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Check if fun facts exist
    if (!stateInDb || !stateInDb.funfacts || stateInDb.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }

    // Check if index is valid
    if (index < 1 || index > stateInDb.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }

    // Delete fun fact
    stateInDb.funfacts.splice(index - 1, 1); // Remove the fun fact at the specified index
    await stateInDb.save();
    res.json(stateInDb);
};


const getCapital = (req, res) => {
    const state = statesData.find(state => state.code === req.code);
    res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
    const state = statesData.find(state => state.code === req.code);
    res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
    const state = statesData.find(state => state.code === req.code);
    if (!state) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }
    const population = state.population.toLocaleString('en-US'); 
    res.json({ state: state.state, population }); 
};



const getAdmission = (req, res) => {
    const state = statesData.find(state => state.code === req.code);
    res.json({ state: state.state, admitted: state.admission_date });
};

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    createFunFact,
    updateFunFact,
    deleteFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
};
