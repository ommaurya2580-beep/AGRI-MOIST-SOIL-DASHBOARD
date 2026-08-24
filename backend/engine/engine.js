const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, 'agronomy_rules.json');
const knowledgeBase = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

function analyzeRootCause(inputData) {
    let results = [];

    knowledgeBase.problems.forEach(problem => {
        let earnedScore = 0;
        let applicableMaxScore = 0; // Dynamic Max Score for Percentage!
        let conflictFound = null;
        let warnings = [];

        // 1. Image AI Evidence
        if (problem.scoring.image_ai) {
            applicableMaxScore += problem.scoring.image_ai.points;
            if (inputData.image_ai && inputData.image_ai.prediction === problem.id) {
                earnedScore += problem.scoring.image_ai.points;
            } else if (inputData.image_ai && inputData.image_ai.prediction === 'Nitrogen_Deficiency' && problem.id === 'nitrogen_deficiency') {
                earnedScore += problem.scoring.image_ai.points; // Mapping adjustment for mock
            } else if (inputData.image_ai && inputData.image_ai.prediction === 'Nitrogen_Deficiency' && problem.id === 'waterlogging') {
                earnedScore += problem.scoring.image_ai.points; // Waterlogging yellow leaf logic
            }
        }

        // 2. IoT Sensor Evidence
        if (problem.scoring.iot_sensor) {
            if (inputData.iot_sensor) {
                applicableMaxScore += problem.scoring.iot_sensor.points;
                // Specific rule checks
                if (inputData.iot_sensor.moisture > 85 && problem.id === 'waterlogging') {
                     earnedScore += problem.scoring.iot_sensor.points;
                }
                if (inputData.iot_sensor.n < 30 && problem.id === 'nitrogen_deficiency') {
                     earnedScore += problem.scoring.iot_sensor.points;
                }
            } else {
                warnings.push("IoT Sensor data is missing. Confidence may be lower.");
            }
        }

        // 3. Weather Evidence
        if (problem.scoring.weather) {
            if (inputData.weather) {
                applicableMaxScore += problem.scoring.weather.points;
                if (inputData.weather.rainfall_past_10d > 50 && problem.id === 'waterlogging') {
                    earnedScore += problem.scoring.weather.points;
                }
                if (inputData.weather.humidity > 80 && problem.id === 'leaf_rust') {
                    earnedScore += problem.scoring.weather.points;
                }
            } else {
                warnings.push("Weather data missing.");
            }
        }

        // 4. History Evidence
        if (problem.scoring.history) {
            if (inputData.history) {
                applicableMaxScore += problem.scoring.history.points;
                if (inputData.history.days_since_n_fertilizer > 30 && problem.id === 'nitrogen_deficiency') {
                    earnedScore += problem.scoring.history.points;
                }
            }
        }

        // --- Calculate Dynamic Percentage ---
        let finalPercentage = 0;
        if (applicableMaxScore > 0) {
            finalPercentage = Math.round((earnedScore / applicableMaxScore) * 100);
        }

        // --- Check Conflicts ---
        problem.conflicts.forEach(conflict => {
            if (inputData.iot_sensor && inputData.iot_sensor.moisture > 85 && conflict.condition.includes('moisture > 85')) {
                conflictFound = conflict;
            }
        });

        results.push({
            problemId: problem.id,
            problemName: problem.name,
            matchPercentage: `${finalPercentage}%`, // This is the dynamic % they asked for!
            rawScore: `${earnedScore} / ${applicableMaxScore}`,
            warnings: warnings.length > 0 ? warnings : null,
            conflict: conflictFound
        });
    });

    results.sort((a, b) => parseInt(b.matchPercentage) - parseInt(a.matchPercentage));
    return results;
}

// ==========================================
// TEST: MISSING IOT SENSOR DATA!
// ==========================================
const mockFarmerInputWithoutIoT = {
    history: { days_since_n_fertilizer: 40 },    // Didn't add fertilizer
    weather: { rainfall_past_10d: 0 },           // No rain
    iot_sensor: null,                            // OOPS! SENSOR BROKEN OR OFFLINE
    image_ai: { prediction: 'Nitrogen_Deficiency' } // Leaves are yellow
};

console.log("--- RUNNING ENGINE WITHOUT IOT DATA ---");
const diagnosis = analyzeRootCause(mockFarmerInputWithoutIoT);
console.log(JSON.stringify(diagnosis, null, 2));

module.exports = { analyzeRootCause };
