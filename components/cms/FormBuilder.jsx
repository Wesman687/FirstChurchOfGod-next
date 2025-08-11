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
          border-bottom: 1px solid #f1f5f9;
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
          color: #374151;
        }
        
        .field-type-name {
          font-size: 12px;
          color: #6b7280;
        }
        
        .field-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .action-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .expand-btn {
          background: #f3f4f6;
          color: #374151;
        }
        
        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
        }
        
        .field-config {
          padding: 16px;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
        }
        
        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .config-full {
          grid-column: 1 / -1;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .form-label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .option-item {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .option-input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .remove-option {
          width: 24px;
          height: 24px;
          background: #fef2f2;
          color: #dc2626;
          border: none;
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
        }
        
        .preview-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }
        
        .preview-option {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .preview-required {
          color: #dc2626;
        }
      `}</style>

      <div className="field-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="field-info">
          <div className="drag-handle" {...dragHandleProps}>
            ⋮⋮
          </div>
          <div className="field-type">
            {FIELD_TYPES.find(t => t.id === field.type)?.icon}
          </div>
          <div className="field-details">
            <div className="field-label">
              {field.label || 'Untitled Field'}
              {field.required && <span className="preview-required"> *</span>}
            </div>
            <div className="field-type-name">
              {FIELD_TYPES.find(t => t.id === field.type)?.name}
            </div>
          </div>
        </div>
        <div className="field-actions">
          <button
            className="action-btn expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="field-config">
          {/* Basic Settings */}
          <div className="config-grid">
            <div className="form-group">
              <label className="form-label">Field Label</label>
              <input
                className="form-input"
                value={field.label || ''}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Enter field label"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Placeholder</label>
              <input
                className="form-input"
                value={field.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          </div>

          {/* Options for select, radio, checkbox */}
          {['select', 'radio', 'checkbox'].includes(field.type) && (
            <div className="form-group config-full">
              <label className="form-label">Options</label>
              <div className="options-list">
                {(field.options || []).map((option, index) => (
                  <div key={index} className="option-item">
                    <input
                      className="option-input"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(field.options || [])];
                        newOptions[index] = e.target.value;
                        updateField({ options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      className="remove-option"
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index);
                        updateField({ options: newOptions });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="add-option"
                  onClick={() => {
                    const newOptions = [...(field.options || []), ''];
                    updateField({ options: newOptions });
                  }}
                >
                  + Add Option
                </button>
              </div>
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
          readOnly
        />
      );
    case 'select':
      return (
        <select className="preview-select" readOnly>
          <option>{field.placeholder || 'Select an option'}</option>
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
              <input type="radio" name={field.id} value={option} readOnly />
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
              <input type="checkbox" value={option} readOnly />
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
          readOnly
        />
      );
  }
}

// Main Form Builder Component
const FormBuilder = ({ initialData = {}, onSave, className = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [],
    settings: {
      submitMessage: 'Thank you for your submission!',
      emailNotifications: [],
      allowMultiple: true,
      captcha: false
    },
    styling: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      buttonColor: '#3b82f6'
    },
    ...initialData
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = (fieldType) => {
    const newField = {
      id: uuidv4(),
      type: fieldType,
      label: '',
      placeholder: '',
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(fieldType) ? ['Option 1'] : undefined,
      validation: {}
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updatedField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? updatedField : field
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

  return (
    <div className={`form-builder ${className}`}>
      <style jsx>{`
        .form-builder {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .builder-header {
          margin-bottom: 24px;
        }
        
        .builder-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .builder-subtitle {
          color: #6b7280;
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
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          transition: all 0.2s;
        }
        
        .field-type-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        .form-canvas {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px;
          min-height: 500px;
        }
        
        .form-settings {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
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
          gap: 4px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .form-textarea {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          min-height: 80px;
          resize: vertical;
        }
        
        .fields-container {
          margin-bottom: 24px;
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
        }
        
        .save-btn:hover {
          background: #2563eb;
        }
      `}</style>

      <div className="builder-header">
        <h1 className="builder-title">Form Builder</h1>
        <p className="builder-subtitle">Create custom forms with drag and drop</p>
      </div>

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
    </div>
  );
};

export default FormBuilder;
