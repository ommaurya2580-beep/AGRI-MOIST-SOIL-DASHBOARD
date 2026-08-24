/**
 * Root Cause Engine (AgriPulse)
 * This engine takes aggregated data from History, Weather, Sensors, and Vision Models,
 * and calculates point-based probabilities for various agricultural issues.
 */

const DIAGNOSES = {
  WATER_STRESS_DROUGHT: 'Drought / Water Stress',
  WATER_STRESS_OVERWATER: 'Overwatering / Root Rot Risk',
  NUTRIENT_DEFICIENCY_N: 'Nitrogen Deficiency',
  FUNGAL_DISEASE_RUST: 'Leaf Rust (Fungal)',
  PEST_ATTACK_GENERAL: 'Pest Infestation',
  HEALTHY: 'Healthy / Optimal'
};

export class RootCauseEngine {
  constructor(payload) {
    this.data = payload;
    
    // Normalize data structure in case some steps were skipped
    this.history = this.data.history || {};
    this.weather = this.data.weather || { metrics: {} };
    this.sensors = this.data.sensors || {};
    this.vision = this.data.vision || [];
    
    // Initialize scores
    this.scores = {
      [DIAGNOSES.WATER_STRESS_DROUGHT]: 0,
      [DIAGNOSES.WATER_STRESS_OVERWATER]: 0,
      [DIAGNOSES.NUTRIENT_DEFICIENCY_N]: 0,
      [DIAGNOSES.FUNGAL_DISEASE_RUST]: 0,
      [DIAGNOSES.PEST_ATTACK_GENERAL]: 0,
      [DIAGNOSES.HEALTHY]: 20 // Base score for healthy
    };

    this.evidence = {
      [DIAGNOSES.WATER_STRESS_DROUGHT]: [],
      [DIAGNOSES.WATER_STRESS_OVERWATER]: [],
      [DIAGNOSES.NUTRIENT_DEFICIENCY_N]: [],
      [DIAGNOSES.FUNGAL_DISEASE_RUST]: [],
      [DIAGNOSES.PEST_ATTACK_GENERAL]: [],
      [DIAGNOSES.HEALTHY]: []
    };
  }

  // --- RULE 1: SENSOR RULES ---
  evaluateSensors() {
    const moisture = this.sensors.moisture;
    
    if (moisture !== undefined) {
      // Auto-detect if value is analog (0-1023) or percentage (0-100)
      const isAnalog = moisture > 100;
      
      let isDry = false;
      let isWet = false;

      if (isAnalog) {
        // Assume inverted analog: >600 is dry, <300 is wet
        isDry = moisture > 600;
        isWet = moisture < 300;
      } else {
        // Assume percentage: <30% is dry, >80% is wet
        isDry = moisture < 30;
        isWet = moisture > 80;
      }

      if (isDry) {
        this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 40, `Soil moisture is critically low (${moisture})`);
        this.addScore(DIAGNOSES.HEALTHY, -20, 'Soil is too dry');
      } else if (isWet) {
        this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 40, `Soil is waterlogged (${moisture})`);
        this.addScore(DIAGNOSES.HEALTHY, -20, 'Soil is waterlogged');
      } else {
        this.addScore(DIAGNOSES.HEALTHY, 20, 'Soil moisture is optimal');
      }
    }
  }

  // --- RULE 2: WEATHER RULES ---
  evaluateWeather() {
    const rain = this.weather.metrics.rainfall_sum || 0;
    const tempMax = this.weather.metrics.temperature_max || 25;
    const humidity = this.weather.metrics.humidity_mean || 50;

    // Drought conditions
    if (rain < 10 && tempMax > 32) {
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 25, 'High temperatures with virtually no recent rainfall');
    }

    // Fungal conditions (High humidity + moderate/high temp)
    if (humidity > 75 && tempMax > 20 && tempMax < 35) {
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 30, `Weather conditions (Humidity: ${humidity.toFixed(0)}%) heavily favor fungal growth`);
    }
    
    // Overwatering conditions
    if (rain > 50) {
      this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 20, `Heavy recent rainfall (${rain}mm) increases flooding risk`);
    }
  }

  // --- RULE 3: HISTORY RULES ---
  evaluateHistory() {
    const obs = this.history.visual_signs || [];
    const recentAction = this.history.recent_action || '';
    
    if (obs.includes('yellowing_leaves')) {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 35, 'Farmer observed yellowing leaves (Chlorosis)');
      this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 15, 'Yellowing leaves can indicate root rot from overwatering');
    }
    
    if (obs.includes('wilting')) {
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 30, 'Farmer observed wilting');
    }

    if (obs.includes('spots_on_leaves')) {
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 20, 'Farmer observed spots on leaves');
    }

    if (obs.includes('insects_visible') || obs.includes('holes_in_leaves')) {
      this.addScore(DIAGNOSES.PEST_ATTACK_GENERAL, 40, 'Farmer visually confirmed pests or leaf damage');
    }
  }

  // --- RULE 4: VISION AI RULES ---
  evaluateVision() {
    if (this.vision.length === 0) return;

    let pestDetected = false;
    let diseaseDetected = false;
    let healthyCount = 0;

    this.vision.forEach((imgData, idx) => {
      // Model 1 (Disease)
      if (imgData.disease && imgData.disease.label) {
        const label = imgData.disease.label.toLowerCase();
        const conf = parseFloat(imgData.disease.confidence || 0) * 100; // Normalize to 0-100

        if (label.includes('rust') || label.includes('blight') || label.includes('spot')) {
          this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 40 * (conf/100), `Disease AI detected ${imgData.disease.label} (Conf: ${conf.toFixed(0)}%) in Image ${idx+1}`);
          diseaseDetected = true;
        } else if (label.includes('healthy') && conf > 70) {
          healthyCount++;
        }
      }

      // Model 2 (Pest Radar)
      if (imgData.pest && imgData.pest.detections && imgData.pest.detections.length > 0) {
        const pestsFound = imgData.pest.detections.map(d => d.class_name).join(', ');
        const maxConf = Math.max(...imgData.pest.detections.map(d => d.confidence)) * 100;
        
        this.addScore(DIAGNOSES.PEST_ATTACK_GENERAL, 50 * (maxConf/100), `Pest AI detected ${pestsFound} in Image ${idx+1}`);
        pestDetected = true;
      } else if (imgData.pest && imgData.pest.label === 'No pests detected') {
        healthyCount++;
      }
    });

    if (!diseaseDetected && !pestDetected && healthyCount > 0) {
      this.addScore(DIAGNOSES.HEALTHY, 30, 'AI models confirmed images appear visually healthy');
    }
  }

  // --- HELPER: ADD SCORE ---
  addScore(diagnosis, points, reason) {
    if (this.scores[diagnosis] !== undefined) {
      this.scores[diagnosis] += points;
      this.evidence[diagnosis].push(reason);
    }
  }

  // --- COMPUTE FINAL PROBABILITIES ---
  compute() {
    // Run all rules
    this.evaluateSensors();
    this.evaluateWeather();
    this.evaluateHistory();
    this.evaluateVision();

    // Cap scores between 0 and 100 to represent a percentage "likelihood"
    const finalResults = [];
    
    for (const [diagnosis, score] of Object.entries(this.scores)) {
      let probability = Math.max(0, Math.min(100, Math.round(score)));
      
      // If healthy is the highest, suppress everything else.
      // If a disease is highly probable, healthy drops to 0.
      if (diagnosis === DIAGNOSES.HEALTHY && score > 50) {
        // Checking if any other issue is > 40
        const hasIssue = Object.entries(this.scores).some(([k, v]) => k !== DIAGNOSES.HEALTHY && v > 40);
        if (hasIssue) probability = 0;
      }

      finalResults.push({
        diagnosis,
        probability,
        isCritical: probability >= 75,
        evidence: this.evidence[diagnosis]
      });
    }

    // Sort by highest probability first
    finalResults.sort((a, b) => b.probability - a.probability);
    
    return {
      topIssues: finalResults.filter(r => r.probability > 30), // Only return plausible issues
      allResults: finalResults,
      timestamp: new Date().toISOString()
    };
  }
}

// =========================================================================
// TEST SUITE: Simulating different farm scenarios
// =========================================================================

export function runEngineTests() {
  console.log("=== RUNNING ROOT CAUSE ENGINE TESTS ===");

  const testCases = [
    {
      name: "Test 1: Severe Drought Stress",
      payload: {
        history: { visual_signs: ['wilting'] },
        weather: { metrics: { rainfall_sum: 2, temperature_max: 38, humidity_mean: 30 } },
        sensors: { moisture: 850 }, // 850 = bone dry for analog
        vision: [] // AI didn't find specific diseases
      }
    },
    {
      name: "Test 2: Fungal Rust Outbreak",
      payload: {
        history: { visual_signs: ['spots_on_leaves'] },
        weather: { metrics: { rainfall_sum: 40, temperature_max: 26, humidity_mean: 85 } },
        sensors: { moisture: 400 }, // optimal
        vision: [
          {
            disease: { label: 'Wheat Leaf Rust', confidence: 0.92 },
            pest: { label: 'No pests detected', detections: [] }
          }
        ]
      }
    },
    {
      name: "Test 3: Conflicting Data (Pest AI vs Weather)",
      payload: {
        history: { visual_signs: ['insects_visible', 'yellowing_leaves'] },
        weather: { metrics: { rainfall_sum: 10, temperature_max: 25, humidity_mean: 45 } },
        sensors: { moisture: 450 },
        vision: [
          {
            disease: { label: 'Healthy', confidence: 0.8 },
            pest: { label: 'Aphids', detections: [{class_name: 'aphid', confidence: 0.88}] }
          }
        ]
      }
    },
    {
      name: "Test 4: Perfectly Healthy Crop",
      payload: {
        history: { visual_signs: [] },
        weather: { metrics: { rainfall_sum: 20, temperature_max: 24, humidity_mean: 50 } },
        sensors: { moisture: 450 },
        vision: [
          {
            disease: { label: 'Healthy', confidence: 0.95 },
            pest: { label: 'No pests detected', detections: [] }
          }
        ]
      }
    }
  ];

  const testResults = [];

  testCases.forEach((tc, idx) => {
    const engine = new RootCauseEngine(tc.payload);
    const result = engine.compute();
    
    console.log(`\n--- ${tc.name} ---`);
    if (result.topIssues.length > 0) {
      result.topIssues.forEach(issue => {
        console.log(`🔴 ${issue.diagnosis}: ${issue.probability}%`);
        issue.evidence.forEach(ev => console.log(`   └─ ${ev}`));
      });
    } else {
      console.log(`🟢 Farm is entirely healthy! No issues detected.`);
    }

    testResults.push({ name: tc.name, result });
  });

  return testResults;
}
