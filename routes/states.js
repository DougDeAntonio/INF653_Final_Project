const express = require('express');
const statesController = require('../controllers/statesController');
const verifyStates = require('../middleware/verifyStates');

const router = express.Router();

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyStates, statesController.getState);

router.route('/:state/funfact')
    .get(verifyStates, statesController.getFunFact)
    .post(verifyStates, statesController.createFunFact)
    .patch(verifyStates, statesController.updateFunFact)
    .delete(verifyStates, statesController.deleteFunFact);

router.route('/:state/capital')
    .get(verifyStates, statesController.getCapital);

router.route('/:state/nickname')
    .get(verifyStates, statesController.getNickname);

router.route('/:state/population')
    .get(verifyStates, statesController.getPopulation);

router.route('/:state/admission')
    .get(verifyStates, statesController.getAdmission);

module.exports = router;
