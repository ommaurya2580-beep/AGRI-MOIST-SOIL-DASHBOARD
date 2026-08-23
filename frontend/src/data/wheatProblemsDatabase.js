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
  }
};
