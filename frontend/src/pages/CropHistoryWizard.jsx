import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, Droplets, SprayCan as Spray, ThermometerSun, Leaf, AlertTriangle, Calendar as CalIcon } from 'lucide-react';

// Highly visual full-screen wizard steps
const WIZARD_STEPS = [
  {
    id: 'stage',
    title: 'Current Crop Stage',
    subtitle: 'Which stage is your wheat currently in?',
    bgImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
    icon: Leaf,
    type: 'visual-select',
    askDate: true,
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
    bgImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=1200',
    icon: Droplets,
    type: 'date-select',
    options: ['Today', 'Yesterday', '3 Days Ago', '1 Week Ago', 'More than 2 weeks']
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer Applied',
    subtitle: 'What fertilizer did you use recently?',
    bgImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200',
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
    bgImage: 'https://images.unsplash.com/photo-1592982537447-6f296c0bd5e8?auto=format&fit=crop&q=80&w=1200',
    icon: Spray,
    type: 'visual-select',
    askDate: true,
    options: [
      { id: 'pesticide', label: 'Pesticide / Insecticide', image: '/images/sprays/pesticide.png' },
      { id: 'fungicide', label: 'Fungicide', image: '/images/sprays/fungicide.png' },
      { id: 'herbicide', label: 'Herbicide (Weed Killer)', image: '/images/sprays/herbicide.png' },
      { id: 'none', label: 'None applied', image: '/images/sprays/none.png' },
    ]
  },
  {
    id: 'weather',
    title: 'Recent Weather Experience',
    subtitle: 'How was the weather in your field last week?',
    bgImage: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&q=80&w=1200',
    icon: ThermometerSun,
    type: 'visual-select',
    askDate: true,
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
    bgImage: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=1200',
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

  const handleNext = () => {
    if (isLastStep) {
      console.log("Saving visual crop profile:", selections);
      navigate('/dashboard');
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const isStepValid = () => {
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

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900 rounded-3xl shadow-2xl flex flex-col">
      
      {/* Background Image with animated transition */}
      {WIZARD_STEPS.map((s, idx) => (
        <div 
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentStepIndex ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <img src={s.bgImage} alt={s.title} className="w-full h-full object-cover" />
          {/* Gradient Overlay for text readability */}
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
        <div className="flex flex-col items-center justify-center min-h-full p-6 text-white text-center py-12">
        <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-emerald-400/30">
          <step.icon size={32} className="text-emerald-300" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{step.title}</h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-md drop-shadow-md">{step.subtitle}</p>

        {/* Input Controls */}
        <div className={`w-full transition-all duration-300 ${step.type === 'visual-select' && selections[step.id]?.selectedOption && step.askDate ? 'max-w-4xl' : 'max-w-xl'}`}>
          
          {step.type === 'visual-select' && (
            <div className={`flex flex-col ${selections[step.id]?.selectedOption && step.askDate ? 'lg:flex-row' : ''} gap-6 items-start justify-center`}>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full flex-1">
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
                      className={`cursor-pointer backdrop-blur-md p-4 rounded-2xl border-2 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-3 ${
                        isSelected 
                          ? 'bg-emerald-500/40 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' 
                          : 'bg-slate-900/40 border-white/10 hover:bg-slate-800/60 hover:border-white/30'
                      }`}
                    >
                      {opt.image ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-slate-800">
                           <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                        </div>
                      ) : (
                        <span className="text-4xl">{opt.emoji}</span>
                      )}
                      <span className="font-semibold text-white tracking-wide text-sm text-center">{opt.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Show Extra Fields if date/other is required */}
              {selections[step.id]?.selectedOption && step.askDate && (
                <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-5 animate-in slide-in-from-right-4 w-full lg:w-80 shrink-0 shadow-2xl">
                  
                  {step.hasOther && selections[step.id]?.selectedOption === 'other' && (
                    <div>
                      <p className="text-sm text-slate-300 font-semibold mb-2 text-left">Type Name:</p>
                      <input 
                        type="text" 
                        placeholder="e.g. Calcium Nitrate"
                        className="w-full bg-slate-800/50 border border-white/20 rounded-xl p-3 text-white outline-none focus:border-emerald-400 transition-colors"
                        value={selections[step.id]?.otherName || ''}
                        onChange={(e) => setSelections({ ...selections, [step.id]: { ...selections[step.id], otherName: e.target.value } })}
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-slate-300 font-semibold mb-2 text-left flex items-center gap-2">
                      <CalIcon size={16} className="text-emerald-400" /> Date (or Quick Select):
                    </p>
                    
                    {/* Quick Date Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {QUICK_DATES.map(qDate => (
                        <div 
                          key={qDate}
                          onClick={() => setSelections({ ...selections, [step.id]: { ...selections[step.id], approxDate: qDate } })}
                          className={`cursor-pointer text-xs font-semibold py-2 px-1 text-center rounded-lg border transition-all ${
                            selections[step.id]?.approxDate === qDate
                              ? 'bg-emerald-500/40 border-emerald-400 text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {qDate}
                        </div>
                      ))}
                    </div>

                    {/* Manual Date Input */}
                    <input 
                      type="date" 
                      className="w-full bg-slate-800/50 border border-white/20 rounded-xl p-3 text-white outline-none focus:border-emerald-400 transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
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
                      className={`cursor-pointer backdrop-blur-md px-4 py-3 rounded-xl border transition-all text-sm font-semibold text-center ${
                        isSelected 
                          ? 'bg-emerald-500/40 border-emerald-400' 
                          : 'bg-slate-900/40 border-white/10 hover:bg-slate-800/60'
                      }`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
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
          {isLastStep ? 'Save Farm Profile' : 'Continue'} 
          {isLastStep ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
