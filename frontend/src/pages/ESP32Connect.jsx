import React, { useState } from 'react';
import { Wifi, Cpu, Settings as SettingsIcon, Activity, CheckCircle, ChevronRight, ChevronLeft, HelpCircle, Loader2, RefreshCcw } from 'lucide-react';

export default function ESP32Connect() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep === 4) {
      setIsTesting(true);
      setTimeout(() => {
        setIsTesting(false);
        setTestSuccess(true);
        setCurrentStep(5);
      }, 3000);
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Left Column - Wizard Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Connect ESP32 Device</h1>
          <p className="text-slate-500">Step-by-step configuration for your IoT sensors</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-2">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step < currentStep ? 'bg-emerald-500 text-white' : 
                    step === currentStep ? 'bg-[#064e3b] text-white ring-4 ring-emerald-50' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step < currentStep ? <CheckCircle size={18} /> : step}
                  </div>
                  <span className={`text-xs font-medium absolute top-12 whitespace-nowrap ${
                    step <= currentStep ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step === 1 && 'Power'}
                    {step === 2 && 'Wi-Fi'}
                    {step === 3 && 'Device'}
                    {step === 4 && 'Sensors'}
                    {step === 5 && 'Test'}
                  </span>
                </div>
                {step < 5 && (
                  <div className={`flex-1 h-1 rounded-full mx-2 ${
                    step < currentStep ? 'bg-emerald-500' : 'bg-slate-100'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Wizard Steps Container */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
          
          {/* STEP 1: Power On Device */}
          {currentStep === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Cpu className="text-blue-500" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Power On Device</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Connect your ESP32 board to a power source using a standard USB-C or Micro-USB cable. The red LED indicator on the board should light up.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-center mb-6">
                <div className="w-64 h-32 bg-slate-200 rounded-lg border-2 border-slate-300 relative flex items-center justify-center">
                  <span className="text-slate-400 font-mono">ESP32 Board Illustration</span>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Connect to Wi-Fi */}
          {currentStep === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wifi className="text-blue-500" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Connect to Wi-Fi</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Enter the Wi-Fi credentials for the network the ESP32 should connect to. This must be a 2.4GHz network.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Wi-Fi Name (SSID)</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Farm_Network_2.4G" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Wi-Fi Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Device Configuration */}
          {currentStep === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <SettingsIcon className="text-purple-500" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Device Configuration</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Set up how this device will be identified in your dashboard and how often it should send data.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Device Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" defaultValue="ESP32-WF-01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Field</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option>Wheat Field - 1</option>
                    <option>Rice Field - North</option>
                    <option>Greenhouse A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Update Interval</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option>5 Minutes</option>
                    <option>10 Minutes</option>
                    <option selected>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Sensor Configuration */}
          {currentStep === 4 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Activity className="text-emerald-500" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Sensor Configuration</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Select which physical sensors are connected to the ESP32 pins.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Soil Moisture Sensor', pin: 'ADC1_0 (GPIO36)' },
                  { name: 'Temperature Sensor', pin: 'GPIO4 (1-Wire)' },
                  { name: 'pH Sensor', pin: 'ADC1_3 (GPIO39)' },
                  { name: 'NPK Sensor (RS485)', pin: 'UART2 (GPIO16,17)' },
                ].map((sensor, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" defaultChecked />
                    <div>
                      <p className="font-semibold text-slate-800">{sensor.name}</p>
                      <p className="text-xs text-slate-500">Pin: {sensor.pin}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Test Connection */}
          {currentStep === 5 && (
            <div className="flex-1 animate-in fade-in zoom-in-95 flex flex-col items-center justify-center text-center">
              
              {isTesting ? (
                <>
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="text-blue-500 animate-spin" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Testing Connection...</h2>
                  <p className="text-slate-500 max-w-sm">Please wait while we establish a connection with the ESP32 and verify sensor data.</p>
                </>
              ) : testSuccess ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-emerald-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">ESP32 Connected Successfully</h2>
                  
                  <div className="w-full max-w-sm space-y-3 mb-8">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Wi-Fi Connection</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Sensors Detected</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">4 Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-600">First Data Sync</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Successful</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <RefreshCcw className="text-red-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Connection Failed</h2>
                  <p className="text-slate-500 max-w-sm mb-6">Could not establish a connection. Please check your Wi-Fi credentials and ensure the device is powered on.</p>
                  <button onClick={() => setIsTesting(true)} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
                    Retry Connection
                  </button>
                </>
              )}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1 || isTesting || (currentStep === 5 && testSuccess)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                currentStep === 1 || isTesting || (currentStep === 5 && testSuccess)
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={18} /> Back
            </button>

            {currentStep < 5 ? (
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#064e3b] hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {currentStep === 4 ? 'Test Connection' : 'Continue'} <ChevronRight size={18} />
              </button>
            ) : (
              testSuccess && (
                <button className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-[#064e3b] hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors shadow-lg">
                  Save & Start Monitoring
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Troubleshooting */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-[#064e3b] rounded-2xl p-6 text-white shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HelpCircle size={80} />
          </div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <HelpCircle size={20} className="text-emerald-400" />
            <h3 className="font-bold text-lg">Need Help?</h3>
          </div>
          <p className="text-sm text-emerald-100 mb-6 relative z-10">
            Troubleshooting guides to help you connect your ESP32 device securely.
          </p>
          
          <div className="space-y-3 relative z-10">
            <a href="#" className="block p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium flex items-center justify-between">
              How to connect ESP32
              <ChevronRight size={16} className="text-emerald-300" />
            </a>
            <a href="#" className="block p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium flex items-center justify-between">
              Wi-Fi troubleshooting
              <ChevronRight size={16} className="text-emerald-300" />
            </a>
            <a href="#" className="block p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium flex items-center justify-between">
              Sensor connection guide
              <ChevronRight size={16} className="text-emerald-300" />
            </a>
          </div>
        </div>

        {/* Current Sensor Status Summary (Read Only representation) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Sensor Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Soil Moisture</span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Temperature</span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">pH Sensor</span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">NPK Sensor</span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
