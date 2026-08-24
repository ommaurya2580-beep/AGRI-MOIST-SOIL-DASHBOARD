/**
 * Service to connect with the local Langflow AI Agent
 */
export async function getAIVerification(engineResult) {
  const FLOW_ID = "11246e60-8d3c-420b-b8fa-8ce5d8218e62";
  const LANGFLOW_URL = `http://localhost:7860/api/v1/run/${FLOW_ID}?stream=false`;
  const API_KEY = "sk-aqh-sFRKuiymRBK7kLZvbrxydUgta6UrWYawbScpaFQ";

  const payload = {
    output_type: "chat",
    input_type: "text",
    input_value: "Analyze engine result",
    tweaks: {
      "Prompt Template": {
        "engine_result": JSON.stringify(engineResult, null, 2)
      }
    }
  };

  try {
    const response = await fetch(LANGFLOW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse Langflow response structure
    if (data && data.outputs && data.outputs.length > 0) {
      // Find the Chat Output text
      const output = data.outputs[0].outputs[0].results.message.text;
      return output;
    }
    
    return "Error: Could not parse AI response.";
  } catch (err) {
    console.error("Langflow Error:", err);
    throw err;
  }
}
