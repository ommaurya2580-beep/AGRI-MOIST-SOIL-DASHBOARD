export const wheatProblemsDatabase = {
  disease: {
    id: 'disease',
    title: 'Diseases',
    description: 'Fungal, Bacterial, and Viral diseases affecting wheat.',
    subcategories: [
      {
        id: 'fungal',
        title: 'Fungal Diseases',
        groups: [
          {
            id: 'rust',
            title: 'Rust Diseases',
            problems: [
              {
                id: 'leaf_rust',
                name: 'Leaf Rust',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Small brown/orange pustules on leaves', 'Mainly affects upper leaves'],
                causes: ['Warm temperatures (15-22°C)', 'High humidity or free moisture'],
                treatment: {
                  primary: ['Confirm disease diagnosis', 'Use resistant variety where available', 'Fungicide intervention when economically justified'],
                  chemical: ['Triazole fungicides (Propiconazole, Tebuconazole, Prothioconazole)', 'QoI fungicides where locally effective', 'Premix fungicides according to local registration'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Do not use fertilizer as a disease cure', 'Avoid excessive nitrogen', 'Apply nitrogen according to soil test and crop stage', 'Maintain balanced N-P-K nutrition']
                },
                management: ['Monitor disease early', 'Manage volunteer wheat', 'Avoid unnecessarily dense crop canopy'],
                engineOutput: ['Primary Action: Rust management', 'Chemical Action: Registered fungicide', 'Fertilizer Action: Nitrogen balance check', 'Confidence Warning: Confirm local diagnosis']
              },
              {
                id: 'yellow_rust',
                name: 'Stripe / Yellow Rust',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Yellow/orange pustules in distinct stripes on leaves'],
                causes: ['Cooler temperatures (10-15°C)', 'High humidity'],
                treatment: {
                  primary: ['Early detection is important', 'Resistant variety preferred', 'Timely fungicide application if disease risk is high'],
                  chemical: ['Propiconazole', 'Tebuconazole', 'Prothioconazole-based options', 'Locally registered fungicide mixtures'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Avoid excessive late nitrogen', 'Use soil-test-based nutrient planning', 'Correct confirmed nutrient deficiency separately']
                },
                management: ['Regular field scouting', 'Resistant cultivars', 'Follow local fungicide resistance guidance']
              },
              {
                id: 'stem_rust',
                name: 'Stem / Black Rust',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Dark red/black pustules mainly on stems and leaf sheaths'],
                causes: ['Hot temperatures (20-30°C)', 'High humidity'],
                treatment: {
                  primary: ['Resistant variety', 'Disease surveillance', 'Fungicide where locally recommended'],
                  chemical: ['Registered systemic rust fungicides'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced nutrition', 'Avoid excessive nitrogen without soil requirement']
                },
                management: ['Resistant cultivar selection', 'Regional rust monitoring']
              }
            ]
          },
          {
            id: 'foliar',
            title: 'Foliar Diseases',
            problems: [
              {
                id: 'septoria',
                name: 'Septoria Tritici Blotch',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Irregular brown lesions with black dots (pycnidia)'],
                causes: ['Frequent rainfall', 'Mild temperatures'],
                treatment: {
                  primary: ['Fungicide based on disease risk', 'Protect upper leaves at critical growth stages', 'Use integrated disease management'],
                  chemical: ['Prothioconazole', 'Fluxapyroxad-containing registered mixtures', 'Other locally approved multi-site/systemic programs'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced nitrogen program', 'Do not apply nitrogen specifically as a treatment', 'Correct confirmed deficiencies from soil/plant testing']
                },
                management: ['Crop residue management', 'Crop rotation', 'Resistant/tolerant cultivars']
              },
              {
                id: 'tan_spot',
                name: 'Tan Spot',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Tan spots with yellow halos'],
                causes: ['Wheat-on-wheat rotation', 'High residue'],
                treatment: {
                  primary: ['Residue management', 'Crop rotation', 'Fungicide when risk/economic threshold justifies'],
                  chemical: ['Registered triazole / premix fungicides'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Soil-test-based balanced nutrition', 'Avoid using extra fertilizer as disease treatment']
                },
                management: ['Resistant variety', 'Rotation', 'Residue management']
              },
              {
                id: 'spot_blotch',
                name: 'Spot Blotch',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Dark brown spots without distinct halos'],
                causes: ['Warm, humid weather'],
                treatment: {
                  primary: ['Resistant/tolerant cultivars', 'Seed health management', 'Fungicide where registered and required'],
                  chemical: ['Locally approved systemic fungicides'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced N-P-K', 'Avoid severe nutrient stress', 'Soil-test-based correction']
                },
                management: ['Check temperature/humidity', 'Check plant nutrient status', 'Recommend disease control + nutrition support']
              },
              {
                id: 'powdery_mildew',
                name: 'Powdery Mildew',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['White, powdery fungal growth on leaves'],
                causes: ['High humidity', 'Dense canopy', 'High nitrogen'],
                treatment: {
                  primary: ['Monitor early', 'Avoid excessive canopy density', 'Apply registered fungicide when necessary'],
                  chemical: ['Triazole fungicides', 'Registered mildew-specific fungicide programs'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Avoid excessive nitrogen', 'Maintain balanced crop nutrition']
                },
                management: ['Resistant cultivar', 'Appropriate nitrogen management']
              }
            ]
          },
          {
            id: 'head',
            title: 'Head Diseases',
            problems: [
              {
                id: 'fusarium_head',
                name: 'Fusarium Head Blight',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Bleached spikelets', 'Pinkish fungal growth on heads'],
                causes: ['Rain during flowering'],
                treatment: {
                  primary: ['Fungicide timing around flowering is critical', 'Use integrated management', 'Manage grain contamination risk'],
                  chemical: ['Prothioconazole-based products where registered', 'Tebuconazole-based products where registered'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Do not apply fertilizer as FHB cure', 'Maintain balanced nutrient program']
                },
                management: ['Resistant variety', 'Crop rotation', 'Manage infected crop residue']
              },
              {
                id: 'wheat_blast',
                name: 'Wheat Blast',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Completely bleached heads', 'Dark lesions on rachis'],
                causes: ['High heat and humidity'],
                treatment: {
                  primary: ['Resistant seed/variety where available', 'Official regional alerts', 'Registered fungicide programs only'],
                  chemical: ['Depends strongly on country registration and resistance status'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced nutrition only; fertilizer does not cure blast']
                },
                management: []
              },
              {
                id: 'glume_blotch',
                name: 'Glume Blotch',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Brown/black lesions on glumes'],
                causes: ['Wet weather'],
                treatment: {
                  primary: ['Resistant cultivar where available', 'Seed and residue management', 'Registered fungicide if justified'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced soil-test-based nutrition']
                },
                management: ['Rotation', 'Crop sanitation']
              }
            ]
          },
          {
            id: 'root',
            title: 'Root Diseases',
            problems: [
              {
                id: 'common_root_rot',
                name: 'Common Root Rot',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Brown lesions on roots and subcrown internodes', 'Stunted plants'],
                causes: ['Fungal pathogens in soil'],
                treatment: {
                  primary: ['Seed treatment where appropriate', 'Reduce plant stress', 'Improve crop rotation'],
                  chemical: ['Registered seed-treatment fungicide only'],
                },
                fertilizer: {
                  status: 'Possible',
                  recommendation: ['Soil test', 'Correct phosphorus deficiency where confirmed', 'Balanced nutrition for root development']
                },
                management: ['Avoid compaction', 'Improve drainage']
              },
              {
                id: 'take_all',
                name: 'Take-all',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Blackened roots', 'White heads', 'Stunted growth patches'],
                causes: ['Soil-borne fungus', 'Continuous wheat'],
                treatment: {
                  primary: ['Crop rotation is important', 'Avoid continuous wheat', 'Improve soil/root environment'],
                  chemical: ['No universal curative foliar fertilizer or chemical solution'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Base fertilizer plan on soil testing', 'Avoid unbalanced nutrient application']
                },
                management: ['Rotation', 'Root health improvement']
              }
            ]
          },
          {
            id: 'smut',
            title: 'Smut / Bunt Diseases',
            problems: [
              {
                id: 'common_bunt',
                name: 'Common Bunt',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Grains replaced by black spore masses (bunt balls)', 'Fishy odor'],
                causes: ['Seed-borne or soil-borne spores'],
                treatment: {
                  primary: ['Fungicide-treated certified seed'],
                  chemical: ['Registered seed-treatment fungicide'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['No fertilizer cures established bunt infection']
                },
                management: []
              },
              {
                id: 'loose_smut',
                name: 'Loose Smut',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Heads emerge as black powdery masses'],
                causes: ['Internally seed-borne fungus'],
                treatment: {
                  primary: ['Use certified disease-free seed'],
                  chemical: ['Appropriate systemic seed treatment'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Normal balanced nutrient management']
                },
                management: []
              }
            ]
          }
        ]
      },
      {
        id: 'bacterial',
        title: 'Bacterial Diseases',
        groups: [
          {
            id: 'bacterial_group',
            title: 'Bacterial Diseases',
            problems: [
              {
                id: 'bacterial_leaf_streak',
                name: 'Bacterial Leaf Streak',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Water-soaked streaks on leaves', 'Exudate (ooze) may form'],
                causes: ['Xanthomonas bacteria', 'Warm, wet weather'],
                treatment: {
                  primary: ['Resistant varieties where available', 'Clean seed', 'Reduce conditions favoring disease spread'],
                  chemical: ['No universal curative field treatment'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Do not use extra fertilizer as bacterial disease cure', 'Maintain balanced nutrition']
                },
                management: []
              },
              {
                id: 'black_chaff',
                name: 'Black Chaff',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Dark streaks on glumes'],
                causes: ['Bacterial infection'],
                treatment: {
                  primary: [],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Soil-test-based balanced nutrition']
                },
                management: ['Clean seed', 'Resistant varieties', 'Crop hygiene']
              }
            ]
          }
        ]
      },
      {
        id: 'viral',
        title: 'Viral Diseases',
        groups: [
          {
            id: 'viral_group',
            title: 'Viral Diseases',
            problems: [
              {
                id: 'wheat_streak_mosaic',
                name: 'Wheat Streak Mosaic',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Yellow streaks and mottling on leaves', 'Stunting'],
                causes: ['Transmitted by wheat curl mite'],
                treatment: {
                  primary: ['Control wheat curl mite risk', 'Eliminate volunteer wheat before planting', 'Use resistant varieties where available'],
                  chemical: ['No fertilizer or fungicide cures the virus'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Maintain balanced nutrition but do not promise recovery']
                },
                management: []
              },
              {
                id: 'barley_yellow_dwarf',
                name: 'Barley Yellow Dwarf',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Yellowing or reddening of leaf tips', 'Stunted plants'],
                causes: ['Transmitted by aphids'],
                treatment: {
                  primary: ['Manage aphid vectors', 'Adjust planting strategy according to local guidance', 'Use tolerant varieties where available'],
                  chemical: ['No curative fertilizer or fungicide treatment'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced nutrition only as crop support']
                },
                management: ['Aphid risk monitoring']
              },
              {
                id: 'soil_borne_mosaic',
                name: 'Soil-borne Wheat Mosaic',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Mottled yellowing', 'Stunting'],
                causes: ['Soil-borne virus vector'],
                treatment: {
                  primary: ['Resistant varieties', 'Field/site management'],
                  chemical: ['No universal curative fertilizer treatment'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: []
                },
                management: ['Confirm diagnosis', 'Use resistant cultivar', 'Avoid claiming nutrient deficiency without testing']
              }
            ]
          }
        ]
      }
    ]
  },
  pests: {
    id: 'pests',
    title: 'Insect Pests',
    description: 'Common insects, mites, and soil pests affecting wheat.',
    subcategories: [
      {
        id: 'sucking',
        title: 'Sucking Pests',
        groups: [
          {
            id: 'aphids',
            title: 'Aphids',
            problems: [
              {
                id: 'english_grain_aphid',
                name: 'English Grain Aphid',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Small green/brown insects clustered on wheat heads or leaves', 'Honeydew stickiness'],
                causes: ['Warm, dry weather conditions favoring aphid multiplication'],
                treatment: {
                  primary: ['Scout fields regularly', 'Check economic threshold before spraying', 'Preserve natural enemies (ladybugs, wasps)'],
                  chemical: ['Registered systemic or contact insecticides', 'Seed treatments for early protection'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Avoid excessive nitrogen (makes plants succulent and attractive to aphids)', 'Ensure balanced nutrition for recovery']
                },
                management: ['Plant at optimal time', 'Encourage beneficial insects'],
                engineOutput: []
              },
              {
                id: 'greenbug',
                name: 'Greenbug',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Yellow or red spots on leaves where feeding occurred', 'Stunted growth', 'Pale green aphids with dark stripe'],
                causes: ['Vector for Barley Yellow Dwarf Virus (BYDV)', 'Favorable weather'],
                treatment: {
                  primary: ['Monitor early in the season', 'Use resistant varieties if available', 'Apply insecticide only if threshold is reached'],
                  chemical: ['Approved foliar insecticides'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Fertilizer does not kill bugs', 'Excess nitrogen may increase greenbug populations']
                },
                management: ['Destroy volunteer wheat', 'Monitor for virus symptoms']
              }
            ]
          }
        ]
      },
      {
        id: 'mites',
        title: 'Mite Pests',
        groups: [
          {
            id: 'mites_group',
            title: 'Mites',
            problems: [
              {
                id: 'wheat_curl_mite',
                name: 'Wheat Curl Mite',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Leaves remain tightly rolled/curled', 'Trapped emerging leaves', 'Yellow streaking (due to Wheat Streak Mosaic Virus)'],
                causes: ['Microscopic mites blown by wind from volunteer wheat'],
                treatment: {
                  primary: ['Primary threat is the virus they carry', 'Chemical control of mites is generally ineffective and not recommended'],
                  chemical: ['Miticides are rarely economical or effective for this specific pest'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Nutrients cannot cure the mite damage or the virus']
                },
                management: ['Destroy volunteer wheat at least 2 weeks before planting', 'Plant resistant varieties', 'Delay fall planting']
              }
            ]
          }
        ]
      },
      {
        id: 'chewing',
        title: 'Chewing Pests',
        groups: [
          {
            id: 'chewing_group',
            title: 'Caterpillars & Worms',
            problems: [
              {
                id: 'armyworm',
                name: 'Armyworm',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Chewed leaf margins', 'Stripped leaves leaving only the midrib', 'Head clipping in severe cases'],
                causes: ['Moth migration and egg laying in dense canopy'],
                treatment: {
                  primary: ['Scout for larvae in the lower canopy/soil debris', 'Treat when larvae are small (less than 1 inch)'],
                  chemical: ['Registered foliar insecticides when threshold is exceeded'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Standard nutrient program']
                },
                management: ['Monitor flights', 'Natural predators often control populations']
              },
              {
                id: 'cutworm',
                name: 'Cutworm',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Seedlings cut off at or just below soil surface', 'Bare patches in field'],
                causes: ['Larvae hiding in soil during day, feeding at night'],
                treatment: {
                  primary: ['Check for cut plants and dig around base for larvae', 'Spot treatment or field-wide if threshold met'],
                  chemical: ['Insecticide seed treatments', 'Foliar rescue treatments applied late in the day'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Fertilizer will not prevent cutting']
                },
                management: ['Weed control before planting (removes egg-laying sites)']
              }
            ]
          }
        ]
      },
      {
        id: 'stem',
        title: 'Stem Pests',
        groups: [
          {
            id: 'stem_group',
            title: 'Stem Borers & Sawflies',
            problems: [
              {
                id: 'wheat_stem_sawfly',
                name: 'Wheat Stem Sawfly',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Lodging (stems breaking near the ground)', 'Sawdust-like frass inside stems', 'White heads'],
                causes: ['Larvae tunneling inside the stem'],
                treatment: {
                  primary: ['Use solid-stemmed wheat varieties', 'Chemical control is highly ineffective because larvae are protected inside stem'],
                  chemical: ['Insecticides are generally not recommended or effective'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Balanced nutrition helps standability but doesn\'t stop the insect']
                },
                management: ['Swath heavily infested fields early to save grain', 'Crop rotation', 'Tillage to expose larvae']
              },
              {
                id: 'stem_borer',
                name: 'Stem Borer',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Whiteheads (dead heads)', 'Entrance holes on stems', 'Hollowed stems'],
                causes: ['Moth larvae boring into stems'],
                treatment: {
                  primary: ['Cultural control is most important', 'Chemical control is difficult once inside'],
                  chemical: ['Systemic seed treatments or early foliar sprays (timing is critical)'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Promote strong stems with adequate potassium, but it is not a cure']
                },
                management: ['Stubble destruction', 'Crop rotation']
              }
            ]
          }
        ]
      },
      {
        id: 'soil_root',
        title: 'Soil / Root Pests',
        groups: [
          {
            id: 'soil_group',
            title: 'Soil-Dwelling Insects',
            problems: [
              {
                id: 'wireworms',
                name: 'Wireworms',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Hollowed out seeds', 'Dead or wilted seedlings', 'Thin stands'],
                causes: ['Hard, yellowish wire-like larvae in soil (click beetle larvae)'],
                treatment: {
                  primary: ['No rescue treatments exist once damage occurs', 'Prevention is key'],
                  chemical: ['Insecticidal seed treatments are the only effective chemical control'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Good fertility promotes rapid early growth to outgrow damage window']
                },
                management: ['Crop rotation', 'Seedbed preparation']
              },
              {
                id: 'white_grubs',
                name: 'White Grubs',
                image: '/images/problems/insects.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Stunted, yellowing, or dying seedlings', 'Roots pruned or eaten away'],
                causes: ['C-shaped white larvae in soil (scarab beetle larvae)'],
                treatment: {
                  primary: ['Preventative seed treatments'],
                  chemical: ['Seed treatments'],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: ['Maintain good soil fertility']
                },
                management: ['Avoid planting wheat immediately after long-term pasture']
              }
            ]
          }
        ]
      }
    ]
  },
  nematodes: {
    id: 'nematodes',
    title: 'Nematode Problems',
    description: 'Microscopic worms affecting wheat roots and limiting water/nutrient uptake.',
    subcategories: [
      {
        id: 'root_lesion',
        title: 'Root-Lesion Nematodes',
        groups: [
          {
            id: 'root_lesion_group',
            title: 'Root-Lesion Nematodes',
            problems: [
              {
                id: 'root_lesion_nematode',
                name: 'Root-Lesion Nematodes (Pratylenchus spp.)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Stunted growth & poor vigor', 'Yellowing / chlorosis', 'Patchy field appearance', 'Brown/dark root lesions', 'Reduced feeder roots'],
                causes: ['Root infection by plant-parasitic Pratylenchus spp.', 'Infested soil & susceptible crop history', 'Continuous cereal production'],
                treatment: {
                  primary: ['Confirm before treatment (do not assume nutrient deficiency only)', 'Reduce additional crop stress', 'Review crop history for host crops'],
                  chemical: ['Nematicide management (only legally registered products, country-specific)', 'Biological management (research-supported products)'],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: ['Fertilizer does not eliminate nematodes', 'Apply Nitrogen according to soil test', 'Correct confirmed Phosphorus deficiency to support root development', 'Maintain balanced nutrition for crop recovery']
                },
                management: ['Crop rotation planning', 'Use resistant/tolerant cultivars', 'Weed host management', 'Field hygiene to avoid moving infested soil'],
                engineOutput: ['Primary Action: Confirm nematode diagnosis via lab', 'Fertilizer Action: Support root development post-soil test']
              }
            ]
          }
        ]
      },
      {
        id: 'cereal_cyst',
        title: 'Cereal Cyst Nematodes',
        groups: [
          {
            id: 'cereal_cyst_group',
            title: 'Cereal Cyst Nematodes',
            problems: [
              {
                id: 'cereal_cyst_nematode',
                name: 'Cereal Cyst Nematodes (Heterodera spp.)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Patchy growth and poor vigor', 'Stunting and chlorosis', 'Premature crop decline', 'Reduced and abnormal root development', 'Visible cysts on roots in some cases'],
                causes: ['Root infection by cereal cyst nematodes', 'Continuous cereal cropping', 'Infested soil', 'Cyst survival in soil'],
                treatment: {
                  primary: ['Confirm nematode problem via soil sampling', 'Avoid incorrect fertilizer-only treatment', 'Use non-host crops for rotation'],
                  chemical: ['Chemical / Nematicide Management (only approved products, follow label)'],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: ['Fertilizer cannot remove established nematode infestation', 'Correct confirmed Phosphorus deficiency for root development', 'Balanced Nitrogen management', 'Micronutrient correction only if confirmed']
                },
                management: ['Resistant Cultivars', 'Crop Rotation', 'Equipment Cleaning', 'Host Weed Management'],
                engineOutput: ['Primary Action: Nematode extraction and cyst identification', 'Chemical Action: Registered nematicides only']
              }
            ]
          }
        ]
      }
    ]
  },
  nutrient: {
    id: 'nutrient',
    title: 'Nutrient Deficiency',
    description: 'Imbalances or shortages of essential elements required for wheat growth.',
    subcategories: [
      {
        id: 'primary_macro',
        title: 'Primary Macronutrients',
        groups: [
          {
            id: 'macro_group',
            title: 'Primary Macronutrients',
            problems: [
              {
                id: 'nitrogen_def',
                name: 'Nitrogen Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Older leaves become pale green',
                  'Yellowing begins on older leaves and progresses toward younger leaves',
                  'Reduced tillering',
                  'Slow and stunted growth',
                  'Lower biomass and yield potential'
                ],
                causes: [
                  'Low available soil nitrogen',
                  'Insufficient fertilizer application',
                  'Nitrogen leaching',
                  'Nitrogen loss through volatilization',
                  'Waterlogging-related nitrogen loss',
                  'Cold soil reducing nutrient uptake',
                  'Poor root development'
                ],
                treatment: {
                  primary: [
                    'Check growth stage, soil test nitrogen, soil moisture, and pH',
                    'Calculate site-specific requirement',
                    'Apply via basal application, split application, or top-dressing according to local agronomics'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'Urea',
                    'Ammonium Sulfate',
                    'UAN solutions',
                    'Calcium Ammonium Nitrate',
                    'Other locally registered nitrogen sources'
                  ]
                },
                management: [
                  'Avoid excessive nitrogen (increases lodging and disease risk)',
                  'Do not recommend solely from leaf image'
                ],
                engineOutput: ['AI leaf prediction', 'Soil nitrogen value', 'Soil moisture', 'Soil pH', 'Temperature', 'Crop growth stage']
              },
              {
                id: 'phosphorus_def',
                name: 'Phosphorus Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Slow early growth and stunted plants',
                  'Poor root development and reduced tillering',
                  'Dark green foliage',
                  'Purpling may occur in some conditions'
                ],
                causes: [
                  'Low available soil phosphorus',
                  'High or low soil pH',
                  'Cold soil',
                  'Poor root development',
                  'Phosphorus fixation in soil'
                ],
                treatment: {
                  primary: [
                    'Check soil phosphorus test, pH, crop stage, and temperature',
                    'Determine phosphorus availability',
                    'Prefer placement near root zone (important at early stages)'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'DAP',
                    'MAP',
                    'Triple Superphosphate',
                    'Single Superphosphate',
                    'Other locally suitable phosphorus fertilizers'
                  ]
                },
                management: [
                  'More fertilizer does not always mean more uptake',
                  'High or low pH can reduce availability',
                  'Correct soil conditions when required'
                ],
                engineOutput: ['AI prediction', 'Soil phosphorus', 'Soil pH', 'Temperature', 'Soil moisture', 'Growth stage']
              },
              {
                id: 'potassium_def',
                name: 'Potassium Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Older leaf symptoms',
                  'Yellowing near leaf margins',
                  'Leaf edge scorch or necrosis',
                  'Weak stems',
                  'Reduced stress tolerance',
                  'Poor grain development'
                ],
                causes: [
                  'Low available soil potassium',
                  'Sandy or leached soils',
                  'Poor root growth',
                  'Nutrient imbalance',
                  'High nutrient demand'
                ],
                treatment: {
                  primary: [
                    'Check soil potassium, texture, moisture, root condition, and crop stage',
                    'Base recommendation on soil testing',
                    'Select source according to soil conditions'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'MOP / Potassium Chloride',
                    'SOP / Potassium Sulfate',
                    'Other locally registered potassium sources'
                  ]
                },
                management: [
                  'Avoid unnecessary over-application'
                ],
                engineOutput: ['AI prediction', 'Soil potassium', 'Soil moisture', 'Soil texture', 'pH', 'Growth stage']
              }
            ]
          }
        ]
      },
      {
        id: 'secondary_macro',
        title: 'Secondary Macronutrients',
        groups: [
          {
            id: 'secondary_macro_group',
            title: 'Secondary Macronutrients',
            problems: [
              {
                id: 'sulfur_def',
                name: 'Sulfur Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Yellowing often on younger leaves',
                  'Uniform chlorosis',
                  'Reduced growth',
                  'Reduced protein development'
                ],
                causes: [
                  'Low sulfur soil supply',
                  'Sandy soil',
                  'Low organic matter',
                  'Sulfur leaching'
                ],
                treatment: {
                  primary: ['Evaluate soil sulfur, organic matter, rainfall, and growth stage'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'Ammonium Sulfate',
                    'Gypsum',
                    'Sulfate-containing fertilizers',
                    'Elemental sulfur where appropriate'
                  ]
                },
                management: []
              },
              {
                id: 'calcium_def',
                name: 'Calcium Deficiency',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Poor root development',
                  'Weak plant tissue',
                  'Reduced growth'
                ],
                causes: [
                  'Low calcium availability',
                  'Acidic soil',
                  'Root damage'
                ],
                treatment: {
                  primary: ['Evaluate soil pH, soil calcium, and root condition'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'Agricultural lime where pH correction is required',
                    'Gypsum where suitable',
                    'Other soil-test-based calcium sources'
                  ]
                },
                management: []
              },
              {
                id: 'magnesium_def',
                name: 'Magnesium Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Interveinal chlorosis',
                  'Older leaves affected first',
                  'Reduced photosynthetic performance'
                ],
                causes: [
                  'Low magnesium availability',
                  'Acidic soil',
                  'Nutrient competition'
                ],
                treatment: {
                  primary: ['Evaluate soil magnesium, pH, and competing nutrient levels'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'Magnesium sulfate',
                    'Dolomitic lime',
                    'Other locally suitable magnesium fertilizers'
                  ]
                },
                management: []
              }
            ]
          }
        ]
      },
      {
        id: 'micro_nutrients',
        title: 'Micronutrients',
        groups: [
          {
            id: 'micro_group',
            title: 'Micronutrients',
            problems: [
              {
                id: 'zinc_def',
                name: 'Zinc Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Stunted growth', 'Chlorosis', 'Poor tillering', 'Reduced root development'],
                causes: ['High pH', 'High phosphorus interactions', 'Low soil zinc'],
                treatment: {
                  primary: ['Evaluate soil zinc, pH, and phosphorus status'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Zinc sulfate', 'Chelated zinc', 'Locally registered zinc fertilizers']
                },
                management: []
              },
              {
                id: 'iron_def',
                name: 'Iron Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Interveinal chlorosis', 'Young leaves often affected'],
                causes: ['High pH', 'Alkaline soil', 'Low iron availability'],
                treatment: {
                  primary: ['Evaluate soil pH and iron status'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Iron sulfate', 'Chelated iron where appropriate']
                },
                management: []
              },
              {
                id: 'manganese_def',
                name: 'Manganese Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Chlorosis', 'Speckling', 'Reduced growth'],
                causes: ['High soil pH', 'Low manganese availability'],
                treatment: {
                  primary: ['Evaluate soil pH and soil manganese'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Manganese sulfate', 'Registered manganese fertilizers']
                },
                management: []
              },
              {
                id: 'boron_def',
                name: 'Boron Deficiency',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Poor reproductive development', 'Weak growing tissues'],
                causes: ['Low boron availability', 'Dry soil conditions'],
                treatment: {
                  primary: ['Evaluate soil boron and soil moisture'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Borate fertilizers', 'Other registered boron products']
                },
                management: ['Warning: Narrow margin between deficiency and toxicity']
              },
              {
                id: 'copper_def',
                name: 'Copper Deficiency',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Reduced growth', 'Weak stems', 'Poor reproductive development'],
                causes: ['Low soil copper', 'High organic matter conditions'],
                treatment: {
                  primary: ['Evaluate soil copper and soil organic matter'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Copper sulfate', 'Registered copper fertilizers']
                },
                management: []
              },
              {
                id: 'molybdenum_def',
                name: 'Molybdenum Deficiency',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: ['Chlorosis', 'Reduced nitrogen metabolism'],
                causes: ['Acidic soil', 'Low molybdenum availability'],
                treatment: {
                  primary: ['Evaluate soil pH and soil molybdenum'],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: ['Sodium molybdate', 'Other registered molybdenum sources']
                },
                management: []
              }
            ]
          }
        ]
      }
    ]
  },
  toxicity: {
    id: 'toxicity',
    title: 'Nutrient Excess / Toxicity',
    description: 'Over-application of fertilizers or high natural concentrations causing crop damage.',
    subcategories: [
      {
        id: 'nutrient_excess',
        title: 'Nutrient Excess & Toxicity',
        groups: [
          {
            id: 'macro_micro_excess',
            title: 'Macronutrient & Micronutrient Excess',
            problems: [
              {
                id: 'nitrogen_excess',
                name: 'Nitrogen Excess',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Very dark green leaves',
                  'Excessive vegetative canopy growth',
                  'Soft and succulent plant tissue',
                  'Weak stems and increased lodging risk',
                  'Delayed maturity'
                ],
                causes: [
                  'Excess nitrogen fertilizer application',
                  'Incorrect fertilizer dose calculation or split application',
                  'Excessive manure / organic nutrient input',
                  'Previous nitrogen-rich crop'
                ],
                treatment: {
                  primary: [
                    'Stop unnecessary nitrogen application',
                    'Review remaining fertilizer schedule',
                    'Monitor crop growth, lodging risk, and disease development'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Nitrogen fertilizer = HOLD / REDUCE',
                    'Do not recommend urea or ammonium automatically',
                    'Recalculate remaining nutrient requirement'
                  ]
                },
                management: [
                  'Manage irrigation carefully',
                  'Do not add more nitrogen from image symptoms alone'
                ],
                engineOutput: ['Confirm excess probability', 'Check nitrogen application history', 'Decide: HOLD / REDUCE / NORMAL']
              },
              {
                id: 'boron_toxicity',
                name: 'Boron Toxicity',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf tip injury and margin necrosis',
                  'Yellowing followed by tissue damage',
                  'Reduced growth'
                ],
                causes: [
                  'Excess boron fertilizer',
                  'High natural soil boron',
                  'Boron-rich irrigation water',
                  'Incorrect micronutrient dosage'
                ],
                treatment: {
                  primary: [
                    'Stop additional boron application',
                    'Investigate soil and irrigation water',
                    'Improve water management where appropriate'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Boron fertilizer = STOP',
                    'Do not apply corrective boron without testing'
                  ]
                },
                management: [
                  'Warning: Boron has a very narrow safety margin between deficiency and toxicity'
                ],
                engineOutput: ['Soil boron', 'Water boron data', 'Fertilizer history']
              },
              {
                id: 'manganese_toxicity',
                name: 'Manganese Toxicity',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf spotting and dark tissue damage',
                  'Chlorosis in affected tissue',
                  'Reduced root growth'
                ],
                causes: [
                  'Excess available manganese',
                  'Strongly acidic soil (Low pH)',
                  'Waterlogged conditions changing availability',
                  'Excess manganese fertilizer'
                ],
                treatment: {
                  primary: [
                    'Stop unnecessary manganese application',
                    'Improve drainage if required',
                    'Correct strongly acidic soil'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: [
                    'Manganese fertilizer = HOLD',
                    'pH correction may be considered after testing'
                  ]
                },
                management: ['Do not alter pH without soil analysis'],
                engineOutput: ['Manganese toxicity likely', 'Acidic-soil-related availability likely']
              },
              {
                id: 'iron_toxicity',
                name: 'Iron Toxicity',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Bronzing or dark spotting may occur',
                  'Leaf tissue damage',
                  'Reduced root performance and plant growth'
                ],
                causes: [
                  'Excess available iron',
                  'Poor drainage and saturated soil conditions',
                  'Reduced soil conditions',
                  'Incorrect micronutrient application'
                ],
                treatment: {
                  primary: [
                    'Stop unnecessary iron fertilizer',
                    'Improve drainage where required',
                    'Reduce prolonged water saturation'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Iron fertilizer = HOLD',
                    'Treat root-zone cause rather than adding fertilizer'
                  ]
                },
                management: ['Investigate root-zone conditions'],
                engineOutput: ['Soil iron', 'Soil pH', 'Soil moisture', 'Drainage condition']
              }
            ]
          },
          {
            id: 'salt_sodium_toxicity',
            title: 'Salinity & Sodium Toxicity',
            problems: [
              {
                id: 'salinity',
                name: 'Salinity (High Soluble Salts)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Poor germination and slow emergence',
                  'Stunted growth and reduced tillering',
                  'Leaf tip burn and margin scorch',
                  'Severe cases may cause plant death'
                ],
                causes: [
                  'High soluble salts in soil',
                  'Saline irrigation water',
                  'Excess fertilizer application',
                  'Poor drainage and high evaporation'
                ],
                treatment: {
                  primary: [
                    'Avoid unnecessary fertilizer application',
                    'Improve drainage and manage salt accumulation',
                    'Review irrigation water quality',
                    'Follow site-specific leaching requirements'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Pause unnecessary fertilizer input',
                    'Do not apply additional salt-loading fertilizers blindly',
                    'Base recommendation on soil EC and nutrient need'
                  ]
                },
                management: [
                  'Test irrigation water',
                  'Salinity should not automatically be treated as a simple nutrient deficiency'
                ],
                engineOutput: ['Soil EC', 'Irrigation water EC', 'Drainage status']
              },
              {
                id: 'sodium_toxicity',
                name: 'Sodium Toxicity (Sodicity)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Poor growth and leaf scorch',
                  'Reduced emergence and poor root development',
                  'Soil structure deterioration',
                  'Reduced water infiltration'
                ],
                causes: [
                  'High sodium soil (Sodic soil)',
                  'Sodium-rich irrigation water',
                  'Poor drainage and salt accumulation'
                ],
                treatment: {
                  primary: [
                    'Stop unnecessary sodium input',
                    'Improve drainage and restore soil structure',
                    'Assess Calcium amendments (e.g. Gypsum) where analysis supports it',
                    'Leaching where appropriate'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: [
                    'Do not add unnecessary fertilizer',
                    'Correct sodium-related soil problem first',
                    'Reassess nutrient availability after correction'
                  ]
                },
                management: ['Investigate irrigation water quality'],
                engineOutput: ['Sodicity probability', 'Recommend soil-analysis-based correction']
              }
            ]
          }
        ]
      }
    ]
  },
  water: {
    id: 'water',
    title: 'Water Problems',
    description: 'Issues related to water deficit, waterlogging, and poor drainage.',
    subcategories: [
      {
        id: 'water_deficit',
        title: 'Water Deficit',
        groups: [
          {
            id: 'drought_moisture',
            title: 'Drought & Moisture Stress',
            problems: [
              {
                id: 'drought_stress',
                name: 'Drought Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf rolling',
                  'Wilting',
                  'Stunted growth',
                  'Reduced tillering',
                  'Poor grain filling'
                ],
                causes: [
                  'Low soil moisture',
                  'Low rainfall',
                  'Insufficient irrigation',
                  'High temperature',
                  'High evaporation'
                ],
                treatment: {
                  primary: [
                    'Restore soil moisture',
                    'Prioritize critical growth stages',
                    'Optimize irrigation'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Avoid heavy fertilizer on severely dry soil',
                    'Reassess nutrients after recovery',
                    'Use soil-test-based application'
                  ]
                },
                management: [],
                engineOutput: ['Check soil moisture', 'Check weather data']
              },
              {
                id: 'moisture_stress',
                name: 'Moisture Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Mild leaf rolling during peak heat',
                  'Slower growth rate',
                  'Reduced crop vigor'
                ],
                causes: [
                  'Inadequate irrigation scheduling',
                  'Uneven field moisture',
                  'Dry spells'
                ],
                treatment: {
                  primary: [
                    'Adjust irrigation schedule',
                    'Ensure even water distribution across field',
                    'Monitor soil moisture sensors'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not apply fertilizer to stressed plants without water',
                    'Ensure moisture is adequate before nutrient application'
                  ]
                },
                management: [],
                engineOutput: ['Check irrigation logs', 'Check soil moisture sensors']
              }
            ]
          }
        ]
      },
      {
        id: 'excess_water',
        title: 'Excess Water',
        groups: [
          {
            id: 'waterlogging_flooding',
            title: 'Waterlogging & Flooding',
            problems: [
              {
                id: 'waterlogging',
                name: 'Waterlogging',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Yellowing',
                  'Stunting',
                  'Reduced tillering',
                  'Root damage'
                ],
                causes: [
                  'Excess soil moisture',
                  'Saturated soil',
                  'Heavy rainfall',
                  'Poor drainage'
                ],
                treatment: {
                  primary: [
                    'Stop excess irrigation',
                    'Remove standing water',
                    'Improve drainage'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not apply automatically during active waterlogging',
                    'Allow root-zone recovery',
                    'Reassess nutrients after recovery'
                  ]
                },
                management: [],
                engineOutput: ['Check soil moisture (saturation)', 'Evaluate field slope']
              },
              {
                id: 'flood_stress',
                name: 'Flood Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Standing water',
                  'Lodging',
                  'Root stress',
                  'Plant damage'
                ],
                causes: [
                  'Severe rainfall events',
                  'Overflowing water sources',
                  'Extreme drainage failure'
                ],
                treatment: {
                  primary: [
                    'Remove water immediately',
                    'Assess crop survival',
                    'Check erosion',
                    'Monitor for disease'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: [
                    'Do not blindly apply fertilizer',
                    'Assess nutrient loss (leaching) post-flood',
                    'Correct after testing'
                  ]
                },
                management: [],
                engineOutput: ['Evaluate extent of flooding', 'Check weather forecasts']
              },
              {
                id: 'poor_drainage',
                name: 'Poor Drainage',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Persistent wet spots in field',
                  'Uneven crop growth',
                  'Localized yellowing'
                ],
                causes: [
                  'Soil compaction',
                  'Hardpan',
                  'Heavy clay soil',
                  'Poor slope',
                  'Blocked drainage systems'
                ],
                treatment: {
                  primary: [
                    'Improve drainage infrastructure',
                    'Reduce excess irrigation',
                    'Assess soil compaction',
                    'Improve root environment'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Correct drainage first',
                    'Then reassess nutrient availability',
                    'Use soil-test-based correction'
                  ]
                },
                management: [],
                engineOutput: ['Analyze field topography', 'Review soil compaction data']
              }
            ]
          }
        ]
      }
    ]
  },
  weather: {
    id: 'weather',
    title: 'Temperature & Weather Stress',
    description: 'Physical or physiological damage from extreme temperatures, wind, or hail.',
    subcategories: [
      {
        id: 'temperature_stress',
        title: 'Temperature Stress',
        groups: [
          {
            id: 'heat_stress_group',
            title: 'Heat Stress',
            problems: [
              {
                id: 'heat_stress',
                name: 'High Temperature Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf rolling or cupping',
                  'Premature leaf senescence (drying)',
                  'Slower growth rate'
                ],
                causes: [
                  'High ambient air temperature',
                  'High soil temperature',
                  'Prolonged heat wave'
                ],
                treatment: {
                  primary: [
                    'Optimize irrigation to maintain cooling through transpiration',
                    'Analyze crop stage for heat vulnerability'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Avoid heavy nitrogen application during peak heat stress',
                    'Ensure adequate potassium to improve stress tolerance (if deficient)'
                  ]
                },
                management: [],
                engineOutput: ['Sensor/Weather inputs (Temp)', 'Crop stage analysis']
              },
              {
                id: 'terminal_heat_stress',
                name: 'Terminal Heat Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Forced maturity',
                  'Shriveled grains',
                  'White heads (blasting)'
                ],
                causes: [
                  'High temperatures during heading, flowering, or grain filling',
                  'Hot dry winds (loo)'
                ],
                treatment: {
                  primary: [
                    'Maintain optimal soil moisture during grain fill',
                    'No direct corrective action once grain is shriveled'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Fertilizer will not reverse terminal heat damage',
                    'Avoid late nitrogen applications which may exacerbate stress'
                  ]
                },
                management: ['Use heat-tolerant varieties for future seasons'],
                engineOutput: ['Critical growth stage (Heading/Flowering/Grain Fill)', 'Temperature analysis']
              }
            ]
          },
          {
            id: 'cold_stress_group',
            title: 'Cold & Frost Stress',
            problems: [
              {
                id: 'frost_damage',
                name: 'Frost Damage (Freezing Injury)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Water-soaked dark green leaves turning brown',
                  'Stem splitting or blistering',
                  'Head trapping or empty white heads'
                ],
                causes: [
                  'Sub-zero temperatures during vulnerable stages',
                  'Cold air pooling in low field areas'
                ],
                treatment: {
                  primary: [
                    'Assess crop recovery 7-10 days after the frost event',
                    'Delay any immediate destructive action until damage is fully visible'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not apply fertilizer immediately to "heal" frost damage',
                    'Re-evaluate nutrient needs based on surviving tiller density'
                  ]
                },
                management: [],
                engineOutput: ['Frost duration analysis', 'Crop stage analysis']
              },
              {
                id: 'cold_stress',
                name: 'Low Temperature Stress',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Stunted or paused growth',
                  'Purpling of leaves (temporary phosphorus deficiency)',
                  'Yellowing of older leaves'
                ],
                causes: [
                  'Prolonged cold air/soil temperatures',
                  'Reduced root activity'
                ],
                treatment: {
                  primary: [
                    'Wait for soil to warm up',
                    'Assess nutrient uptake recovery post-cold snap'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Avoid applying large amounts of fertilizer to cold, inactive roots',
                    'Temporary nutrient deficiencies often self-correct as soils warm'
                  ]
                },
                management: [],
                engineOutput: ['Air/Soil temperature check', 'Exposure duration']
              }
            ]
          }
        ]
      },
      {
        id: 'physical_weather',
        title: 'Physical Weather Damage',
        groups: [
          {
            id: 'hail_wind_group',
            title: 'Hail & Wind Damage',
            problems: [
              {
                id: 'hail_damage',
                name: 'Hail Damage',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Torn, shredded, or bruised leaves',
                  'Broken stems',
                  'Shattered or detached heads'
                ],
                causes: [
                  'Severe hail storm event'
                ],
                treatment: {
                  primary: [
                    'Assess damage severity and crop survival (wait 3-5 days)',
                    'Monitor for opportunistic fungal diseases on wounds'
                  ],
                  chemical: [
                    'Consider preventative fungicide if disease risk is high (consult agronomist)'
                  ],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not blindly fertilize damaged plants',
                    'Adjust future nutrient inputs based on the remaining viable yield potential'
                  ]
                },
                management: [],
                engineOutput: ['Weather event data', 'Damage severity assessment']
              },
              {
                id: 'wind_damage',
                name: 'Wind Damage',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Lodging (plants falling over)',
                  'Stem breakage or kinking',
                  'Root lodging (plants uprooted)'
                ],
                causes: [
                  'High wind speeds (often with heavy rain)',
                  'Overly dense canopies',
                  'Excessive early nitrogen causing weak stems'
                ],
                treatment: {
                  primary: [
                    'Assess lodging type (root vs stem)',
                    'Evaluate if crop can partially stand back up (goose-necking)'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Fertilizer cannot correct wind damage',
                    'Avoid excessive Nitrogen in future to reduce lodging risk'
                  ]
                },
                management: [],
                engineOutput: ['Wind event analysis', 'Stem damage assessment']
              }
            ]
          }
        ]
      }
    ]
  },
  soil: {
    id: 'soil',
    title: 'Soil Problems',
    description: 'Physical, chemical, and root environment issues that restrict plant growth and nutrient uptake.',
    subcategories: [
      {
        id: 'physical_problems',
        title: 'Physical Problems',
        groups: [
          {
            id: 'compaction_group',
            title: 'Soil Compaction & Hardpan',
            problems: [
              {
                id: 'soil_compaction',
                name: 'Soil Compaction',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Stunted plant growth',
                  'Shallow or horizontal root growth',
                  'Poor water infiltration'
                ],
                causes: [
                  'Heavy machinery traffic (especially on wet soil)',
                  'Lack of deep-rooted cover crops'
                ],
                treatment: {
                  primary: [
                    'Perform penetrometer test to identify compaction severity',
                    'Implement deep tillage / subsoiling where appropriate',
                    'Incorporate cover crops with deep taproots'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not apply extra fertilizer expecting to fix compaction',
                    'Address soil structure first before increasing nutrient load'
                  ]
                },
                management: [],
                engineOutput: ['Check field traffic history', 'Soil penetrometer data']
              },
              {
                id: 'hardpan',
                name: 'Hardpan',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Roots turning 90 degrees at a specific depth',
                  'Water pooling on the surface',
                  'Early drought stress'
                ],
                causes: [
                  'Repeated plowing at the same depth',
                  'Natural clay accumulation'
                ],
                treatment: {
                  primary: [
                    'Identify depth of hardpan',
                    'Subsoiling below the pan depth'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: [
                    'Adjust nutrient placement (banding below or above pan if unbroken)',
                    'Long-term fix requires mechanical breakage'
                  ]
                },
                management: [],
                engineOutput: ['Soil depth analysis']
              },
              {
                id: 'poor_root_penetration',
                name: 'Poor Root Penetration',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Easily pulled plants',
                  'Nutrient deficiency symptoms despite fertilization'
                ],
                causes: [
                  'Compaction',
                  'High EC (salts)',
                  'Extreme pH'
                ],
                treatment: {
                  primary: [
                    'Identify root cause (pH, EC, moisture, or compaction)',
                    'Treat specific soil constraint'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Reassess nutrients only after soil constraint is removed'
                  ]
                },
                management: [],
                engineOutput: ['pH Check', 'EC Check', 'Moisture Check']
              }
            ]
          }
        ]
      },
      {
        id: 'chemical_problems',
        title: 'Chemical Problems',
        groups: [
          {
            id: 'ph_salinity_group',
            title: 'pH, Salinity & Sodicity',
            problems: [
              {
                id: 'low_ph',
                name: 'Low pH / Acidity',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Stunted roots (often club-like due to Aluminum toxicity)',
                  'Poor overall growth',
                  'Deficiencies in Phosphorus, Calcium, or Magnesium'
                ],
                causes: [
                  'Natural soil weathering',
                  'Long-term use of ammonium-based fertilizers'
                ],
                treatment: {
                  primary: [
                    'Apply Agricultural Lime based on soil buffer pH test',
                    'Monitor Aluminum risk'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Recommended',
                  recommendation: [
                    'Support with Phosphorus (often tied up in acid soils)',
                    'Avoid further acidifying fertilizers until pH is corrected'
                  ]
                },
                management: [],
                engineOutput: ['Soil pH data', 'Buffer pH test']
              },
              {
                id: 'high_ph',
                name: 'High pH / Alkalinity',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Interveinal chlorosis (Iron/Zinc deficiency)',
                  'Poor early vigor'
                ],
                causes: [
                  'Calcareous soils',
                  'High bicarbonates in irrigation water'
                ],
                treatment: {
                  primary: [
                    'Monitor micronutrient risks',
                    'Use acidifying amendments (elemental sulfur) if economically viable'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Soil Test Required',
                  recommendation: [
                    'Use chelated micronutrients (e.g. EDDHA Iron)',
                    'Banding Phosphorus instead of broadcasting'
                  ]
                },
                management: [],
                engineOutput: ['Soil pH Confirmation']
              },
              {
                id: 'soil_salinity',
                name: 'Salinity (Soil EC)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf margin scorch',
                  'Poor germination',
                  'White crust on soil surface'
                ],
                causes: [
                  'High evaporation',
                  'Saline irrigation water',
                  'Poor drainage'
                ],
                treatment: {
                  primary: [
                    'Improve drainage',
                    'Leach salts with high-quality water'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Manage fertilizer salt load (avoid high-salt index fertilizers)',
                    'Only apply nutrients if soil test indicates deficiency'
                  ]
                },
                management: [],
                engineOutput: ['EC Testing', 'Irrigation Water Check']
              },
              {
                id: 'soil_sodicity',
                name: 'Sodicity (High Sodium)',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Poor soil structure (crusting/sealing)',
                  'Water logging due to zero infiltration'
                ],
                causes: [
                  'High Exchangeable Sodium Percentage (ESP)'
                ],
                treatment: {
                  primary: [
                    'Evaluate and apply Gypsum',
                    'Improve drainage and water management'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Fertilizer will not fix sodicity',
                    'Address structure with calcium amendments first'
                  ]
                },
                management: [],
                engineOutput: ['Sodium Status (ESP)', 'Soil Structure Analysis']
              }
            ]
          }
        ]
      },
      {
        id: 'root_environment',
        title: 'Root Environment',
        groups: [
          {
            id: 'aeration_group',
            title: 'Aeration & Oxygen',
            problems: [
              {
                id: 'poor_aeration',
                name: 'Poor Aeration',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Yellowing plants',
                  'Shallow rooting'
                ],
                causes: [
                  'Compaction',
                  'High clay content without structure',
                  'Excessive root-zone moisture'
                ],
                treatment: {
                  primary: [
                    'Improve drainage',
                    'Alleviate compaction'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Reassess nutrients only after oxygen flow is restored'
                  ]
                },
                management: [],
                engineOutput: ['Root-Zone Moisture', 'Compaction Assessment']
              },
              {
                id: 'low_root_oxygen',
                name: 'Low Root Oxygen',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Nitrogen deficiency symptoms (yellowing) despite N application',
                  'Denitrification losses'
                ],
                causes: [
                  'Prolonged saturation / flooding'
                ],
                treatment: {
                  primary: [
                    'Drainage action (remove excess water)',
                    'Check for root damage risk and monitor recovery'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not confuse with simple Nitrogen deficiency; adding N to waterlogged soil causes loss',
                    'Apply foliar nutrients if rescue is needed, but fix water first'
                  ]
                },
                management: [],
                engineOutput: ['Excess Water Detection']
              }
            ]
          }
        ]
      }
    ]
  },
  chemical_damage: {
    id: 'chemical_damage',
    title: 'Chemical / Management Damage',
    description: 'Crop injury caused by improper application of herbicides, pesticides, or fertilizers.',
    subcategories: [
      {
        id: 'herbicide_pesticide',
        title: 'Herbicide & Pesticide Injury',
        groups: [
          {
            id: 'herbicide_group',
            title: 'Herbicide Issues',
            problems: [
              {
                id: 'herbicide_injury',
                name: 'Herbicide Injury',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Yellowing or Chlorosis',
                  'Leaf twisting and curling',
                  'Stunted growth',
                  'Burned leaf margins',
                  'Poor tillering'
                ],
                causes: [
                  'Wrong herbicide selection or excess rate',
                  'Wrong crop growth stage or spray timing',
                  'Temperature or water stress during application',
                  'Chemical interaction'
                ],
                treatment: {
                  primary: [
                    'Stop further application',
                    'Do not apply corrective chemicals immediately',
                    'Reduce additional plant stress and maintain proper soil moisture'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not automatically apply fertilizer',
                    'Avoid high-rate nitrogen during severe stress',
                    'Correct nutrients only when confirmed deficient by a soil test'
                  ]
                },
                management: [],
                engineOutput: ['Check application history', 'Check field pattern', 'Compare symptoms with nutrient deficiency']
              },
              {
                id: 'herbicide_drift',
                name: 'Herbicide Drift',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Field-edge damage with directional injury pattern',
                  'Leaf distortion, twisting, or cupping',
                  'Uneven chlorosis and growth suppression',
                  'Patchy plant death'
                ],
                causes: [
                  'Wind during spraying',
                  'Small spray droplets or high spray boom',
                  'Temperature inversion or volatilization',
                  'Nearby herbicide application'
                ],
                treatment: {
                  primary: [
                    'Stop exposure source',
                    'Avoid additional chemical stress',
                    'Evaluate crop stand before replanting decisions'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'No automatic fertilizer recommendation',
                    'Avoid fertilizer as a substitute for drift diagnosis'
                  ]
                },
                management: [],
                engineOutput: ['Damage concentrated on one side', 'Wind direction matches damage pattern']
              }
            ]
          },
          {
            id: 'pesticide_group',
            title: 'Pesticide Injury',
            problems: [
              {
                id: 'pesticide_injury',
                name: 'Pesticide Injury',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf burn',
                  'Chlorosis or necrosis',
                  'Leaf spotting',
                  'Wilting and stunted growth'
                ],
                causes: [
                  'Incorrect product or excess concentration',
                  'Incorrect tank mixing',
                  'Application under crop stress or high temperature',
                  'Poor spray-water quality'
                ],
                treatment: {
                  primary: [
                    'Stop suspected product',
                    'Check label compatibility and mixing records',
                    'Avoid repeated stress treatments'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'Do not apply fertilizer immediately for visual recovery',
                    'Test soil before correction'
                  ]
                },
                management: [],
                engineOutput: ['Check mixing records', 'Check weather data during spray']
              }
            ]
          }
        ]
      },
      {
        id: 'fertilizer_issues',
        title: 'Fertilizer Mismanagement',
        groups: [
          {
            id: 'fert_burn_group',
            title: 'Fertilizer Burn & Excess',
            problems: [
              {
                id: 'fertilizer_burn',
                name: 'Fertilizer Burn',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Leaf tip burn and margin scorch',
                  'Wilting and brown tissue',
                  'Root damage',
                  'Poor emergence or plant death'
                ],
                causes: [
                  'Excess fertilizer concentration',
                  'Fertilizer placed too close to seed or roots',
                  'High nitrogen concentration and salt accumulation',
                  'Dry soil during application'
                ],
                treatment: {
                  primary: [
                    'Stop further fertilizer application',
                    'Use appropriate irrigation only when drainage allows',
                    'Reassess crop survival'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'DO NOT add more fertilizer',
                    'Suspend nutrient recommendation',
                    'Resume only after soil/crop assessment'
                  ]
                },
                management: [],
                engineOutput: ['Check EC and soil moisture', 'Check fertilizer history']
              },
              {
                id: 'over_fertilization',
                name: 'Over-Fertilization',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Excessive vegetative growth and dark green foliage',
                  'Soft plant growth',
                  'Lodging risk',
                  'Salt stress and nutrient imbalance',
                  'Micronutrient uptake problems'
                ],
                causes: [
                  'Excess nitrogen, phosphorus, or potassium',
                  'Incorrect dose calculation or repeated application',
                  'No soil test'
                ],
                treatment: {
                  primary: [
                    'Stop additional fertilizer',
                    'Identify excessive nutrient',
                    'Correct irrigation where appropriate and monitor salinity'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    '"NO ADDITIONAL FERTILIZER" alert',
                    'Avoid unnecessary foliar feeding',
                    'Use future nutrient applications only after assessment'
                  ]
                },
                management: [],
                engineOutput: ['Identify probable excess nutrient', 'Check soil EC']
              }
            ]
          }
        ]
      }
    ]
  },
  physiological: {
    id: 'physiological',
    title: 'Physiological Disorders',
    description: 'Symptom-based disorders caused by multiple overlapping environmental or nutritional factors.',
    subcategories: [
      {
        id: 'leaf_symptoms',
        title: 'Leaf Symptoms',
        groups: [
          {
            id: 'chlorosis_group',
            title: 'Chlorosis & Discoloration',
            problems: [
              {
                id: 'chlorosis',
                name: 'Chlorosis (Yellowing)',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Yellow or pale green leaves',
                  'Interveinal chlorosis',
                  'Can affect older or younger leaves depending on cause'
                ],
                causes: [
                  'Important Note: Chlorosis is a symptom, not a single disease',
                  'Nitrogen, Iron, Sulfur, Manganese, or Zinc deficiency',
                  'High soil pH or Waterlogging',
                  'Poor root oxygen, root damage, or salinity',
                  'Chemical injury or disease-related root damage'
                ],
                treatment: {
                  primary: [
                    'Diagnose which leaves are affected (young vs. old, uniform vs. interveinal)',
                    'Check soil pH, moisture, EC/salinity, and root condition',
                    'Improve drainage if waterlogging is present before acting'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Diagnosis Required',
                  recommendation: [
                    'If Nitrogen confirmed -> Recommend N according to soil-test',
                    'If Sulfur confirmed -> Recommend S source',
                    'If Iron availability problem -> Correct root-zone/pH',
                    'If high pH causing unavailability -> Do not blindly add nutrients'
                  ]
                },
                management: [],
                engineOutput: ['Identify leaf age/pattern', 'Estimate possible root causes', 'Recommend nutrient only after cause filtering']
              },
              {
                id: 'leaf_tip_burn',
                name: 'Leaf Tip Burn',
                image: '/images/problems/spots.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Brown leaf tips',
                  'Dry leaf tips',
                  'Progressive tissue death (spreading downward in severe cases)'
                ],
                causes: [
                  'Drought stress or Water stress',
                  'Fertilizer burn or Chemical injury',
                  'Salinity',
                  'Potassium imbalance',
                  'High temperature or Root damage'
                ],
                treatment: {
                  primary: [
                    'Check soil moisture, EC, and fertilizer/chemical history',
                    'If drought -> Restore irrigation',
                    'If salinity -> Apply salinity-management strategy',
                    'If fertilizer/chemical burn -> Prevent further stress'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Diagnosis Required',
                  recommendation: [
                    'No fertilizer recommendation without cause confirmation',
                    'If confirmed potassium deficiency -> Recommend K based on soil test'
                  ]
                },
                management: [],
                engineOutput: ['Check Potassium status', 'Check EC / Salinity history']
              },
              {
                id: 'leaf_scorch',
                name: 'Leaf Scorch',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Brown leaf edges',
                  'Dry necrotic tissue with scorched appearance',
                  'Reduced photosynthetic area'
                ],
                causes: [
                  'Heat stress or Drought',
                  'Salinity',
                  'Fertilizer or Chemical injury',
                  'Strong environmental stress or Root-zone problems'
                ],
                treatment: {
                  primary: [
                    'Reduce moisture stress and manage heat stress',
                    'Check salinity',
                    'Avoid additional chemical stress'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Diagnosis Required',
                  recommendation: [
                    'Avoid blind fertilizer recommendation',
                    'Correct nutrient imbalance only if confirmed'
                  ]
                },
                management: [],
                engineOutput: ['Primary cause ranking', 'Environmental stress warning']
              }
            ]
          }
        ]
      },
      {
        id: 'growth_development',
        title: 'Growth & Development',
        groups: [
          {
            id: 'growth_issues_group',
            title: 'Growth Abnormalities',
            problems: [
              {
                id: 'premature_senescence',
                name: 'Premature Senescence',
                image: '/images/problems/yellow.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Early yellowing and drying',
                  'Reduced green leaf area',
                  'Poor grain filling',
                  'Early plant maturity appearance'
                ],
                causes: [
                  'Nitrogen deficiency',
                  'Drought or Heat stress (Terminal heat)',
                  'Root disease or Salinity',
                  'Severe nutrient imbalance or Pest damage'
                ],
                treatment: {
                  primary: [
                    'Check crop growth stage, Nitrogen status, moisture, and root health',
                    'If drought -> Improve irrigation',
                    'If disease/root damage -> Diagnose root cause'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Diagnosis Required',
                  recommendation: [
                    'If Nitrogen deficiency confirmed -> Evaluate appropriate N correction',
                    'If terminal heat -> Focus on stress mitigation, not unnecessary fertilizer'
                  ]
                },
                management: [],
                engineOutput: ['Consider crop growth stage before recommending treatment']
              },
              {
                id: 'stunted_growth',
                name: 'Stunted Growth',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Slower growth rate than expected',
                  'Reduced plant height',
                  'Poor canopy development'
                ],
                causes: [
                  'Nitrogen, Phosphorus, or Zinc deficiency',
                  'Root disease or Soil compaction',
                  'Waterlogging, Drought, or Cold stress',
                  'Pest damage or Poor seed establishment'
                ],
                treatment: {
                  primary: [
                    'Evaluate crop age, height, root condition, and moisture',
                    'If compaction -> Do not use fertilizer as primary solution',
                    'If waterlogging -> Improve drainage',
                    'If root disease -> Disease-specific management'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Diagnosis Required',
                  recommendation: [
                    'Nutrient recommendation must match confirmed deficiency',
                    'If multiple causes -> Multi-factor recommendation'
                  ]
                },
                management: [],
                engineOutput: ['Analyze plant height vs crop age', 'Multi-factor root cause ranking']
              },
              {
                id: 'lodging',
                name: 'Lodging',
                image: '/images/problems/wilting.jpg',
                healthyImage: '/images/problems/all_good.jpg',
                symptoms: [
                  'Plants bent or fallen',
                  'Stem lodging or Root lodging',
                  'Uneven canopy and reduced harvestability'
                ],
                causes: [
                  'Excess nitrogen causing weak stem development',
                  'Dense crop canopy',
                  'Excess irrigation, heavy rain, or strong wind',
                  'Disease-weakened stems or soil saturation'
                ],
                treatment: {
                  primary: [
                    'Stop unnecessary nitrogen application',
                    'Avoid excess irrigation',
                    'Assess disease involvement'
                  ],
                  chemical: [],
                },
                fertilizer: {
                  status: 'Not Primary Treatment',
                  recommendation: [
                    'If nitrogen excess suspected -> NO ADDITIONAL NITROGEN',
                    'If nutrient deficiency also exists -> Do not correct blindly without full balance assessment',
                    'Prevent further vegetative overgrowth'
                  ]
                },
                management: [],
                engineOutput: ['Check N application history', 'Check moisture and weather history']
              }
            ]
          }
        ]
      }
    ]
  }
};
