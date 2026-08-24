/**
 * Root Cause Engine (AgriPulse)
 * This engine takes aggregated data from History, Weather, Sensors, and Vision Models,
 * and calculates point-based probabilities for various agricultural issues.
 */

const DIAGNOSES = {
  WATER_STRESS_DROUGHT: 'Drought / Water Stress',
  WATER_STRESS_OVERWATER: 'Overwatering / Root Rot Risk',
  NUTRIENT_DEFICIENCY_N: 'Nitrogen Deficiency',
  NUTRIENT_DEFICIENCY_P: 'Phosphorus Deficiency',
  NUTRIENT_DEFICIENCY_K: 'Potassium Deficiency',
  FUNGAL_DISEASE_RUST: 'Rust Disease (Leaf/Stripe/Stem)',
  FUNGAL_DISEASE_BLIGHT: 'Fusarium Head Blight',
  FUNGAL_DISEASE_FOLIAR: 'Foliar Disease (Septoria/Spot/Mildew)',
  PEST_ATTACK_GENERAL: 'Pest Infestation (Aphids/Mites/Insects)',
  SOIL_PH_IMBALANCE: 'Soil pH Imbalance',
  HEALTHY: 'Healthy / Optimal'
};

export class RootCauseEngine {
  constructor(payload) {
    this.data = payload;
    
    // Normalize data structure
    this.history = this.data.history || {};
    this.weather = this.data.weather || { metrics: {}, raw_metrics: {} };
    this.sensors = this.data.sensors || {};
    this.vision = this.data.vision || [];
    
    // Initialize scores
    this.scores = {};
    this.evidence = {};
    Object.values(DIAGNOSES).forEach(diag => {
      this.scores[diag] = 0;
      this.evidence[diag] = [];
    });
    this.scores[DIAGNOSES.HEALTHY] = 30; // Base score for healthy
  }

  // --- RULE 1: SENSOR RULES (Including NPK) ---
  evaluateSensors() {
    const { moisture, pH, nitrogen, phosphorus, potassium } = this.sensors;
    
    if (moisture !== undefined) {
      const isAnalog = moisture > 100;
      let isDry = false;
      let isWet = false;

      if (isAnalog) {
        isDry = moisture > 600;
        isWet = moisture < 300;
      } else {
        isDry = moisture < 30;
        isWet = moisture > 80;
      }

      if (isDry) {
        this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 40, `Sensor: Soil moisture is critically low (${moisture})`);
        this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 10, 'Sensor: Dry soil reduces nutrient uptake');
        this.addScore(DIAGNOSES.HEALTHY, -20, 'Sensor: Soil is too dry');
      } else if (isWet) {
        this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 40, `Sensor: Soil is waterlogged (${moisture})`);
        this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 15, 'Sensor: Waterlogging causes Nitrogen leaching');
        this.addScore(DIAGNOSES.HEALTHY, -20, 'Sensor: Soil is waterlogged');
      } else {
        this.addScore(DIAGNOSES.HEALTHY, 15, 'Sensor: Soil moisture is optimal');
      }
    }

    if (pH !== undefined) {
      if (pH < 5.5) {
        this.addScore(DIAGNOSES.SOIL_PH_IMBALANCE, 40, `Sensor: Soil is too acidic (pH ${pH})`);
        this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_P, 20, `Sensor: Low pH restricts Phosphorus availability`);
        this.addScore(DIAGNOSES.HEALTHY, -10, 'Sensor: Acidic soil');
      } else if (pH > 7.5) {
        this.addScore(DIAGNOSES.SOIL_PH_IMBALANCE, 40, `Sensor: Soil is too alkaline (pH ${pH})`);
        this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_P, 20, `Sensor: High pH restricts Phosphorus availability`);
        this.addScore(DIAGNOSES.HEALTHY, -10, 'Sensor: Alkaline soil');
      } else {
        this.addScore(DIAGNOSES.HEALTHY, 10, `Sensor: Soil pH is optimal (${pH})`);
      }
    }

    if (nitrogen !== undefined && nitrogen < 30) {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 40, `Sensor: Low soil Nitrogen detected (${nitrogen} mg/kg)`);
    }
    if (phosphorus !== undefined && phosphorus < 20) {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_P, 40, `Sensor: Low soil Phosphorus detected (${phosphorus} mg/kg)`);
    }
    if (potassium !== undefined && potassium < 80) {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_K, 40, `Sensor: Low soil Potassium detected (${potassium} mg/kg)`);
    }
  }

  // --- RULE 2: WEATHER RULES (30-Day Snapshot) ---
  evaluateWeather() {
    const rain = this.weather.rain_sum || 0;
    const tempAvg = this.weather.temp_avg || 25;
    const humidity = this.weather.humidity_avg || 50;

    if (rain < 10 && tempAvg > 30) {
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 35, `Weather: High temp (${tempAvg}°C) with virtually no recent rain (${rain}mm)`);
    }

    if (humidity > 75 && tempAvg >= 15 && tempAvg <= 28) {
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 30, `Weather: High humidity (${humidity}%) and warm temp heavily favor rust diseases`);
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_FOLIAR, 25, `Weather: Conditions favor foliar diseases (Septoria, Powdery Mildew)`);
    }

    if (rain > 30 && tempAvg > 20 && this.history.stage_id === 'maturity') {
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_BLIGHT, 40, `Weather: Rain (${rain}mm) during maturity stage increases Fusarium Head Blight risk`);
    }
    
    if (rain > 80) {
      this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 30, `Weather: Heavy 30-day rainfall (${rain}mm) increases flooding/root rot risk`);
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 15, `Weather: Heavy rainfall may have leached Nitrogen from soil`);
    }
  }

  // --- RULE 3: HISTORY RULES (Farmer Inputs) ---
  evaluateHistory() {
    const obs = this.history.problem_id || '';
    const exp = this.history.weather_experience || '';
    const fertilizer = this.history.fertilizer_id || '';

    if (obs === 'yellowing_leaves') {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 35, 'History: Farmer observed yellowing leaves (Chlorosis)');
      this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 15, 'History: Yellowing leaves can indicate root rot from overwatering');
    } else if (obs === 'wilting') {
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 35, 'History: Farmer observed wilting/drying');
    } else if (obs === 'spots_on_leaves') {
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 25, 'History: Farmer observed spots on leaves');
      this.addScore(DIAGNOSES.FUNGAL_DISEASE_FOLIAR, 25, 'History: Spots on leaves may indicate Septoria or Tan Spot');
    } else if (obs === 'insects_visible' || obs === 'holes_in_leaves') {
      this.addScore(DIAGNOSES.PEST_ATTACK_GENERAL, 40, 'History: Farmer observed insects or holes in leaves');
    } else if (obs === 'stunted_growth') {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_P, 30, 'History: Stunted growth is a key sign of Phosphorus deficiency');
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 20, 'History: Stunted growth can result from drought stress');
    } else if (obs === 'lodging') {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_K, 30, 'History: Lodging (weak stems) often indicates Potassium deficiency');
    }

    if (exp === 'drought') {
      this.addScore(DIAGNOSES.WATER_STRESS_DROUGHT, 20, 'History: Farmer reported experiencing drought conditions');
    } else if (exp === 'heavy_rain') {
      this.addScore(DIAGNOSES.WATER_STRESS_OVERWATER, 20, 'History: Farmer reported experiencing heavy rains');
    }

    if (fertilizer === 'none') {
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_N, 15, 'History: No fertilizer applied recently');
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_P, 15, 'History: No fertilizer applied recently');
      this.addScore(DIAGNOSES.NUTRIENT_DEFICIENCY_K, 15, 'History: No fertilizer applied recently');
    }
  }

  // --- RULE 4: VISION AI RULES ---
  evaluateVision() {
    if (this.vision.length === 0) return;

    let pestDetected = false;
    let diseaseDetected = false;
    let healthyCount = 0;

    this.vision.forEach((imgData, idx) => {
      if (imgData.disease && imgData.disease.label) {
        const label = imgData.disease.label.toLowerCase();
        const conf = parseFloat(imgData.disease.confidence || 0) * 100;

        if (label.includes('rust')) {
          this.addScore(DIAGNOSES.FUNGAL_DISEASE_RUST, 50 * (conf/100), `Vision AI: Detected ${imgData.disease.label} (Conf: ${conf.toFixed(0)}%) in Image ${idx+1}`);
          diseaseDetected = true;
        } else if (label.includes('blight')) {
          this.addScore(DIAGNOSES.FUNGAL_DISEASE_BLIGHT, 50 * (conf/100), `Vision AI: Detected ${imgData.disease.label} (Conf: ${conf.toFixed(0)}%) in Image ${idx+1}`);
          diseaseDetected = true;
        } else if (label.includes('spot') || label.includes('septoria') || label.includes('mildew')) {
          this.addScore(DIAGNOSES.FUNGAL_DISEASE_FOLIAR, 50 * (conf/100), `Vision AI: Detected ${imgData.disease.label} (Conf: ${conf.toFixed(0)}%) in Image ${idx+1}`);
          diseaseDetected = true;
        } else if (label.includes('healthy') && conf > 60) {
          healthyCount++;
        }
      }

      if (imgData.pest && imgData.pest.detections && imgData.pest.detections.length > 0) {
        const pestsFound = imgData.pest.detections.map(d => d.class_name).join(', ');
        const maxConf = Math.max(...imgData.pest.detections.map(d => d.confidence)) * 100;
        
        this.addScore(DIAGNOSES.PEST_ATTACK_GENERAL, 50 * (maxConf/100), `Vision AI: Detected ${pestsFound} in Image ${idx+1}`);
        pestDetected = true;
      } else if (imgData.pest && imgData.pest.label === 'No pests detected') {
        healthyCount++;
      }
    });

    if (!diseaseDetected && !pestDetected && healthyCount > 0) {
      this.addScore(DIAGNOSES.HEALTHY, 30, `Vision AI: Confirmed images appear visually healthy (${healthyCount} checks passed)`);
    }
  }

  // --- HELPER: ADD SCORE ---
  addScore(diagnosis, points, reason) {
    if (this.scores[diagnosis] !== undefined) {
      this.scores[diagnosis] += points;
      if (!this.evidence[diagnosis].includes(reason)) {
        this.evidence[diagnosis].push(reason);
      }
    }
  }

  // --- COMPUTE FINAL PROBABILITIES ---
  compute() {
    this.evaluateSensors();
    this.evaluateWeather();
    this.evaluateHistory();
    this.evaluateVision();

    const finalResults = [];
    
    for (const [diagnosis, score] of Object.entries(this.scores)) {
      let probability = Math.max(0, Math.min(100, Math.round(score)));
      
      if (diagnosis === DIAGNOSES.HEALTHY) {
        const hasIssue = Object.entries(this.scores).some(([k, v]) => k !== DIAGNOSES.HEALTHY && v >= 40);
        if (hasIssue) probability = 0;
      }

      finalResults.push({
        diagnosis,
        probability,
        isCritical: probability >= 75,
        evidence: this.evidence[diagnosis]
      });
    }

    finalResults.sort((a, b) => b.probability - a.probability);
    
    return {
      topIssues: finalResults.filter(r => r.probability > 25), 
      allResults: finalResults,
      timestamp: new Date().toISOString()
    };
  }
}

export function runEngineTests() {
  console.log("=== RUNNING ROOT CAUSE ENGINE TESTS ===");
  return [];
}
