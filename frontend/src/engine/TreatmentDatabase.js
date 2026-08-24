export const TREATMENT_DB = {
  'Drought / Water Stress': {
    action: 'Immediate Irrigation',
    details: 'Apply 30-40mm of water immediately. Use drip or sprinkler irrigation to avoid soil erosion.',
    chemical: null,
    preventive: 'Maintain soil moisture above 40%. Apply mulch to retain water.'
  },
  'Overwatering / Root Rot Risk': {
    action: 'Stop Irrigation & Drain',
    details: 'Halt all irrigation for 5-7 days. Clear field drainage channels to allow standing water to escape.',
    chemical: 'Apply fungicide containing Metalaxyl if root rot symptoms (wilting despite wet soil) appear.',
    preventive: 'Ensure proper field leveling. Avoid irrigating before heavy rains.'
  },
  'Nitrogen Deficiency': {
    action: 'Apply Nitrogen Fertilizer',
    details: 'Apply 40-50 kg/ha of Urea (46% N) as a top dressing. Irrigate immediately after application.',
    chemical: 'Urea or Ammonium Nitrate',
    preventive: 'Maintain split doses of Nitrogen during tillering and booting stages.'
  },
  'Phosphorus Deficiency': {
    action: 'Apply Phosphorus Fertilizer',
    details: 'Foliar spray of 2% DAP (Diammonium Phosphate) or NPK 19:19:19 for quick absorption.',
    chemical: 'DAP or Superphosphate',
    preventive: 'Apply basal dose of Phosphorus before sowing as it is immobile in soil.'
  },
  'Potassium Deficiency': {
    action: 'Apply Potassium Fertilizer',
    details: 'Apply MOP (Muriate of Potash) at 20-30 kg/ha or Potassium Sulphate.',
    chemical: 'MOP (Potassium Chloride)',
    preventive: 'Ensure balanced NPK application. Potassium improves drought and disease resistance.'
  },
  'Rust Disease (Leaf/Stripe/Stem)': {
    action: 'Apply Fungicide Immediately',
    details: 'Spray Propiconazole 25% EC (1 ml/litre) or Tebuconazole 25.9% EC (1 ml/litre) of water.',
    chemical: 'Propiconazole or Tebuconazole',
    preventive: 'Use rust-resistant wheat varieties. Avoid excessive Nitrogen which promotes lush, susceptible growth.'
  },
  'Fusarium Head Blight': {
    action: 'Fungicide Spray at Flowering',
    details: 'Spray Tebuconazole or Prothioconazole exactly during the flowering (anthesis) stage.',
    chemical: 'Prothioconazole / Tebuconazole',
    preventive: 'Crop rotation (avoid planting wheat after corn). Deep ploughing to bury crop residues.'
  },
  'Foliar Disease (Septoria/Spot/Mildew)': {
    action: 'Apply Broad-Spectrum Fungicide',
    details: 'Spray Azoxystrobin + Tebuconazole or Mancozeb 75% WP (2-2.5 g/litre).',
    chemical: 'Azoxystrobin / Mancozeb',
    preventive: 'Ensure proper row spacing for aeration. Remove volunteer wheat and weeds.'
  },
  'Pest Infestation (Aphids/Mites/Insects)': {
    action: 'Apply Insecticide',
    details: 'For aphids: Spray Imidacloprid 17.8% SL (0.5 ml/litre). For mites: Spray Abamectin or Spiromesifen.',
    chemical: 'Imidacloprid / Abamectin',
    preventive: 'Promote natural enemies like Ladybird beetles. Avoid prophylactic calendar sprays.'
  },
  'Soil pH Imbalance': {
    action: 'Soil Amendment',
    details: 'If acidic (pH < 5.5), apply agricultural lime. If alkaline (pH > 7.5), apply elemental sulfur or gypsum.',
    chemical: 'Lime / Gypsum',
    preventive: 'Regularly test soil pH every 2-3 years. Avoid continuous use of acidifying fertilizers like Ammonium Sulphate.'
  },
  'Healthy / Optimal': {
    action: 'Maintain Current Practices',
    details: 'Your crop is doing well. Continue standard irrigation and scheduled fertilizer applications.',
    chemical: 'None required',
    preventive: 'Monitor weekly for any early signs of pests or diseases.'
  }
};
