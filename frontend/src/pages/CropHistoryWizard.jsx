import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Check, MapPin, Map, Wheat, Calendar as CalIcon,
  Activity, Droplets, Mountain, FlaskConical, RotateCcw, Bug, AlertCircle, 
  ShieldAlert, Sprout, Eye, Maximize, FileText, Camera, CheckCircle2,
  Plus, Edit2
} from 'lucide-react';

const INITIAL_STATE = {
  farmLocation: { farmName: '', village: '', district: '', state: '', country: '', pincode: '' },
  fieldInfo: { fieldName: '', totalArea: '', areaUnit: 'Acre', irrigatedArea: '', isEntireFarm: '' },
  variety: { varietyName: '', seedSource: '' },
  sowing: { date: '', method: '', seedRate: '' },
  growthStage: '',
  irrigation: { method: '', lastIrrigated: '', count: '', condition: '' },
  soil: { type: '', hasReport: '', ph: '', n: '', p: '', k: '', oc: '' },
  fertilizers: { hasApplied: '', records: [] },
  previousCrop: { cropName: '', season: '', majorProblem: '' },
  pestHistory: { hasProblem: '', records: [] },
  diseaseHistory: { hasProblem: '', records: [] },
  cropProtection: { hasApplied: '', records: [] },
  weeds: { present: '', severity: '' },
  currentObservation: { symptoms: [], firstNoticed: '', severity: '' },
  affectedArea: '',
  notes: '',
  photos: []
};

// Custom UI Components
const SelectableCard = ({ label, icon, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
      selected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-200 bg-white text-slate-600'
    }`}
  >
    <div className="text-3xl">{icon}</div>
    <div className="font-semibold text-sm">{label}</div>
  </div>
);

const RadioGroup = ({ options, selected, onChange }) => (
  <div className="space-y-3">
    {options.map(opt => (
      <label key={opt} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${selected === opt ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === opt ? 'border-emerald-500' : 'border-slate-300'}`}>
          {selected === opt && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
        </div>
        <span className={selected === opt ? 'font-semibold text-emerald-800' : 'text-slate-600'}>{opt}</span>
      </label>
    ))}
  </div>
);

export default function CropHistoryWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_STATE);

  const totalSteps = 20;

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  const handleSave = () => {
    console.log("Saving crop profile...", data);
    navigate('/dashboard');
  };

  const updateData = (section, field, value) => {
    setData(prev => {
      if (typeof prev[section] === 'object' && !Array.isArray(prev[section])) {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
      return { ...prev, [section]: value };
    });
  };

  const Header = ({ title, subtitle, icon: Icon }) => (
    <div className="mb-8 text-center">
      {Icon && <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icon size={32} /></div>}
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-8 px-4">
      
      {/* Progress Bar */}
      {step > 1 && step < 20 && (
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            <span>Crop Profile Setup</span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12 min-h-[500px]">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🌾</div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Let's Understand Your Wheat Crop</h1>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                Answer a few simple questions about your field and crop. This helps create your complete Crop Profile.
              </p>
              <div className="bg-emerald-50 text-emerald-700 py-3 px-6 rounded-xl inline-flex items-center gap-2 font-medium mb-12">
                <Activity size={20} /> Takes approximately 5–10 minutes
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Farm Location" subtitle="Where is your wheat being grown?" icon={MapPin} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field" placeholder="Farm Name" value={data.farmLocation.farmName} onChange={e => updateData('farmLocation', 'farmName', e.target.value)} />
                <input className="input-field" placeholder="Village / Area" value={data.farmLocation.village} onChange={e => updateData('farmLocation', 'village', e.target.value)} />
                <input className="input-field" placeholder="District" value={data.farmLocation.district} onChange={e => updateData('farmLocation', 'district', e.target.value)} />
                <input className="input-field" placeholder="State" value={data.farmLocation.state} onChange={e => updateData('farmLocation', 'state', e.target.value)} />
                <input className="input-field" placeholder="Country" value={data.farmLocation.country} onChange={e => updateData('farmLocation', 'country', e.target.value)} />
                <input className="input-field" placeholder="PIN Code (Optional)" value={data.farmLocation.pincode} onChange={e => updateData('farmLocation', 'pincode', e.target.value)} />
              </div>
              <button className="w-full py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <Map size={18} /> Use Current Location
              </button>
            </div>
          )}

          {/* STEP 3: FIELD INFO */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Field Information" subtitle="Details about the specific planting area" icon={Maximize} />
              <div className="space-y-4">
                <input className="input-field" placeholder="Field Name / ID (e.g. North Plot)" value={data.fieldInfo.fieldName} onChange={e => updateData('fieldInfo', 'fieldName', e.target.value)} />
                <div className="flex gap-4">
                  <input className="input-field flex-1" type="number" placeholder="Total Area" value={data.fieldInfo.totalArea} onChange={e => updateData('fieldInfo', 'totalArea', e.target.value)} />
                  <select className="input-field w-32" value={data.fieldInfo.areaUnit} onChange={e => updateData('fieldInfo', 'areaUnit', e.target.value)}>
                    <option>Acre</option>
                    <option>Hectare</option>
                    <option>Bigha</option>
                  </select>
                </div>
                <input className="input-field" type="number" placeholder="Irrigated Area" value={data.fieldInfo.irrigatedArea} onChange={e => updateData('fieldInfo', 'irrigatedArea', e.target.value)} />
                
                <div className="pt-4">
                  <p className="font-semibold text-slate-700 mb-3">Is this the entire farm or one specific field?</p>
                  <RadioGroup options={['Entire Farm', 'Specific Field']} selected={data.fieldInfo.isEntireFarm} onChange={val => updateData('fieldInfo', 'isEntireFarm', val)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: VARIETY */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Wheat Variety" subtitle="Which wheat variety are you growing?" icon={Wheat} />
              <select className="input-field" value={data.variety.varietyName} onChange={e => updateData('variety', 'varietyName', e.target.value)}>
                <option value="">Select Variety ▼</option>
                <option>HD 2967</option>
                <option>PBW 343</option>
                <option>DBW 187</option>
                <option>Other</option>
                <option>I don't know</option>
              </select>
              <div className="pt-4">
                <p className="font-semibold text-slate-700 mb-3">Seed Source</p>
                <RadioGroup 
                  options={['Certified', 'Government/Research Center', 'Local Market', 'Saved From Previous Crop', 'Other']} 
                  selected={data.variety.seedSource} 
                  onChange={val => updateData('variety', 'seedSource', val)} 
                />
              </div>
            </div>
          )}

          {/* STEP 5: SOWING */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Sowing Information" subtitle="When and how was the crop planted?" icon={CalIcon} />
              <div>
                <p className="font-semibold text-slate-700 mb-2">Sowing Date</p>
                <input type="date" className="input-field" value={data.sowing.date} onChange={e => updateData('sowing', 'date', e.target.value)} />
              </div>
              <div className="pt-4">
                <p className="font-semibold text-slate-700 mb-3">How was the crop sown?</p>
                <RadioGroup 
                  options={['Broadcasting', 'Seed Drill', 'Other']} 
                  selected={data.sowing.method} 
                  onChange={val => updateData('sowing', 'method', val)} 
                />
              </div>
              <div className="pt-4">
                <p className="font-semibold text-slate-700 mb-2">Seed Rate (Optional)</p>
                <div className="flex items-center gap-2">
                  <input type="number" className="input-field flex-1" placeholder="Quantity" value={data.sowing.seedRate} onChange={e => updateData('sowing', 'seedRate', e.target.value)} />
                  <span className="text-slate-500 font-medium">kg per acre</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: GROWTH STAGE */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Current Crop Stage" subtitle="What is the current growth stage?" icon={Sprout} />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🌱', label: 'Germination' },
                  { icon: '🌿', label: 'Seedling' },
                  { icon: '🌾', label: 'Tillering' },
                  { icon: '🌾', label: 'Stem Elongation' },
                  { icon: '🌾', label: 'Booting' },
                  { icon: '🌾', label: 'Flowering' },
                  { icon: '🌾', label: 'Grain Filling' },
                  { icon: '🌾', label: 'Maturity' },
                ].map(stage => (
                  <SelectableCard key={stage.label} icon={stage.icon} label={stage.label} selected={data.growthStage === stage.label} onClick={() => setData(p => ({...p, growthStage: stage.label}))} />
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: IRRIGATION */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Irrigation History" subtitle="Water management details" icon={Droplets} />
              <div>
                <p className="font-semibold text-slate-700 mb-3">How is the field irrigated?</p>
                <select className="input-field mb-6" value={data.irrigation.method} onChange={e => updateData('irrigation', 'method', e.target.value)}>
                  <option value="">Select ▼</option>
                  <option>Rain-fed</option><option>Tube Well</option><option>Canal</option><option>Drip</option><option>Sprinkler</option><option>Other</option>
                </select>
                
                <p className="font-semibold text-slate-700 mb-2">When was the crop last irrigated?</p>
                <input type="date" className="input-field mb-6" value={data.irrigation.lastIrrigated} onChange={e => updateData('irrigation', 'lastIrrigated', e.target.value)} />
                
                <p className="font-semibold text-slate-700 mb-2">How many irrigations have been given?</p>
                <input type="number" className="input-field mb-6" placeholder="Number" value={data.irrigation.count} onChange={e => updateData('irrigation', 'count', e.target.value)} />

                <p className="font-semibold text-slate-700 mb-3">Current field condition</p>
                <RadioGroup 
                  options={['Dry', 'Slightly Dry', 'Normal', 'Wet', 'Waterlogged']} 
                  selected={data.irrigation.condition} 
                  onChange={val => updateData('irrigation', 'condition', val)} 
                />
              </div>
            </div>
          )}

          {/* STEP 8: SOIL */}
          {step === 8 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Soil Information" subtitle="Details about your farm's soil" icon={Mountain} />
              <div>
                <p className="font-semibold text-slate-700 mb-3">Do you know your soil type?</p>
                <select className="input-field mb-6" value={data.soil.type} onChange={e => updateData('soil', 'type', e.target.value)}>
                  <option value="">Select ▼</option>
                  <option>Sandy</option><option>Loamy</option><option>Clay</option><option>Sandy Loam</option><option>Other</option><option>I don't know</option>
                </select>

                <p className="font-semibold text-slate-700 mb-3">Do you have a soil test report?</p>
                <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.soil.hasReport} onChange={val => updateData('soil', 'hasReport', val)} />

                {data.soil.hasReport === 'Yes' && (
                  <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-semibold text-slate-700 mb-4 text-sm uppercase">Soil Parameters (Optional)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input-field" placeholder="pH" value={data.soil.ph} onChange={e => updateData('soil', 'ph', e.target.value)} />
                      <input className="input-field" placeholder="Organic Carbon (%)" value={data.soil.oc} onChange={e => updateData('soil', 'oc', e.target.value)} />
                      <input className="input-field" placeholder="Nitrogen (N)" value={data.soil.n} onChange={e => updateData('soil', 'n', e.target.value)} />
                      <input className="input-field" placeholder="Phosphorus (P)" value={data.soil.p} onChange={e => updateData('soil', 'p', e.target.value)} />
                      <input className="input-field col-span-2" placeholder="Potassium (K)" value={data.soil.k} onChange={e => updateData('soil', 'k', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 9: FERTILIZER */}
          {step === 9 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Fertilizer History" subtitle="What nutrients have you applied?" icon={FlaskConical} />
              <div>
                <p className="font-semibold text-slate-700 mb-3">Have you applied fertilizer?</p>
                <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.fertilizers.hasApplied} onChange={val => updateData('fertilizers', 'hasApplied', val)} />
                
                {data.fertilizers.hasApplied === 'Yes' && (
                  <div className="mt-6 space-y-4">
                    {data.fertilizers.records.map((rec, i) => (
                      <div key={i} className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800">{rec.type}</div>
                          <div className="text-sm text-slate-500">{rec.qty} {rec.unit} • Applied {rec.date}</div>
                        </div>
                      </div>
                    ))}
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                      <select className="input-field mb-3" id="fertType">
                        <option value="">Fertilizer Type ▼</option>
                        <option>Urea</option><option>DAP</option><option>NPK</option><option>MOP</option><option>Organic Manure</option><option>Micronutrient</option><option>Other</option>
                      </select>
                      <input type="date" className="input-field mb-3" id="fertDate" />
                      <div className="flex gap-2 mb-4">
                        <input type="number" className="input-field flex-1" placeholder="Quantity" id="fertQty" />
                        <select className="input-field w-32" id="fertUnit">
                          <option>kg/acre</option><option>L/acre</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          const type = document.getElementById('fertType').value;
                          const date = document.getElementById('fertDate').value;
                          const qty = document.getElementById('fertQty').value;
                          const unit = document.getElementById('fertUnit').value;
                          if(type) {
                            updateData('fertilizers', 'records', [...data.fertilizers.records, {type, date, qty, unit}]);
                            document.getElementById('fertType').value = '';
                          }
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex justify-center items-center gap-2"
                      >
                        <Plus size={18} /> Add Record
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 10: PREVIOUS CROP */}
          {step === 10 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Previous Crop" subtitle="What was grown here before?" icon={RotateCcw} />
              <select className="input-field" value={data.previousCrop.cropName} onChange={e => updateData('previousCrop', 'cropName', e.target.value)}>
                <option value="">Select Crop ▼</option>
                <option>Rice/Paddy</option><option>Maize</option><option>Cotton</option><option>Sugarcane</option><option>Legumes/Pulses</option><option>Other</option><option>None (Fallow)</option>
              </select>
              <select className="input-field" value={data.previousCrop.season} onChange={e => updateData('previousCrop', 'season', e.target.value)}>
                <option value="">Select Season ▼</option>
                <option>Kharif (Monsoon)</option><option>Rabi (Winter)</option><option>Zaid (Summer)</option>
              </select>
              <div className="pt-4">
                <p className="font-semibold text-slate-700 mb-3">Did the previous crop have any major problem?</p>
                <RadioGroup 
                  options={['No', 'Disease', 'Pest', 'Nutrient Issue', 'Other', 'Not sure']} 
                  selected={data.previousCrop.majorProblem} 
                  onChange={val => updateData('previousCrop', 'majorProblem', val)} 
                />
              </div>
            </div>
          )}

          {/* STEP 11: PEST HISTORY */}
          {step === 11 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Pest History" subtitle="Has this wheat crop had pest problems before?" icon={Bug} />
              <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.pestHistory.hasProblem} onChange={val => updateData('pestHistory', 'hasProblem', val)} />
              {data.pestHistory.hasProblem === 'Yes' && (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl mt-4">
                   <select className="input-field mb-3" id="pestType">
                     <option value="">Select Pest ▼</option>
                     <option>Aphids</option><option>Termites</option><option>Armyworm</option><option>Brown Mite</option><option>Other</option>
                   </select>
                   <input type="date" className="input-field mb-3" id="pestDate" />
                   <select className="input-field mb-4" id="pestSev">
                     <option value="">Severity ▼</option><option>Mild</option><option>Moderate</option><option>Severe</option>
                   </select>
                   <button 
                      onClick={() => {
                        const type = document.getElementById('pestType').value;
                        const date = document.getElementById('pestDate').value;
                        const severity = document.getElementById('pestSev').value;
                        if(type) updateData('pestHistory', 'records', [...data.pestHistory.records, {type, date, severity}]);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex justify-center items-center gap-2"
                    >
                      <Plus size={18} /> Add Pest Record
                    </button>
                    {data.pestHistory.records.map((r, i) => (
                      <div key={i} className="mt-3 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">{r.type} - {r.severity} ({r.date})</div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 12: DISEASE HISTORY */}
          {step === 12 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Disease History" subtitle="Has this crop had disease symptoms?" icon={AlertCircle} />
              <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.diseaseHistory.hasProblem} onChange={val => updateData('diseaseHistory', 'hasProblem', val)} />
              {data.diseaseHistory.hasProblem === 'Yes' && (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl mt-4">
                   <input className="input-field mb-3" placeholder="Disease / Symptom" id="disType" />
                   <input type="date" className="input-field mb-3" id="disDate" />
                   <select className="input-field mb-4" id="disSev">
                     <option value="">Severity ▼</option><option>Mild</option><option>Moderate</option><option>Severe</option>
                   </select>
                   <button 
                      onClick={() => {
                        const type = document.getElementById('disType').value;
                        const date = document.getElementById('disDate').value;
                        const severity = document.getElementById('disSev').value;
                        if(type) updateData('diseaseHistory', 'records', [...data.diseaseHistory.records, {type, date, severity}]);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex justify-center items-center gap-2"
                    >
                      <Plus size={18} /> Add Disease Record
                    </button>
                    {data.diseaseHistory.records.map((r, i) => (
                      <div key={i} className="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded-lg">{r.type} - {r.severity} ({r.date})</div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 13: CROP PROTECTION */}
          {step === 13 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Crop Protection" subtitle="Have you applied crop protection products?" icon={ShieldAlert} />
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm mb-4">
                Note: Record your previous application. Do not use this for dosage recommendations.
              </div>
              <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.cropProtection.hasApplied} onChange={val => updateData('cropProtection', 'hasApplied', val)} />
            </div>
          )}

          {/* STEP 14: WEED HISTORY */}
          {step === 14 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Weed History" subtitle="Are weeds currently present?" icon={Sprout} />
              <RadioGroup options={['Yes', 'No', 'Not sure']} selected={data.weeds.present} onChange={val => updateData('weeds', 'present', val)} />
              {data.weeds.present === 'Yes' && (
                <div className="pt-4">
                  <p className="font-semibold text-slate-700 mb-3">Severity:</p>
                  <RadioGroup options={['Low', 'Medium', 'High']} selected={data.weeds.severity} onChange={val => updateData('weeds', 'severity', val)} />
                </div>
              )}
            </div>
          )}

          {/* STEP 15: CURRENT OBSERVATION */}
          {step === 15 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Current Observation" subtitle="What do you currently notice?" icon={Eye} />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🍂', label: 'Yellow Leaves' },
                  { icon: '🟤', label: 'Brown Spots' },
                  { icon: '🐛', label: 'Insects Visible' },
                  { icon: '🌿', label: 'Poor Growth' },
                  { icon: '🥀', label: 'Wilting' },
                  { icon: '🌾', label: 'Abnormal Wheat Heads' },
                  { icon: '💧', label: 'Excess Water' },
                  { icon: '☀️', label: 'Dry Soil' },
                ].map(sym => (
                  <SelectableCard 
                    key={sym.label} icon={sym.icon} label={sym.label} 
                    selected={data.currentObservation.symptoms.includes(sym.label)} 
                    onClick={() => {
                      const curr = data.currentObservation.symptoms;
                      const next = curr.includes(sym.label) ? curr.filter(x => x !== sym.label) : [...curr, sym.label];
                      updateData('currentObservation', 'symptoms', next);
                    }} 
                  />
                ))}
              </div>
              <div className="pt-4 space-y-4">
                <div>
                  <p className="font-semibold text-slate-700 mb-2">When did you first notice this?</p>
                  <input type="date" className="input-field" value={data.currentObservation.firstNoticed} onChange={e => updateData('currentObservation', 'firstNoticed', e.target.value)} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-2">Severity</p>
                  <select className="input-field" value={data.currentObservation.severity} onChange={e => updateData('currentObservation', 'severity', e.target.value)}>
                    <option value="">Select ▼</option><option>Mild</option><option>Moderate</option><option>Severe</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 16: AFFECTED AREA */}
          {step === 16 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Affected Area" subtitle="How much of the field appears affected?" icon={Maximize} />
              <RadioGroup 
                options={['Less than 10%', '10–25%', '25–50%', 'More than 50%', 'Not sure']} 
                selected={data.affectedArea} 
                onChange={val => setData(p => ({...p, affectedArea: val}))} 
              />
            </div>
          )}

          {/* STEP 17: NOTES */}
          {step === 17 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Farmer Notes" subtitle="Describe anything unusual you noticed." icon={FileText} />
              <textarea 
                className="input-field min-h-[150px] resize-none" 
                placeholder='e.g. "Leaves started turning yellow after heavy rain last week..."'
                value={data.notes}
                onChange={e => setData(p => ({...p, notes: e.target.value}))}
              />
            </div>
          )}

          {/* STEP 18: CONTEXT PHOTOS */}
          {step === 18 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Context Photos" subtitle="Would you like to add field photos?" icon={Camera} />
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm mb-6 flex gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <p>These are optional crop-history context photos. For AI disease detection, please use the main AI Analysis tool.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Whole Field', 'Affected Plant', 'Leaf Close-up', 'Wheat Head', 'Soil', 'Other'].map(type => (
                  <div key={type} className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors aspect-square">
                    <Camera size={24} className="text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-600">{type}</span>
                    <span className="text-[10px] text-slate-400 mt-1">Click to add</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 19: REVIEW */}
          {step === 19 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Header title="Review All Information" subtitle="Check your details before saving" icon={CheckCircle2} />
              
              <div className="space-y-4">
                {[
                  { label: 'Farm Location', val: data.farmLocation.farmName || 'Not provided', s: 2 },
                  { label: 'Field Info', val: data.fieldInfo.fieldName || 'Not provided', s: 3 },
                  { label: 'Wheat Variety', val: data.variety.varietyName || 'Not provided', s: 4 },
                  { label: 'Growth Stage', val: data.growthStage || 'Not provided', s: 6 },
                  { label: 'Irrigation', val: data.irrigation.method || 'Not provided', s: 7 },
                  { label: 'Soil', val: data.soil.type || 'Not provided', s: 8 },
                  { label: 'Fertilizer', val: data.fertilizers.hasApplied || 'Not provided', s: 9 },
                  { label: 'Current Observation', val: data.currentObservation.symptoms.join(', ') || 'None', s: 15 },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="font-semibold text-slate-800">{item.val}</div>
                    </div>
                    <button onClick={() => setStep(item.s)} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 20: SAVE */}
          {step === 20 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Wheat Crop Profile Is Ready</h2>
              <ul className="text-slate-600 space-y-3 mb-12 inline-block text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-emerald-500" size={20}/> Farm information saved</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-emerald-500" size={20}/> Crop history recorded</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-emerald-500" size={20}/> Field profile created</li>
              </ul>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-6 md:px-12 bg-slate-50 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          {step > 1 && step < 20 ? (
            <button onClick={handleBack} className="w-full md:w-auto px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
          ) : <div className="hidden md:block w-[100px]"></div>}

          {step === 1 ? (
            <button onClick={handleNext} className="w-full md:w-auto px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-500/30 mx-auto md:mx-0">
              Start <ArrowRight size={20} />
            </button>
          ) : step < 19 ? (
            <button onClick={handleNext} className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20">
              Continue <ArrowRight size={18} />
            </button>
          ) : step === 19 ? (
            <button onClick={handleNext} className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
              Save Profile <Check size={18} />
            </button>
          ) : (
            <button onClick={handleSave} className="w-full md:w-auto px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-500/30 mx-auto">
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
      
      {/* CSS For simple inputs */}
      <style dangerouslySetInnerHTML={{__html: `
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          font-weight: 500;
          color: #334155;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #10b981;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        .input-field::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      `}} />
    </div>
  );
}
