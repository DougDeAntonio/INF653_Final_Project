const statesData = require('../models/statesData.json');

const stateCodes = statesData.map(state => state.code);

const verifyStates = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    if (stateCodes.includes(stateCode)) {
        req.code = stateCode;
        next();
    } else {
        res.status(404).json({ error: 'Invalid state abbreviation parameter' });
    }
};

module.exports = verifyStates;
