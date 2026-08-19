import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';

export default function AgriPulseBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hello John! I am AgriPulse, your AI agriculture assistant. I am connected to your live sensors, weather data, and crop models. How can I help you today?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const response = generateAIResponse(userMsg.toLowerCase());
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5 to 2.5 seconds delay
  };

  const generateAIResponse = (input) => {
    if (input.includes('water') || input.includes('irrigate') || input.includes('moisture') || input.includes('pump')) {
      return "Based on your live sensors, the soil moisture in Wheat Field-1 is currently at 28% (Optimal). Since the weather forecast shows a 51% chance of rain later today, I recommend keeping the pump OFF to save water and electricity. My auto-irrigation system will turn it on if moisture drops below 20%.";
    }
    if (input.includes('weather') || input.includes('rain') || input.includes('forecast')) {
      return "Today's forecast for Greater Noida indicates partly cloudy conditions with a high of 33°C. There is a 51% chance of moderate showers around 16:00 (4 PM). The UV Index is high (7.0), so avoid spraying activities during the afternoon.";
    }
    if (input.includes('pest') || input.includes('disease') || input.includes('brown rust') || input.includes('yellow')) {
      return "If you are noticing yellowing or brown spots on your wheat leaves, it could be an early sign of Brown Rust or a Nitrogen deficiency. Please click a clear photo of the leaf and upload it to our 'Pest Detection (Model-2)' module. I will analyze it instantly and recommend the exact fungicide.";
    }
    if (input.includes('fertilizer') || input.includes('urea') || input.includes('npk') || input.includes('zinc')) {
      return "I checked your live Soil NPK sensors. Your levels are currently Optimal (Nitrogen: 42 kg/ha, Phosphorus: 28 kg/ha, Potassium: 35 kg/ha). There is no need to apply additional Urea or DAP right now. Applying excessive fertilizer might lead to crop burning.";
    }
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Namaste John! I've been monitoring your farm 24/7. Everything looks green and healthy today. What specific data or advice do you need right now?";
    }
    if (input.includes('yield') || input.includes('harvest')) {
      return "Based on your current crop stage, historical data, and optimal NPK levels, your expected wheat yield is on track. We estimate harvesting can begin in approximately 45 days. Keep monitoring the weather alerts as we approach the date.";
    }
    
    // Default smart response
    return "That's an interesting question. I am continuously analyzing your ESP32 sensor data, the 15-day weather forecast, and our AI vision models. Everything seems perfectly aligned for your wheat crop's current growth stage. Is there a specific issue with pests, irrigation, or soil health you'd like me to focus on?";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl rounded-2xl flex flex-col bg-white border border-slate-200 overflow-hidden
      ${isExpanded 
        ? 'inset-4 md:inset-10 lg:inset-20' 
        : 'bottom-6 right-6 w-full max-w-sm h-[550px] max-h-[calc(100vh-48px)]'
      }`}
    >
      {/* Chat Header */}
      <div className="bg-[#064e3b] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              <Bot size={22} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#064e3b] rounded-full"></span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">AgriPulse AI</h3>
            <p className="text-emerald-300 text-xs flex items-center gap-1">
              <Sparkles size={10} /> Smart Agronomist
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-100">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-slate-400 bg-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#064e3b] text-white'
            }`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none leading-relaxed'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (only if just 1 message exists) */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto scrollbar-none border-t border-slate-100">
          <button onClick={() => setInputValue("Should I irrigate my field today?")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-50 transition-colors">
            💧 Should I irrigate today?
          </button>
          <button onClick={() => setInputValue("Do I need to add urea fertilizer?")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-50 transition-colors">
            🌱 Check NPK levels
          </button>
          <button onClick={() => setInputValue("What is the weather forecast for tomorrow?")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-50 transition-colors">
            ⛅ Weather update
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crops, sensors, or weather..." 
            className="w-full bg-slate-100 border-none rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              inputValue.trim() && !isTyping ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400'
            }`}
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Sparkles size={10} /> AgriPulse AI can make mistakes. Verify critical actions.
          </span>
        </div>
      </div>
    </div>
  );
}
