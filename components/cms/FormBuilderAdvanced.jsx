// components/cms/FormBuilder.jsx
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import GradientPicker from './GradientPicker';
import ButtonStyler from './ButtonStyler';
import ImageSelector from './ImageSelector';

// Field Types
const FIELD_TYPES = [
  { id: 'text', name: 'Text Input', icon: '📝' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'textarea', name: 'Text Area', icon: '📄' },
  { id: 'select', name: 'Select Dropdown', icon: '📋' },
  { id: 'radio', name: 'Radio Buttons', icon: '⚪' },
  { id: 'checkbox', name: 'Checkboxes', icon: '☑️' },
  { id: 'number', name: 'Number', icon: '🔢' },
  { id: 'phone', name: 'Phone', icon: '📱' },
  { id: 'date', name: 'Date', icon: '📅' },
  { id: 'file', name: 'File Upload', icon: '📎' }
];

// Sortable Field Component
function SortableField({ field, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-field">
      <FieldEditor
        field={field}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// Field Editor Component
function FieldEditor({ field, onUpdate, onDelete, dragHandleProps }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (updates) => {
    onUpdate(field.id, { ...field, ...updates });
  };

  const addOption = () => {
    const currentOptions = field.options || [];
    updateField({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...(field.options || [])];
    updatedOptions[index] = value;
    updateField({ options: updatedOptions });
  };

  const removeOption = (index) => {
    const updatedOptions = [...(field.options || [])];
    updatedOptions.splice(index, 1);
    updateField({ options: updatedOptions });
  };

  return (
    <div className="field-editor">
      <style jsx>{`
        .field-editor {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 12px;
          background: white;
        }
        
        .field-header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: ${isExpanded ? '1px solid #f1f5f9' : 'none'};
        }
        
        .field-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .drag-handle {
          cursor: grab;
          color: #9ca3af;
          font-size: 16px;
        }
        
        .drag-handle:active {
          cursor: grabbing;
        }
        
        .field-type {
          font-size: 18px;
        }
        
        .field-details {
          display: flex;
          flex-direction: column;
        }
        
        .field-label {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }
        
        .field-type-name {
          color: #6b7280;
          font-size: 12px;
        }
        
        .field-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .action-btn {
          padding: 4px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .action-btn:hover {
          background: #f3f4f6;
        }
        
        .delete-btn {
          color: #dc2626;
          border-color: #fecaca;
        }
        
        .delete-btn:hover {
          background: #fef2f2;
        }
        
        .expand-icon {
          transition: transform 0.2s;
          transform: rotate(${isExpanded ? '180deg' : '0deg'});
        }
        
        .field-content {
          padding: 16px;
          display: ${isExpanded ? 'block' : 'none'};
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .content-full {
          grid-column: 1 / -1;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input, .form-textarea {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .options-section {
          margin-bottom: 16px;
        }
        
        .option-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .option-input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .remove-option {
          padding: 4px 8px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .add-option {
          padding: 6px 12px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .validation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }
        
        .field-preview {
          margin-top: 16px;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
        
        .preview-label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          color: #374151;
        }
        
        .preview-required {
          color: #dc2626;
        }
        
        .preview-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .preview-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          min-height: 80px;
          resize: vertical;
        }
        
        .preview-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }
        
        .preview-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .preview-option {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
      `}</style>

      <div className="field-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="field-info">
          <div {...dragHandleProps} className="drag-handle">⋮⋮</div>
          <div className="field-type">
            {FIELD_TYPES.find(t => t.id === field.type)?.icon}
          </div>
          <div className="field-details">
            <div className="field-label">{field.label || 'Untitled Field'}</div>
            <div className="field-type-name">
              {FIELD_TYPES.find(t => t.id === field.type)?.name}
            </div>
          </div>
        </div>
        <div className="field-actions">
          <button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
          >
            Delete
          </button>
          <div className="expand-icon">⌄</div>
        </div>
      </div>

      {isExpanded && (
        <div className="field-content">
          {/* Basic Settings */}
          <div className="content-grid">
            <div className="form-group">
              <label className="form-label">Field Label</label>
              <input
                type="text"
                className="form-input"
                value={field.label || ''}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Enter field label"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Placeholder</label>
              <input
                type="text"
                className="form-input"
                value={field.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          </div>

          {/* Options for select/radio/checkbox */}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div className="options-section">
              <label className="form-label">Options</label>
              {(field.options || []).map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    className="option-input"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {field.options.length > 1 && (
                    <button
                      className="remove-option"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button className="add-option" onClick={addOption}>
                + Add Option
              </button>
            </div>
          )}

          {/* Validation */}
          <div className="validation-grid">
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => updateField({ required: e.target.checked })}
              />
              <label>Required</label>
            </div>
            
            {field.type === 'text' && (
              <>
                <div className="form-group">
                  <label className="form-label">Min Length</label>
                  <input
                    type="number"
                    className="form-input"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => updateField({
                      validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Length</label>
                  <input
                    type="number"
                    className="form-input"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => updateField({
                      validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                    })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div className="field-preview">
            <div className="preview-label">
              {field.label || 'Untitled Field'}
              {field.required && <span className="preview-required"> *</span>}
            </div>
            {renderFieldPreview(field)}
          </div>
        </div>
      )}
    </div>
  );
}

// Render field preview
function renderFieldPreview(field) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className="preview-textarea"
          placeholder={field.placeholder}
          disabled
        />
      );
    case 'select':
      return (
        <select className="preview-select" disabled>
          <option value="">{field.placeholder || 'Choose an option'}</option>
          {(field.options || []).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="preview-options">
          {(field.options || []).map((option, index) => (
            <div key={index} className="preview-option">
              <input type="radio" name={field.id} disabled />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="preview-options">
          {(field.options || []).map((option, index) => (
            <div key={index} className="preview-option">
              <input type="checkbox" disabled />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    default:
      return (
        <input
          type={field.type}
          className="preview-input"
          placeholder={field.placeholder}
          disabled
        />
      );
  }
}

// Main FormBuilder Component with Advanced Features
const FormBuilder = ({ formData: initialData, onSave, className = '' }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    fields: [],
    settings: {
      submitText: 'Submit',
      successMessage: 'Thank you for your submission!',
      emailNotifications: true,
      saveToDatabase: true,
      redirectUrl: '',
      allowMultiple: true
    },
    styling: {
      theme: 'default',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#d1d5db',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      spacing: 'normal',
      borderRadius: '6px',
      customCSS: ''
    }
  });

  const [activeTab, setActiveTab] = useState('builder');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `${FIELD_TYPES.find(f => f.id === type)?.name} Field`,
      placeholder: '',
      required: false,
      validation: {},
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1'] : undefined
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? updates : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.fields.findIndex(field => field.id === active.id);
        const newIndex = prev.fields.findIndex(field => field.id === over.id);

        return {
          ...prev,
          fields: arrayMove(prev.fields, oldIndex, newIndex)
        };
      });
    }
  };

  const updateSettings = (updates) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const updateStyling = (updates) => {
    setFormData(prev => ({
      ...prev,
      styling: { ...prev.styling, ...updates }
    }));
  };

  return (
    <div className={`form-builder ${className}`}>
      <style jsx>{`
        .form-builder {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }
        
        .builder-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .builder-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        
        .builder-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .builder-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
          background: white;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto 32px auto;
        }

        .tab-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tab-button.active {
          background: #3b82f6;
          color: white;
        }

        .tab-button:hover:not(.active) {
          background: #f1f5f9;
          color: #374151;
        }
        
        .builder-content {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 24px;
        }
        
        .field-palette {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }
        
        .palette-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .field-types {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .field-type-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-align: left;
          transition: all 0.2s;
          min-height: 50px;
        }
        
        .field-type-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
        }
        
        .field-type-btn span:first-child {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }
        
        .form-canvas {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px;
          min-height: 600px;
        }
        
        .form-settings {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 24px;
          margin-bottom: 24px;
        }
        
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .settings-full {
          grid-column: 1 / -1;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input, .form-textarea, .form-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .fields-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .empty-text {
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .empty-subtext {
          font-size: 14px;
        }
        
        .save-section {
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .save-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .save-btn:hover {
          background: #2563eb;
        }

        .save-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .settings-section {
          margin-bottom: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .settings-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          border-radius: 8px;
          background: #f8fafc;
        }

        .checkbox-group input[type="checkbox"] {
          margin-top: 2px;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .checkbox-group label {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
          margin: 0;
          cursor: pointer;
        }

        .color-input {
          width: 50px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
        }

        .theme-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .theme-option {
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-option.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .theme-option:hover {
          border-color: #93c5fd;
        }

        .preview-container {
          margin-top: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }

        .preview-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .full-width-canvas {
          grid-column: 1 / -1;
        }
      `}</style>

      <div className="builder-header">
        <h1 className="builder-title">Advanced Form Builder</h1>
        <p className="builder-subtitle">Create professional forms with drag and drop, advanced styling, and AI assistance</p>
      </div>

      <div className="builder-tabs">
        <button 
          className={`tab-button ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          <span>🏗️</span>
          Builder
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span>⚙️</span>
          Settings
        </button>
        <button 
          className={`tab-button ${activeTab === 'styling' ? 'active' : ''}`}
          onClick={() => setActiveTab('styling')}
        >
          <span>🎨</span>
          Styling/Preview
        </button>
      </div>

      {activeTab === 'builder' && (
        <div className="builder-content">
          <div className="field-palette">
            <h3 className="palette-title">Field Types</h3>
            <div className="field-types">
              {FIELD_TYPES.map((fieldType) => (
                <button
                  key={fieldType.id}
                  className="field-type-btn"
                  onClick={() => addField(fieldType.id)}
                >
                  <span>{fieldType.icon}</span>
                  <span>{fieldType.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-canvas">
            {/* Form Settings */}
            <div className="form-settings">
              <div className="settings-grid">
                <div className="form-group">
                  <label className="form-label">Form Title</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter form title"
                  />
                </div>
              </div>
              <div className="form-group settings-full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter form description (optional)"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="fields-container">
              <h3 className="fields-title">Form Fields</h3>
              
              {formData.fields.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <div className="empty-text">No fields added yet</div>
                  <div className="empty-subtext">Click on a field type to add it to your form</div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={formData.fields} strategy={verticalListSortingStrategy}>
                    {formData.fields.map((field) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        onUpdate={updateField}
                        onDelete={deleteField}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Save Section */}
            <div className="save-section">
              <button
                className="save-btn"
                onClick={() => onSave?.(formData)}
                disabled={!formData.title || formData.fields.length === 0}
              >
                Save Form
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="form-canvas full-width-canvas">
          <div className="settings-section">
            <h3>Form Behavior</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Submit Button Text</label>
                <input
                  className="form-input"
                  value={formData.settings.submitText}
                  onChange={(e) => updateSettings({ submitText: e.target.value })}
                  placeholder="Submit"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Success Message</label>
                <input
                  className="form-input"
                  value={formData.settings.successMessage}
                  onChange={(e) => updateSettings({ successMessage: e.target.value })}
                  placeholder="Thank you for your submission!"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Redirect URL (optional)</label>
                <input
                  className="form-input"
                  value={formData.settings.redirectUrl}
                  onChange={(e) => updateSettings({ redirectUrl: e.target.value })}
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={formData.settings.allowMultiple}
                onChange={(e) => updateSettings({ allowMultiple: e.target.checked })}
              />
              <label>Allow multiple submissions from same user</label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Notifications & Storage</h3>
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={formData.settings.emailNotifications}
                onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
              />
              <label>Send email notifications for new submissions</label>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={formData.settings.saveToDatabase}
                onChange={(e) => updateSettings({ saveToDatabase: e.target.checked })}
              />
              <label>Save submissions to database</label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'styling' && (
        <div className="form-canvas full-width-canvas">
          <div className="settings-section">
            <h3>Theme</h3>
            <div className="theme-selector">
              {['default', 'modern', 'minimal', 'classic'].map(theme => (
                <div
                  key={theme}
                  className={`theme-option ${formData.styling.theme === theme ? 'active' : ''}`}
                  onClick={() => updateStyling({ theme })}
                >
                  <div style={{textTransform: 'capitalize', fontWeight: '500'}}>{theme}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3>Colors</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Background Color</label>
                <input
                  type="color"
                  className="color-input"
                  value={formData.styling.backgroundColor}
                  onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Text Color</label>
                <input
                  type="color"
                  className="color-input"
                  value={formData.styling.textColor}
                  onChange={(e) => updateStyling({ textColor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Border Color</label>
                <input
                  type="color"
                  className="color-input"
                  value={formData.styling.borderColor}
                  onChange={(e) => updateStyling({ borderColor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Button Color</label>
                <input
                  type="color"
                  className="color-input"
                  value={formData.styling.buttonColor}
                  onChange={(e) => updateStyling({ buttonColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Layout</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Spacing</label>
                <select
                  className="form-select"
                  value={formData.styling.spacing}
                  onChange={(e) => updateStyling({ spacing: e.target.value })}
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Border Radius</label>
                <select
                  className="form-select"
                  value={formData.styling.borderRadius}
                  onChange={(e) => updateStyling({ borderRadius: e.target.value })}
                >
                  <option value="0">None</option>
                  <option value="4px">Small</option>
                  <option value="6px">Medium</option>
                  <option value="12px">Large</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Custom CSS</h3>
            <div className="form-group">
              <label className="form-label">Additional CSS</label>
              <textarea
                className="form-textarea"
                value={formData.styling.customCSS}
                onChange={(e) => updateStyling({ customCSS: e.target.value })}
                placeholder="/* Add custom CSS here */"
                style={{minHeight: '120px', fontFamily: 'monospace'}}
              />
            </div>
          </div>

          <div className="preview-container">
            <div className="preview-title">Live Preview</div>
            <div 
              style={{
                backgroundColor: formData.styling.backgroundColor,
                color: formData.styling.textColor,
                padding: '20px',
                borderRadius: formData.styling.borderRadius,
                border: `1px solid ${formData.styling.borderColor}`
              }}
            >
              <h3 style={{margin: '0 0 16px 0'}}>{formData.title || 'Form Preview'}</h3>
              {formData.description && (
                <p style={{margin: '0 0 20px 0', color: '#6b7280'}}>{formData.description}</p>
              )}
              
              {formData.fields.slice(0, 3).map(field => (
                <div key={field.id} style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: '500'}}>
                    {field.label} {field.required && '*'}
                  </label>
                  <input
                    type={field.type === 'textarea' ? 'text' : field.type}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formData.styling.borderColor}`,
                      borderRadius: formData.styling.borderRadius,
                      fontSize: '14px'
                    }}
                    disabled
                  />
                </div>
              ))}
              
              <button
                style={{
                  background: formData.styling.buttonColor,
                  color: formData.styling.buttonTextColor,
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: formData.styling.borderRadius,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {formData.settings.submitText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
