// components/cms/AIAssistant.jsx
import React, { useState } from 'react';

const AIAssistant = ({ onContentGenerated, context = '', currentContent = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const contentTypes = [
    {
      id: 'headline',
      name: 'Headlines',
      icon: '📰',
      prompts: [
        'Write a compelling headline for this content',
        'Create 5 attention-grabbing headlines',
        'Generate a headline that emphasizes benefits'
      ]
    },
    {
      id: 'description', 
      name: 'Descriptions',
      icon: '📝',
      prompts: [
        'Write a clear and engaging description',
        'Create a brief summary of this content',
        'Generate a description that highlights key points'
      ]
    },
    {
      id: 'cta',
      name: 'Call-to-Actions',
      icon: '🎯',
      prompts: [
        'Create compelling call-to-action text',
        'Generate urgent action phrases',
        'Write persuasive button text'
      ]
    },
    {
      id: 'form',
      name: 'Form Content',
      icon: '📋',
      prompts: [
        'Generate form field labels and placeholders',
        'Create form introduction text',
        'Write form success messages'
      ]
    }
  ];

  const generateContent = async (customPrompt = '') => {
    setIsGenerating(true);
    
    try {
      const finalPrompt = customPrompt || prompt;
      const contextInfo = context ? `Context: ${context}\n` : '';
      const currentInfo = currentContent ? `Current content: ${currentContent}\n` : '';
      
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${contextInfo}${currentInfo}Task: ${finalPrompt}`,
          maxTokens: 200,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedContent = data.content || data.choices?.[0]?.message?.content || '';
      
      if (generatedContent) {
        onContentGenerated?.(generatedContent);
        setPrompt('');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const quickGenerate = (type, promptText) => {
    generateContent(promptText);
  };

  return (
    <div className="ai-assistant">
      <style jsx>{`
        .ai-assistant {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .ai-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .ai-panel {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 400px;
          max-height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transform: ${isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'};
          opacity: ${isOpen ? '1' : '0'};
          visibility: ${isOpen ? 'visible' : 'hidden'};
          transition: all 0.3s ease;
        }

        .ai-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .ai-content {
          padding: 20px;
          max-height: 500px;
          overflow-y: auto;
        }

        .quick-actions {
          margin-bottom: 20px;
        }

        .actions-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .content-types {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .content-type {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          font-size: 12px;
          color: #374151;
        }

        .content-type:hover {
          border-color: #667eea;
          background: #f8faff;
        }

        .content-type.active {
          border-color: #667eea;
          background: #f8faff;
        }

        .prompts-list {
          display: none;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }

        .prompts-list.active {
          display: flex;
        }

        .prompt-btn {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 11px;
          text-align: left;
          transition: all 0.2s;
          color: #374151;
        }

        .prompt-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .custom-prompt {
          margin-top: 20px;
        }

        .prompt-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
          margin-bottom: 12px;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .generate-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .generate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .tips {
          margin-top: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .tips-title {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .tips-list {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.4;
        }

        .tips-list li {
          margin-bottom: 2px;
        }
      `}</style>

      <button
        className="ai-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Content Assistant"
      >
        🤖
      </button>

      <div className="ai-panel">
        <div className="ai-header">
          <div className="ai-title">🤖 AI Content Assistant</div>
        </div>

        <div className="ai-content">
          <div className="quick-actions">
            <div className="actions-title">Quick Generate</div>
            <div className="content-types">
              {contentTypes.map((type) => (
                <div key={type.id}>
                  <div
                    className="content-type"
                    onClick={() => {
                      const activeType = document.querySelector(`.prompts-list[data-type="${type.id}"]`);
                      const allPrompts = document.querySelectorAll('.prompts-list');
                      allPrompts.forEach(p => p.classList.remove('active'));
                      if (activeType) {
                        activeType.classList.add('active');
                      }
                    }}
                  >
                    <div>{type.icon}</div>
                    <div>{type.name}</div>
                  </div>
                  <div className="prompts-list" data-type={type.id}>
                    {type.prompts.map((promptText, index) => (
                      <button
                        key={index}
                        className="prompt-btn"
                        onClick={() => quickGenerate(type.id, promptText)}
                        disabled={isGenerating}
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="custom-prompt">
            <div className="actions-title">Custom Prompt</div>
            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what content you want to generate..."
              disabled={isGenerating}
            />
            <button
              className="generate-btn"
              onClick={() => generateContent()}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner" />
                  Generating...
                </>
              ) : (
                <>
                  ✨ Generate Content
                </>
              )}
            </button>
          </div>

          <div className="tips">
            <div className="tips-title">💡 Tips for Better Results</div>
            <ul className="tips-list">
              <li>Be specific about tone and style</li>
              <li>Mention your target audience</li>
              <li>Include key points to cover</li>
              <li>Specify desired length</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
