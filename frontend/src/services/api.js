const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const analyzeNews = async (title, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error("Please provide at least a title or text for analysis.");
      }
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
};

export const getModelInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/model/info`);
  return await response.json();
};
