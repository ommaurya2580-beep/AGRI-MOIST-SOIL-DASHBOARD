import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, Droplets, SprayCan as Spray, ThermometerSun, Leaf, AlertTriangle, Calendar as CalIcon } from 'lucide-react';

// Highly visual full-screen wizard steps
const WIZARD_STEPS = [
  {
    id: 'stage',
    title: 'Current Crop Stage',
    subtitle: 'Which stage is your wheat currently in?',
    bgImage: '/images/stages/tillering.jpg',
    icon: Leaf,
    type: 'visual-select',
    askDate: false,
    options: [
      { id: 'seedling', label: 'Seedling', image: '/images/stages/seedling.jpg' },
      { id: 'tillering', label: 'Tillering', image: '/images/stages/tillering.jpg' },
      { id: 'flowering', label: 'Flowering', image: '/images/stages/flowering.jpg' },
      { id: 'maturity', label: 'Maturity', image: '/images/stages/maturity.jpg' },
    ]
  },
  {
    id: 'irrigation',
    title: 'Last Irrigation',
    subtitle: 'When was the field last watered?',
    bgImage: '/images/sprays/none.jpg',
    icon: Droplets,
    type: 'date-select',
    options: ['Today', 'Yesterday', '3 Days Ago', '1 Week Ago', 'More than 2 weeks']
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer Applied',
    subtitle: 'What fertilizer did you use recently?',
    bgImage: '/images/stages/flowering.jpg',
    icon: Leaf,
    type: 'visual-select',
    askDate: true,
    hasOther: true,
    options: [
      { id: 'urea', label: 'Nitrogen (Urea)', image: '/images/fertilizers/urea.jpg' },
      { id: 'dap', label: 'Phosphorus (DAP/SSP)', image: '/images/fertilizers/dap.jpg' },
      { id: 'potassium', label: 'Potassium (MOP)', image: '/images/fertilizers/potassium.jpg' },
      { id: 'zinc', label: 'Zinc Sulphate', image: '/images/fertilizers/zinc.jpg' },
      { id: 'sulphur', label: 'Sulphur', image: '/images/fertilizers/sulphur.jpg' },
      { id: 'organic', label: 'Organic (FYM)', image: '/images/fertilizers/organic.jpg' },
      { id: 'other', label: 'Other', emoji: '✏️' },
    ]
  },
  {
    id: 'spray',
    title: 'Crop Protection',
    subtitle: 'Did you spray any chemicals recently?',
    bgImage: '/images/sprays/none.jpg',
    icon: Spray,
    type: 'visual-select',
    askDate: true,
    options: [
      { id: 'pesticide', label: 'Pesticide / Insecticide', image: '/images/sprays/pesticide.jpg' },
      { id: 'fungicide', label: 'Fungicide', image: '/images/sprays/fungicide.jpg' },
      { id: 'herbicide', label: 'Herbicide (Weed Killer)', image: '/images/sprays/herbicide.jpg' },
      { id: 'none', label: 'None applied', image: '/images/sprays/none.jpg' },
    ]
  },
  {
    id: 'weather',
    title: 'Recent Weather Experience',
    subtitle: 'How was the weather in your field last week?',
    bgImage: '/images/weather/weather_bg.jpg',
    icon: ThermometerSun,
    type: 'visual-select',
    askDate: false,
    options: [
      { id: 'hot', label: 'Very Hot & Dry', image: '/images/weather/hot.jpg' },
      { id: 'rain', label: 'Heavy Rain', image: '/images/weather/rain.jpg' },
      { id: 'wind', label: 'Strong Winds', image: '/images/weather/wind.jpg' },
      { id: 'normal', label: 'Normal / Good', image: '/images/weather/normal.jpg' },
    ]
  },
  {
    id: 'problem',
    title: 'Current Problem',
    subtitle: 'What issues are you seeing in the field?',
    bgImage: '/images/stages/flowering.jpg',
    icon: AlertTriangle,
    type: 'visual-select',
    askDate: true,
    options: [
      { id: 'yellow', label: 'Yellowing Leaves', image: '/images/problems/yellow.jpg' },
      { id: 'spots', label: 'Spots on Leaves', image: '/images/problems/spots.jpg' },
      { id: 'insects', label: 'Insects visible', image: '/images/problems/insects.jpg' },
      { id: 'wilting', label: 'Wilting / Drying', image: '/images/problems/wilting.jpg' },
      { id: 'all_good', label: 'Healthy (No issues)', image: '/images/problems/all_good.jpg' },
    ]
  },
  {
    id: 'summary',
    title: 'Review Your Farm Profile',
    subtitle: 'Please review the information you provided.',
    bgImage: '/images/weather/weather_bg.jpg',
    icon: CheckCircle2,
    type: 'summary',
  }
];

const QUICK_DATES = ['Today', 'Yesterday', '3 Days Ago', '1 Week Ago'];

export default function CropHistoryWizard() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState({});

  const step = WIZARD_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

  const handleSelect = (value) => {
    setSelections({ ...selections, [step.id]: value });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);

  const handleNext = () => {
    if (isLastStep) {
      // Build a clean payload to show the user what we captured
      const historyPayload = {
        stage: getLabelForOption(WIZARD_STEPS.find(s => s.id === 'stage'), selections.stage?.selectedOption),
        irrigation_date: selections.irrigation,
        fertilizer: getLabelForOption(WIZARD_STEPS.find(s => s.id === 'fertilizer'), selections.fertilizer?.selectedOption) + (selections.fertilizer?.otherName ? ` (${selections.fertilizer.otherName})` : ''),
        fertilizer_date: selections.fertilizer?.approxDate,
        spray: getLabelForOption(WIZARD_STEPS.find(s => s.id === 'spray'), selections.spray?.selectedOption),
        spray_date: selections.spray?.approxDate,
        weather_experience: getLabelForOption(WIZARD_STEPS.find(s => s.id === 'weather'), selections.weather?.selectedOption),
        observed_problem: getLabelForOption(WIZARD_STEPS.find(s => s.id === 'problem'), selections.problem?.selectedOption),
        problem_date: selections.problem?.approxDate
      };

      setSavedPayload(historyPayload);
      setIsSaving(true);
      
      const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
      currentData.history = {
        // Save raw IDs for the engine
        stage_id: selections.stage?.selectedOption,
        fertilizer_id: selections.fertilizer?.selectedOption,
        spray_id: selections.spray?.selectedOption,
        weather_id: selections.weather?.selectedOption,
        problem_id: selections.problem?.selectedOption,
        // Save labels for the UI
        ...historyPayload
      };
      localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleManualNext = () => {
    navigate('/weather-sync');
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    if (step.type === 'summary') return true;
    
    const sel = selections[step.id];
    if (!sel) return false;
    
    if (step.type === 'visual-select') {
      if (!sel.selectedOption) return false;
      if (step.hasOther && sel.selectedOption === 'other' && !sel.otherName) return false;
      
      // If askDate is true, approxDate must be filled
      if (step.askDate && !sel.approxDate) return false;
      return true;
    }
    return true; // For date-select
  };

  const getLabelForOption = (step, optionId) => {
    if (!step.options || !Array.isArray(step.options)) return optionId;
    const opt = step.options.find(o => o.id === optionId);
    return opt ? opt.label : optionId;
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900 rounded-3xl shadow-2xl flex flex-col">
      
      {/* Saving Data Overlay */}
      {isSaving && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-emerald-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">History Captured!</h2>
            <p className="text-slate-500 mb-6 text-center text-sm">Data structured for Root Cause Engine</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {savedPayload && Object.entries(savedPayload).map(([key, value]) => (
                  value ? (
                    <div key={key} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">{key.replace('_', ' ')}</span>
                      <span className="text-slate-800 font-semibold">{Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? value.selectedOption : value)}</span>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
            
            <button onClick={handleManualNext} className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30">
              Proceed to Step 2: Weather <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Background Image with animated transition */}
      {WIZARD_STEPS.map((s, idx) => (
        <div 
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentStepIndex ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <img src={s.bgImage} alt={s.title} className="w-full h-full object-cover" />
          {/* Gradient Overlay reverted to original transparency */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/60" />
        </div>
      ))}

      {/* Top Progress Bar */}
      <div className="relative z-10 w-full p-6">
        <div className="flex gap-2 w-full max-w-lg mx-auto">
          {WIZARD_STEPS.map((_, idx) => (
            <div key={idx} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-emerald-400 transition-all duration-500 ${idx <= currentStepIndex ? 'w-full' : 'w-0'}`} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full overflow-y-auto scrollbar-none">
        <div className="flex flex-col items-center justify-center min-h-full p-6 text-center py-12">
        <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-emerald-400/30">
          <step.icon size={32} className="text-emerald-300" />
        </div>
        
        {/* Changed text color and weight for better visibility without darkening whole bg */}
        <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-xl text-emerald-400">{step.title}</h1>
        <p className="text-lg md:text-xl font-bold text-slate-100 mb-10 max-w-md drop-shadow-lg">{step.subtitle}</p>

        {/* Input Controls */}
        <div className={`w-full transition-all duration-300 ${step.type === 'visual-select' && selections[step.id]?.selectedOption && step.askDate ? 'max-w-4xl' : 'max-w-xl'}`}>
          
          {step.type === 'visual-select' && (
            <div className={`flex flex-col ${selections[step.id]?.selectedOption && step.askDate ? 'lg:flex-row' : ''} gap-6 items-start justify-center`}>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full flex-1">
                {step.options.map(opt => {
                  const isSelected = selections[step.id]?.selectedOption === opt.id;
                  
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => {
                        setSelections({ 
                          ...selections, 
                          [step.id]: { ...selections[step.id], selectedOption: opt.id } 
                        });
                      }}
                      className={`cursor-pointer backdrop-blur-md p-3 rounded-2xl border-2 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 ${
                        isSelected 
                          ? 'bg-emerald-500/40 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                          : 'bg-slate-900/40 border-white/10 hover:bg-slate-800/60 hover:border-white/30'
                      }`}
                    >
                      {opt.image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-slate-800">
                           <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                        </div>
                      ) : (
                        <span className="text-3xl">{opt.emoji}</span>
                      )}
                      <span className="text-white font-bold text-xs text-center">{opt.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Show Extra Fields if date/other is required */}
              {selections[step.id]?.selectedOption && step.askDate && (
                <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-5 animate-in slide-in-from-right-4 w-full lg:w-80 shrink-0 shadow-2xl">
                  
                  {step.hasOther && selections[step.id]?.selectedOption === 'other' && (
                    <div>
                      <p className="text-sm text-slate-100 font-bold mb-2 text-left">Type Name:</p>
                      <input 
                        type="text" 
                        placeholder="e.g. Calcium Nitrate"
                        className="w-full bg-slate-800/80 border border-white/30 rounded-xl p-3 text-white placeholder-slate-400 outline-none focus:border-emerald-400 transition-colors"
                        value={selections[step.id]?.otherName || ''}
                        onChange={(e) => setSelections({ ...selections, [step.id]: { ...selections[step.id], otherName: e.target.value } })}
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-slate-100 font-bold mb-2 text-left flex items-center gap-2">
                      <CalIcon size={16} className="text-emerald-400" /> Date (or Quick Select):
                    </p>
                    
                    {/* Quick Date Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {QUICK_DATES.map(qDate => (
                        <div 
                          key={qDate}
                          onClick={() => setSelections({ ...selections, [step.id]: { ...selections[step.id], approxDate: qDate } })}
                          className={`cursor-pointer text-xs font-bold py-2 px-1 text-center rounded-lg border transition-all ${
                            selections[step.id]?.approxDate === qDate
                              ? 'bg-emerald-500/60 border-emerald-400 text-white shadow-lg'
                              : 'bg-slate-800/80 border-white/20 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {qDate}
                        </div>
                      ))}
                    </div>

                    {/* Manual Date Input */}
                    <input 
                      type="date" 
                      className="w-full bg-slate-800/80 border border-white/30 rounded-xl p-3 text-white outline-none focus:border-emerald-400 transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                      value={!QUICK_DATES.includes(selections[step.id]?.approxDate) ? (selections[step.id]?.approxDate || '') : ''}
                      onChange={(e) => setSelections({ ...selections, [step.id]: { ...selections[step.id], approxDate: e.target.value } })}
                    />
                  </div>

                </div>
              )}
            </div>
          )}

          {step.type === 'date-select' && (
            <div className="space-y-3">
              <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl mb-6 flex items-center gap-4 border border-white/10">
                 <CalIcon size={32} className="text-emerald-400" />
                 <input 
                   type="date" 
                   className="flex-1 bg-transparent text-xl font-bold text-white outline-none [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] cursor-pointer"
                   onChange={(e) => handleSelect(e.target.value)}
                   value={selections[step.id] && !step.options.includes(selections[step.id]) ? selections[step.id] : ''}
                 />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {step.options.map(opt => {
                  const isSelected = selections[step.id] === opt;
                  return (
                    <div 
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      className={`cursor-pointer backdrop-blur-md px-4 py-3 rounded-xl border transition-all text-sm font-bold text-center ${
                        isSelected 
                          ? 'bg-emerald-500/60 border-emerald-400 text-white shadow-lg' 
                          : 'bg-slate-800/80 border-white/20 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step.type === 'summary' && (
            <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl text-left w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95">
              <h3 className="text-2xl font-black text-emerald-400 mb-6 border-b border-white/10 pb-4">Data Summary</h3>
              <ul className="space-y-4">
                {WIZARD_STEPS.slice(0, -1).map(s => {
                  const sel = selections[s.id];
                  if (!sel) return null;
                  
                  let displayValue = '';
                  let dateInfo = '';
                  
                  if (s.type === 'date-select') {
                    displayValue = sel;
                  } else if (s.type === 'visual-select') {
                    displayValue = getLabelForOption(s, sel.selectedOption);
                    if (sel.selectedOption === 'other' && sel.otherName) {
                      displayValue += ` (${sel.otherName})`;
                    }
                    if (sel.approxDate) {
                      dateInfo = `(Date: ${sel.approxDate})`;
                    }
                  }

                  return (
                    <li key={s.id} className="flex flex-col md:flex-row md:items-start md:justify-between bg-slate-800/50 p-4 rounded-xl border border-white/5">
                      <span className="font-bold text-emerald-200 mb-1 md:mb-0 md:w-1/3 flex items-center gap-2">
                        <s.icon size={16} className="text-emerald-400" />
                        {s.title}
                      </span> 
                      <div className="md:w-2/3 md:text-right">
                        <span className="text-white font-semibold text-lg block">{displayValue}</span>
                        {dateInfo && <span className="text-emerald-400/80 text-sm font-medium">{dateInfo}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </div>
      </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full p-6 md:p-8 flex justify-between items-center max-w-4xl mx-auto">
        <button 
          onClick={handleBack}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-opacity ${
            currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-white/10 text-white'
          }`}
        >
          <ChevronLeft size={20} /> Back
        </button>

        <button 
          onClick={handleNext}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg text-lg ${
            isStepValid() 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/40 translate-y-0' 
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
          disabled={!isStepValid()}
        >
          {isLastStep ? 'Save & Submit' : 'Continue'} 
          {isLastStep ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
