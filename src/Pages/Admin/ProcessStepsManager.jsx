import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';

const ProcessStepsManager = ({ processData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStep, setEditingStep] = useState(null);
  const [draggedStep, setDraggedStep] = useState(null);
  const processId = processData?.id;

  useEffect(() => {
    if (processId) {
      loadSteps();
    }
  }, [processId]);

  const loadSteps = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_process_steps')
        .select('*')
        .eq('process_id', processId)
        .order('sort_order');

      setSteps(data || []);
    } catch (err) {
      console.error('Error loading steps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    const newStep = {
      id: `temp_${Date.now()}`,
      step_number: steps.length + 1,
      title: '',
      description: '',
      icon_name: '',
      icon_url: '',
      sort_order: steps.length,
      isNew: true,
    };
    setSteps([...steps, newStep]);
    setEditingStep(newStep);
  };

  const handleSaveStep = async (step) => {
    if (!processId) {
      alert('Please save the Process component first');
      return;
    }

    try {
      if (step.isNew) {
        await supabase.from('component_process_steps').insert({
          process_id: processId,
          step_number: step.step_number,
          title: step.title,
          description: step.description,
          icon_name: step.icon_name,
          icon_url: step.icon_url,
          sort_order: step.sort_order,
        });
      } else {
        await supabase
          .from('component_process_steps')
          .update({
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            icon_name: step.icon_name,
            icon_url: step.icon_url,
            sort_order: step.sort_order,
          })
          .eq('id', step.id);
      }

      setEditingStep(null);
      loadSteps();
    } catch (err) {
      console.error('Error saving step:', err);
      alert('Error saving step: ' + err.message);
    }
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm('Delete this step?')) return;

    try {
      await supabase.from('component_process_steps').delete().eq('id', stepId);
      loadSteps();
    } catch (err) {
      console.error('Error deleting step:', err);
      alert('Error deleting step');
    }
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedStep);

    // Update step numbers and sort order
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      step_number: idx + 1,
      sort_order: idx,
    }));

    setSteps(updatedSteps);
    setDraggedStep(null);

    // Save all orders
    updatedSteps.forEach(step => {
      if (!step.isNew) {
        supabase
          .from('component_process_steps')
          .update({ sort_order: step.sort_order, step_number: step.step_number })
          .eq('id', step.id)
          .catch(err => console.error('Error updating order:', err));
      }
    });
  };

  return (
    <div className="item-manager-modal">
      <div className="item-manager-content">
        <div className="item-manager-header">
          <h3>Manage Process Steps ({template})</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading steps...</div>
        ) : (
          <>
            <div className="cards-list">
              {steps.length === 0 ? (
                <p className="no-items">No steps yet. Add your first step!</p>
              ) : (
                steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="card-item"
                    draggable
                    onDragStart={() => setDraggedStep(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedStep !== null && draggedStep !== index) {
                        handleReorder(draggedStep, index);
                      }
                    }}
                  >
                    <div className="card-content">
                      <FaGripVertical className="drag-icon" />
                      <div className="card-info">
                        <strong>Step {step.step_number}</strong>
                        <span>{step.title || 'Untitled'}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingStep(step)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="add-btn" onClick={handleAddStep}>
              <FaPlus /> Add New Step
            </button>
          </>
        )}

        {editingStep && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Step {editingStep.step_number}</h4>

              <div className="form-group">
                <label>Step Number</label>
                <input
                  type="number"
                  value={editingStep.step_number}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, step_number: parseInt(e.target.value) })
                  }
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingStep.title}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, title: e.target.value })
                  }
                  placeholder="Step title"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingStep.description}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, description: e.target.value })
                  }
                  placeholder="Step description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Icon Name (e.g., FaFileAlt)</label>
                <input
                  type="text"
                  value={editingStep.icon_name}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, icon_name: e.target.value })
                  }
                  placeholder="React icon name"
                />
              </div>

              <div className="form-group">
                <label>Icon Image URL</label>
                <input
                  type="url"
                  value={editingStep.icon_url}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, icon_url: e.target.value })
                  }
                  placeholder="Or provide image URL"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={() => handleSaveStep(editingStep)}
                >
                  <FaSave /> Save Step
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingStep(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessStepsManager;
