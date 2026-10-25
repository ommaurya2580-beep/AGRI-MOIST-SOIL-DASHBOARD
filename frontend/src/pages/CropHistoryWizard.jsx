// Updated: 2026-10-25
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  Sun, 
  CloudSun, 
  AlertTriangle, 
  Check, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Lightbulb, 
  Info,
  CheckCircle2,
  Leaf
} from 'lucide-react';

// ==========================================
// 1. CROPS DATA (20 crops from Image 1)
// ==========================================
const CROPS_LIST = [
  { id: 'wheat', name: 'Wheat', category: 'Cereals', tag: 'Cereal', tagColor: 'amber', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
  { id: 'rice', name: 'Rice', category: 'Cereals', tag: 'Cereal', tagColor: 'amber', image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80' },
  { id: 'maize', name: 'Maize', category: 'Cereals', tag: 'Cereal', tagColor: 'amber', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' },
  { id: 'sugarcane', name: 'Sugarcane', category: 'Others', tag: 'Cash Crop', tagColor: 'blue', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80' },
  { id: 'mustard', name: 'Mustard', category: 'Others', tag: 'Oilseed', tagColor: 'yellow', image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=400&q=80' },
  { id: 'chickpea', name: 'Chickpea', category: 'Pulses', tag: 'Pulse', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80' },
  { id: 'soybean', name: 'Soybean', category: 'Pulses', tag: 'Pulse', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80' },
  { id: 'potato', name: 'Potato', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
  { id: 'cotton', name: 'Cotton', category: 'Others', tag: 'Cash Crop', tagColor: 'blue', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80' },
  { id: 'groundnut', name: 'Groundnut', category: 'Others', tag: 'Oilseed', tagColor: 'yellow', image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=400&q=80' },
  { id: 'chilli', name: 'Chilli', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80' },
  { id: 'brinjal', name: 'Brinjal', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' },
  { id: 'onion', name: 'Onion', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80' },
  { id: 'garlic', name: 'Garlic', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80' },
  { id: 'peas', name: 'Peas', category: 'Pulses', tag: 'Pulse', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=400&q=80' },
  { id: 'lentil', name: 'Lentil', category: 'Pulses', tag: 'Pulse', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80' },
  { id: 'watermelon', name: 'Watermelon', category: 'Fruits', tag: 'Fruit', tagColor: 'rose', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
  { id: 'okra', name: 'Okra', category: 'Vegetables', tag: 'Vegetable', tagColor: 'emerald', image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80' },
  { id: 'other', name: 'Other Crop', category: 'Others', tag: 'Others', tagColor: 'purple', isSpecial: true }
];

const CROP_CATEGORIES = ['All Crops', 'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Others'];

// ==========================================
// 2. WHEAT DETAILS (Images 2, 3, 4 Data)
// ==========================================

// 2.1 Growth Stages (Image 2 Top)
const GROWTH_STAGES = [
  { id: 'seedling', title: 'Seedling', desc: 'Early plant growth from seed', badge: '0 – 20 days', image: '/images/stages/seedling.jpg', fallback: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80' },
  { id: 'tillering', title: 'Tillering', desc: 'Multiple shoots emerge from base', badge: '20 – 45 days', image: '/images/stages/tillering.jpg', fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
  { id: 'stem_elongation', title: 'Stem Elongation', desc: 'Stem length increases rapidly', badge: '45 – 75 days', image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80' },
  { id: 'heading', title: 'Heading', desc: 'Ear (spike) emerges from the stem', badge: '75 – 100 days', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
  { id: 'flowering', title: 'Flowering', desc: 'Pollination and grain formation', badge: '100 – 120 days', image: '/images/stages/flowering.jpg', fallback: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80' },
  { id: 'grain_filling_milk', title: 'Grain Filling (Milk)', desc: 'Grains start filling with milk', badge: '120 – 140 days', image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80' },
  { id: 'grain_filling_dough', title: 'Grain Filling (Dough)', desc: 'Grains become firm and starchy', badge: '140 – 160 days', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'maturity', title: 'Maturity', desc: 'Grains fully mature and ready for harvest', badge: '160 – 180 days', image: '/images/stages/maturity.jpg', fallback: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=400&q=80' },
];

// 2.2 Last Irrigation (Image 2 Bottom)
const IRRIGATION_OPTIONS = [
  { id: 'today', title: 'Today', desc: 'Irrigated today', image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=400&q=80' },
  { id: '1_3_days', title: '1 – 3 Days Ago', desc: 'Irrigated within last 3 days', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80' },
  { id: '4_7_days', title: '4 – 7 Days Ago', desc: 'Irrigated within last week', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80' },
  { id: '8_15_days', title: '8 – 15 Days Ago', desc: 'Irrigated within last 2 weeks', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
  { id: 'over_15_days', title: 'More than 15 Days', desc: 'Irrigation was over 15 days ago', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
  { id: 'not_irrigated', title: 'Not Irrigated Yet', desc: 'No irrigation this season', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
  { id: 'rainfed', title: 'Rainfed Only', desc: 'Only rainfall, no irrigation', image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80' },
  { id: 'other', title: 'Other', desc: 'Select if different from above', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
];

// 2.3 Fertilizer Applied (Image 3 Top - Multi-select)
const FERTILIZERS = [
  { id: 'urea', title: 'Urea', desc: 'Provides Nitrogen (N)', badge: 'N: 46%', badgeType: 'emerald', image: '/images/fertilizers/urea.jpg', fallback: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80' },
  { id: 'dap', title: 'DAP', desc: 'Nitrogen + Phosphorus', badge: 'N: 18%  P: 46%', badgeType: 'blue', image: '/images/fertilizers/dap.jpg', fallback: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
  { id: 'npk', title: 'NPK (Complex)', desc: 'Balanced nutrition', badge: 'N-P-K (e.g. 12-32-16)', badgeType: 'cyan', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' },
  { id: 'mop', title: 'MOP (Potash)', desc: 'Provides Potassium (K)', badge: 'K: 60%', badgeType: 'purple', image: '/images/fertilizers/potassium.jpg', fallback: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
  { id: 'organic_manure', title: 'Organic Manure', desc: 'Improves soil health', badge: 'Organic', badgeType: 'green', image: '/images/fertilizers/organic.jpg', fallback: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=400&q=80' },
  { id: 'compost', title: 'Compost', desc: 'Natural nutrients', badge: 'Organic', badgeType: 'green', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=400&q=80' },
  { id: 'vermicompost', title: 'Vermicompost', desc: 'Rich in micronutrients', badge: 'Organic', badgeType: 'green', image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=400&q=80' },
  { id: 'other', title: 'Other', desc: 'Select if different from above', badge: 'Custom', badgeType: 'stone', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
];

// 2.4 Crop Protection (Image 3 Bottom - Multi-select)
const PROTECTION_OPTIONS = [
  { id: 'insecticide', title: 'Insecticide', desc: 'Controls insects and pests', image: '/images/sprays/pesticide.jpg', fallback: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80' },
  { id: 'fungicide', title: 'Fungicide', desc: 'Controls fungal diseases', image: '/images/sprays/fungicide.jpg', fallback: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80' },
  { id: 'herbicide', title: 'Herbicide', desc: 'Controls unwanted weeds', image: '/images/sprays/herbicide.jpg', fallback: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80' },
  { id: 'miticide', title: 'Miticide', desc: 'Controls mites', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80' },
  { id: 'bactericide', title: 'Bactericide', desc: 'Controls bacterial diseases', image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80' },
  { id: 'biopesticide', title: 'Biopesticide', desc: 'Organic/biological protection', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'neem', title: 'Neem Based', desc: 'Plant-based protection', image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=400&q=80' },
  { id: 'none', title: 'Not Used', desc: 'No chemical spray recently', image: '/images/sprays/none.jpg', fallback: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
  { id: 'other', title: 'Other', desc: 'Select if different from above', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80' },
];

// 2.5 Recent Weather Experience (Image 4 Top)
const WEATHER_EXPERIENCE = [
  { id: 'sunny', title: 'Sunny', desc: 'Clear sky, high sunlight', badge: '🔥 High temperature', badgeColor: 'orange', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80' },
  { id: 'partly_cloudy', title: 'Partly Cloudy', desc: 'Some clouds, moderate sunlight', badge: '☁️ Moderate temperature', badgeColor: 'blue', image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=400&q=80' },
  { id: 'cloudy', title: 'Cloudy', desc: 'Mostly cloudy, low sunlight', badge: '☁️ Lower temperature', badgeColor: 'blue', image: 'https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=400&q=80' },
  { id: 'rainy', title: 'Rainy', desc: 'Received rainfall', badge: '💧 Heavy / Moderate', badgeColor: 'cyan', image: '/images/weather/rain.jpg', fallback: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80' },
  { id: 'hot_dry', title: 'Hot & Dry', desc: 'High temperature, low moisture', badge: '🔥 Drought-like', badgeColor: 'orange', image: '/images/weather/hot.jpg', fallback: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
  { id: 'foggy', title: 'Foggy', desc: 'Low visibility, high humidity', badge: '🌫️ High humidity', badgeColor: 'slate', image: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=400&q=80' },
  { id: 'storm', title: 'Storm / Hailstorm', desc: 'Strong winds or hail', badge: '💨 Wind / Hail', badgeColor: 'slate', image: '/images/weather/wind.jpg', fallback: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=400&q=80' },
  { id: 'normal', title: 'Normal', desc: 'No major weather issue', badge: '🌱 Suitable condition', badgeColor: 'emerald', image: '/images/weather/normal.jpg', fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
];

// 2.6 Current Problem (Image 4 Bottom - Multi-select)
const PROBLEMS = [
  { id: 'diseases', title: 'Diseases (Leaf Spot, Rust, Mildew etc.)', desc: 'Spots, discoloration, powdery growth', engineId: 'spots_on_leaves', image: '/images/problems/spots.jpg', fallback: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80' },
  { id: 'pests', title: 'Pests (Insects)', desc: 'Caterpillars, aphids, mites, etc.', engineId: 'insects_visible', image: '/images/problems/insects.jpg', fallback: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80' },
  { id: 'yellowing', title: 'Yellowing Leaves', desc: 'Leaves turning yellow', engineId: 'yellowing_leaves', image: '/images/problems/yellow.jpg', fallback: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'wilting', title: 'Wilting', desc: 'Plants are drooping', engineId: 'wilting', image: '/images/problems/wilting.jpg', fallback: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
  { id: 'stunted', title: 'Stunted Growth', desc: 'Plants are smaller than normal', engineId: 'stunted_growth', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80' },
  { id: 'leaf_damage', title: 'Leaf Damage', desc: 'Holes or eaten leaves', engineId: 'insects_visible', image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80' },
  { id: 'poor_yield', title: 'Poor Yield', desc: 'Less grain/fruit formation', engineId: 'stunted_growth', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
  { id: 'healthy', title: 'No Visible Problem', desc: 'Crop looks healthy', engineId: 'all_good', image: '/images/problems/all_good.jpg', fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
  { id: 'other', title: 'Other Issue', desc: 'Select if different from above', engineId: 'other', isSpecial: true },
];

export default function CropHistoryWizard() {
  const navigate = useNavigate();

  // Page 1: Crop Selection | Page 2: Wheat Field Details & History
  const [currentPage, setCurrentPage] = useState(1);

  // --- Page 1 State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Crops');
  const [selectedCrops, setSelectedCrops] = useState(['Wheat']);

  // --- Page 2 State (Wheat History) ---
  const [selectedStage, setSelectedStage] = useState('seedling');
  const [selectedIrrigation, setSelectedIrrigation] = useState('1_3_days');
  const [selectedFertilizers, setSelectedFertilizers] = useState(['urea']);
  const [selectedProtection, setSelectedProtection] = useState(['insecticide']);
  const [selectedWeather, setSelectedWeather] = useState('sunny');
  const [selectedProblems, setSelectedProblems] = useState(['diseases']);

  // Helper: toggle multi-selection in arrays
  const toggleArrayItem = (list, setList, itemId) => {
    if (list.includes(itemId)) {
      if (list.length > 1) {
        setList(list.filter(i => i !== itemId));
      }
    } else {
      setList([...list, itemId]);
    }
  };

  // Helper: toggle crop selection
  const toggleCrop = (cropName) => {
    if (selectedCrops.includes(cropName)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter(c => c !== cropName));
      }
    } else {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  // Filter crops based on search & category
  const filteredCrops = CROPS_LIST.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Crops' || crop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Save history and navigate to Step 2: 30-Day Weather Sync
  const handleSaveAndContinue = () => {
    const stageObj = GROWTH_STAGES.find(s => s.id === selectedStage) || GROWTH_STAGES[0];
    const irrigationObj = IRRIGATION_OPTIONS.find(i => i.id === selectedIrrigation) || IRRIGATION_OPTIONS[1];
    const weatherObj = WEATHER_EXPERIENCE.find(w => w.id === selectedWeather) || WEATHER_EXPERIENCE[0];
    const problemObjs = PROBLEMS.filter(p => selectedProblems.includes(p.id));
    const primaryProblem = problemObjs[0] || PROBLEMS[0];

    const historyPayload = {
      crop: 'Wheat',
      selectedCrops: selectedCrops,
      stage: stageObj.title,
      stage_days: stageObj.badge,
      stage_id: selectedStage,
      irrigation: irrigationObj.title,
      irrigation_date: irrigationObj.title,
      fertilizers: selectedFertilizers.map(fId => FERTILIZERS.find(f => f.id === fId)?.title || fId),
      fertilizer_id: selectedFertilizers[0] || 'urea',
      protection: selectedProtection.map(pId => PROTECTION_OPTIONS.find(p => p.id === pId)?.title || pId),
      spray_id: selectedProtection[0] || 'pesticide',
      weather_experience: weatherObj.title,
      weather_id: selectedWeather,
      problems: problemObjs.map(p => p.title),
      problem_id: primaryProblem.engineId,
      observed_problem: primaryProblem.title
    };

    // Store in localStorage for RootCauseEngine and the next steps
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.history = historyPayload;
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));

    // Move to Step 2: 30-Day Weather Sync
    navigate('/weather-sync');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans">
      
      {/* ======================================================== */}
      {/* TOP BREADCRUMB / STEP INDICATOR BAR                      */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 pt-1">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {/* Step 1: Crop Selection */}
          <button 
            onClick={() => setCurrentPage(1)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentPage === 1 
                ? 'bg-[#10B981] text-white shadow-sm' 
                : 'bg-emerald-600 text-white'
            }`}>
              {currentPage > 1 ? <Check size={14} /> : '1'}
            </div>
            <span className={`text-xs sm:text-sm font-semibold transition-colors ${
              currentPage === 1 
                ? 'text-emerald-700 font-bold' 
                : 'text-stone-700 group-hover:text-emerald-600'
            }`}>
              Crop Selection
            </span>
          </button>
          
          <div className={`w-6 sm:w-14 h-[2px] ${currentPage >= 2 ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>

          {/* Step 2: Field Details */}
          <button 
            onClick={() => setCurrentPage(2)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentPage === 2 
                ? 'bg-[#10B981] text-white shadow-sm' 
                : 'bg-stone-200 text-stone-500 group-hover:bg-stone-300'
            }`}>
              2
            </div>
            <span className={`text-xs sm:text-sm font-semibold transition-colors ${
              currentPage === 2 
                ? 'text-emerald-700 font-bold' 
                : 'text-stone-400 group-hover:text-stone-600'
            }`}>
              Field Details {currentPage === 2 ? '(Wheat)' : ''}
            </span>
          </button>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 3: Management */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Management
            </span>
          </div>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 4: Review & Save */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Review & Save
            </span>
          </div>
        </div>

        {/* Diagnostic Mode Badge */}
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
          Step 1: History Collection
        </span>
      </div>

      {/* ======================================================== */}
      {/* PAGE 1: CROP SELECTION (Matches Image 1)                 */}
      {/* ======================================================== */}
      {currentPage === 1 && (
        <div className="space-y-6">
          
          {/* Hero Banner with Landscape & Search Filters */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-[#FAF6F0] to-amber-50/40 border border-stone-200/80 p-6 sm:p-8 shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Title & Subtitle */}
              <div className="flex items-start gap-4 max-w-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-sm">
                  <Leaf size={24} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    Select Crop(s)
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Choose the crops you grow in your field. You can select multiple crops.
                  </p>
                </div>
              </div>

              {/* Search Bar & Categories */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative min-w-[260px] sm:min-w-[300px]">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search crops... (e.g. Wheat, Rice, Maize)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {CROP_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCategory === category
                          ? 'bg-[#10B981] text-white shadow-sm'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main 2-Column Content Area */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left: 20 Crop Cards Grid (5 columns on desktop) */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredCrops.map(crop => {
                  const isSelected = selectedCrops.includes(crop.name);
                  
                  return (
                    <div
                      key={crop.id}
                      onClick={() => toggleCrop(crop.name)}
                      className={`group relative rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all duration-200 flex flex-col ${
                        isSelected 
                          ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                          : 'border-stone-200/90 hover:border-stone-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Right Orange Checkmark Badge if Selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#E8592A] text-white flex items-center justify-center shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}

                      {/* Crop Image Thumbnail */}
                      <div className="h-28 w-full bg-stone-100 overflow-hidden relative">
                        {crop.isSpecial ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/60 text-emerald-600">
                            <Leaf size={32} />
                            <span className="text-[11px] font-semibold text-emerald-800 mt-1">Custom Crop</span>
                          </div>
                        ) : (
                          <img
                            src={crop.image}
                            alt={crop.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/farmer_hero_wide.png';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="p-3 flex items-center justify-between gap-2 bg-white">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Checkbox */}
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-[#E8592A] border-[#E8592A] text-white' 
                              : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>

                          {/* Name */}
                          <span className={`text-xs sm:text-sm font-bold truncate ${
                            isSelected ? 'text-slate-900' : 'text-stone-700'
                          }`}>
                            {crop.name}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                          crop.tagColor === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                          crop.tagColor === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                          crop.tagColor === 'yellow' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200/60' :
                          crop.tagColor === 'rose' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                          crop.tagColor === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200/60' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {crop.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCrops.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                  <Leaf className="mx-auto text-stone-300 mb-2" size={36} />
                  <p className="text-stone-600 font-semibold text-sm">No crops found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All Crops'); }}
                    className="mt-3 text-xs text-[#E8592A] font-bold hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* Right: Selected Summary & Next Action Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              
              {/* Card 1: Selected Crops List */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Selected Crops ({selectedCrops.length})
                  </h3>
                  {selectedCrops.length > 0 && (
                    <button 
                      onClick={() => setSelectedCrops([])}
                      className="text-xs text-[#E8592A] hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Selected Crop Pills */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCrops.map(name => {
                    const cropInfo = CROPS_LIST.find(c => c.name === name);
                    return (
                      <div 
                        key={name}
                        className="flex items-center justify-between p-2 rounded-xl border border-stone-200 bg-stone-50/50"
                      >
                        <div className="flex items-center gap-2.5">
                          {cropInfo?.image ? (
                            <img 
                              src={cropInfo.image} 
                              alt={name} 
                              className="w-8 h-8 rounded-lg object-cover"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/farmer_hero_wide.png'; }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Leaf size={16} />
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-800">{name}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCrop(name); }}
                          className="w-6 h-6 rounded-md hover:bg-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Info Note */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-2.5">
                  <Leaf size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    You can select multiple crops if you grow more than one in your field.
                  </p>
                </div>
              </div>

              {/* Card 2: Tips Box */}
              <div className="bg-[#FFF9F5] rounded-2xl border border-[#FFE4D6] p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs sm:text-sm">
                  <Lightbulb size={18} className="text-amber-500" />
                  <span>Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-600 font-normal leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Select all the crops you grow in this field or farm.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>This helps in better diagnosis and personalized recommendations.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>You can add field details, irrigation, fertilizer and past issues in the next steps.</span>
                  </li>
                </ul>
              </div>

              {/* Action Button: Next Field Details */}
              <button
                onClick={() => setCurrentPage(2)}
                disabled={selectedCrops.length === 0}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all ${
                  selectedCrops.length === 0
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-[#E8592A] hover:bg-[#D44A1E] shadow-orange-500/20 hover:translate-y-[-1px]'
                }`}
              >
                <span>Next: Field Details</span>
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* PAGE 2: WHEAT FIELD DETAILS & HISTORY                    */}
      {/* (All 3 Images Combined Into One Single Scrollable Page)  */}
      {/* ======================================================== */}
      {currentPage === 2 && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Top Banner Explaining Wheat Context */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                🌾
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
                  Configuring Field Details for Wheat
                </h2>
                <p className="text-xs text-stone-500">
                  Please provide growth stage, irrigation, fertilizers, protection, weather, and current problems.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage(1)}
              className="text-xs text-amber-900 font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <ArrowLeft size={13} />
              <span>Change Crop</span>
            </button>
          </div>

          {/* =================================================== */}
          {/* 1. WHEAT - GROWTH STAGE (Image 2 Top)               */}
          {/* =================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Wheat - Growth Stage
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select the current growth stage of your wheat crop. This helps in better diagnosis and recommendations.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#FFF6F0] border border-[#FED7AA] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#EA580C] shrink-0" />
                <p className="text-[11px] text-[#9A3412] leading-tight font-medium">
                  Growth stage helps us understand the crop's current condition and provide stage-specific analysis and advisory.
                </p>
              </div>
            </div>

            {/* 8 Growth Stage Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              {GROWTH_STAGES.map(stage => {
                const isSelected = selectedStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      <img 
                        src={stage.image} 
                        alt={stage.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = stage.fallback || '/images/farmer_hero_wide.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {/* Radio + Title */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#E8592A]' : 'border-stone-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#E8592A]" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {stage.title}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-stone-500 mt-1 pl-5 leading-tight">
                          {stage.desc}
                        </p>
                      </div>

                      {/* Day Range Badge */}
                      <div className="pt-1">
                        <span className="inline-block w-full text-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {stage.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* =================================================== */}
          {/* 2. LAST IRRIGATION (Image 2 Bottom)                 */}
          {/* =================================================== */}
          <section className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Last Irrigation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select when you last irrigated your wheat field. This information helps us analyze crop health and water stress.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#2563EB] shrink-0" />
                <p className="text-[11px] text-[#1E40AF] leading-tight font-medium">
                  Irrigation history helps in understanding soil moisture condition and its impact on crop health.
                </p>
              </div>
            </div>

            {/* 8 Irrigation Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              {IRRIGATION_OPTIONS.map(opt => {
                const isSelected = selectedIrrigation === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedIrrigation(opt.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      <img 
                        src={opt.image} 
                        alt={opt.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/farmer_hero_wide.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-1 bg-white">
                      {/* Radio + Title */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#E8592A]' : 'border-stone-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#E8592A]" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {opt.title}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-stone-500 pl-5 leading-tight">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* =================================================== */}
          {/* 3. FERTILIZER APPLIED (Image 3 Top - Multi-select)   */}
          {/* =================================================== */}
          <section className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Fertilizer Applied
                  </h3>
                  <p className="text-xs text-stone-500">
                    What fertilizer did you use recently? You can select multiple options if you used more than one.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#16A34A] shrink-0" />
                <p className="text-[11px] text-[#166534] leading-tight font-medium">
                  Fertilizer history helps us understand the nutrient availability in soil and analyze its impact on crop health.
                </p>
              </div>
            </div>

            {/* 8 Fertilizer Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              {FERTILIZERS.map(fert => {
                const isSelected = selectedFertilizers.includes(fert.id);
                return (
                  <div
                    key={fert.id}
                    onClick={() => toggleArrayItem(selectedFertilizers, setSelectedFertilizers, fert.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      <img 
                        src={fert.image} 
                        alt={fert.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fert.fallback || '/images/farmer_hero_wide.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {/* Checkbox + Title */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#E8592A] border-[#E8592A] text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {fert.title}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-stone-500 mt-1 pl-5 leading-tight">
                          {fert.desc}
                        </p>
                      </div>

                      {/* Nutrient Badge */}
                      <div className="pt-1">
                        <span className={`inline-block w-full text-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          fert.badgeType === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          fert.badgeType === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                          fert.badgeType === 'cyan' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200/60' :
                          fert.badgeType === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200/60' :
                          fert.badgeType === 'stone' ? 'bg-stone-100 text-stone-700 border border-stone-200' :
                          'bg-green-50 text-green-700 border border-green-200/60'
                        }`}>
                          {fert.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* =================================================== */}
          {/* 4. CROP PROTECTION (Image 3 Bottom - Multi-select) */}
          {/* =================================================== */}
          <section className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Crop Protection
                  </h3>
                  <p className="text-xs text-stone-500">
                    Did you spray any chemicals recently? You can select multiple options if you used more than one.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#2563EB] shrink-0" />
                <p className="text-[11px] text-[#1E40AF] leading-tight font-medium">
                  Crop protection history helps us understand previous pest and disease management and its impact on current crop health.
                </p>
              </div>
            </div>

            {/* 9 Protection Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-3">
              {PROTECTION_OPTIONS.map(prot => {
                const isSelected = selectedProtection.includes(prot.id);
                return (
                  <div
                    key={prot.id}
                    onClick={() => toggleArrayItem(selectedProtection, setSelectedProtection, prot.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      <img 
                        src={prot.image} 
                        alt={prot.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = prot.fallback || '/images/farmer_hero_wide.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-1 bg-white">
                      {/* Checkbox + Title */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#E8592A] border-[#E8592A] text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {prot.title}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-stone-500 pl-5 leading-tight">
                        {prot.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* =================================================== */}
          {/* 5. RECENT WEATHER EXPERIENCE (Image 4 Top)         */}
          {/* =================================================== */}
          <section className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                  <CloudSun size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Recent Weather Experience
                  </h3>
                  <p className="text-xs text-stone-500">
                    How was the weather in your field last week? This helps us analyze the impact of weather on your crop health.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#2563EB] shrink-0" />
                <p className="text-[11px] text-[#1E40AF] leading-tight font-medium">
                  Weather conditions like temperature, rainfall and humidity can significantly affect crop growth, pests and diseases.
                </p>
              </div>
            </div>

            {/* 8 Weather Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              {WEATHER_EXPERIENCE.map(weath => {
                const isSelected = selectedWeather === weath.id;
                return (
                  <div
                    key={weath.id}
                    onClick={() => setSelectedWeather(weath.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      <img 
                        src={weath.image} 
                        alt={weath.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = weath.fallback || '/images/farmer_hero_wide.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {/* Radio + Title */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#E8592A]' : 'border-stone-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#E8592A]" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {weath.title}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-stone-500 mt-1 pl-5 leading-tight">
                          {weath.desc}
                        </p>
                      </div>

                      {/* Weather Tag Badge */}
                      <div className="pt-1">
                        <span className={`inline-block w-full text-center text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          weath.badgeColor === 'orange' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
                          weath.badgeColor === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                          weath.badgeColor === 'cyan' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200/60' :
                          weath.badgeColor === 'slate' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {weath.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* =================================================== */}
          {/* 6. CURRENT PROBLEM (Image 4 Bottom - Multi-select) */}
          {/* =================================================== */}
          <section className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Current Problem
                  </h3>
                  <p className="text-xs text-stone-500">
                    What issues are you seeing in the field? You can select multiple options.
                  </p>
                </div>
              </div>

              {/* Info notice box on right */}
              <div className="p-2.5 px-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 max-w-md shrink-0">
                <Info size={16} className="text-[#16A34A] shrink-0" />
                <p className="text-[11px] text-[#166534] leading-tight font-medium">
                  Select all the problems you are observing in your crop. This helps in accurate diagnosis and recommendations.
                </p>
              </div>
            </div>

            {/* 9 Problem Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-3">
              {PROBLEMS.map(prob => {
                const isSelected = selectedProblems.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    onClick={() => toggleArrayItem(selectedProblems, setSelectedProblems, prob.id)}
                    className={`rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-2 border-[#E8592A] shadow-md ring-1 ring-[#E8592A]/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-24 w-full bg-stone-100 overflow-hidden relative">
                      {prob.isSpecial ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/60 text-emerald-600">
                          <Leaf size={28} />
                          <span className="text-[10px] font-semibold text-emerald-800 mt-1">Other Issue</span>
                        </div>
                      ) : (
                        <img 
                          src={prob.image} 
                          alt={prob.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = prob.fallback || '/images/farmer_hero_wide.png';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-1 bg-white">
                      {/* Checkbox + Title */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#E8592A] border-[#E8592A] text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight line-clamp-2">
                          {prob.title}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-stone-500 pl-5 leading-tight line-clamp-2">
                        {prob.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =================================================== */}
          {/* STICKY BOTTOM ACTION BAR                            */}
          {/* =================================================== */}
          <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <button
              onClick={() => setCurrentPage(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={16} />
              <span>Back to Crop Selection</span>
            </button>

            <div className="text-center hidden md:block">
              <span className="text-xs font-semibold text-stone-500">
                Crop: <strong className="text-slate-800">Wheat</strong> • Stage: <strong className="text-slate-800">{GROWTH_STAGES.find(s => s.id === selectedStage)?.title}</strong> • Last Irrigation: <strong className="text-slate-800">{IRRIGATION_OPTIONS.find(i => i.id === selectedIrrigation)?.title}</strong>
              </span>
            </div>

            <button
              onClick={handleSaveAndContinue}
              className="px-7 py-3 rounded-xl bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all w-full sm:w-auto justify-center"
            >
              <span>Save & Continue to 30-Day Weather</span>
              <ArrowRight size={16} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
