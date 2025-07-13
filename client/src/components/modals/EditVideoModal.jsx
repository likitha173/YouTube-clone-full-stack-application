import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './editvideomodal.css';

export default function EditVideoModal({ video, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        visibility: 'public',
        thumbnail: null,
        allowComments: true,
        allowRatings: true
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Categories for the dropdown
    const categories = [
        'Music',
        'Gaming',
        'News',
        'Sports',
        'Learning',
        'Fashion',
        'Technology',
        'Entertainment',
        'Cooking',
        'Travel',
        'Science',
        'Comedy',
        'Fitness',
        'Other'
    ];

    useEffect(() => {
        if (video && isOpen) {
            setFormData({
                title: video.title || '',
                description: video.description || '',
                category: video.category || '',
                tags: video.tags ? video.tags.join(', ') : '',
                visibility: video.visibility || 'public',
                thumbnail: null,
                allowComments: video.allowComments !== false,
                allowRatings: video.allowRatings !== false
            });
            setErrors({});

            // Prevent body scroll
            document.body.classList.add('modal-open');
        } else if (!isOpen) {
            // Re-enable body scroll
            document.body.classList.remove('modal-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [video, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: 'Please select a valid image file'
                }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: 'File size must be less than 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                thumbnail: file
            }));

            if (errors.thumbnail) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 5000) {
            newErrors.description = 'Description must be less than 5000 characters';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const updateData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            await onSave(video._id, updateData);
            onClose();
        } catch (error) {
            console.error('Failed to update video:', error);
            setErrors({ submit: 'Failed to update video. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            tags: '',
            visibility: 'public',
            thumbnail: null,
            allowComments: true,
            allowRatings: true
        });
        setErrors({});
        document.body.classList.remove('modal-open');
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="edit-video-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Video Details</h2>
                    <button className="close-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-content">
                    {errors.submit && (
                        <div className="error-banner">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">
                            Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={errors.title ? 'error' : ''}
                            placeholder="Enter video title"
                            maxLength={100}
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                        <div className="char-count">{formData.title.length}/100</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={errors.description ? 'error' : ''}
                            placeholder="Tell viewers about your video"
                            rows={4}
                            maxLength={5000}
                        />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                        <div className="char-count">{formData.description.length}/5000</div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">
                                Category <span className="required">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <span className="error-text">{errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="visibility">Visibility</label>
                            <select
                                id="visibility"
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleInputChange}
                            >
                                <option value="public">Public</option>
                                <option value="unlisted">Unlisted</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="Enter tags separated by commas"
                        />
                        <div className="help-text">
                            Add tags to help people find your video. Separate tags with commas.
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="thumbnail">Custom Thumbnail</label>
                        <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={errors.thumbnail ? 'error' : ''}
                        />
                        {errors.thumbnail && <span className="error-text">{errors.thumbnail}</span>}
                        <div className="help-text">
                            Upload a custom thumbnail image (max 5MB). Recommended size: 1280×720px.
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="allowComments"
                                    checked={formData.allowComments}
                                    onChange={handleInputChange}
                                />
                                <span className="checkbox-custom"></span>
                                Allow comments
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="allowRatings"
                                    checked={formData.allowRatings}
                                    onChange={handleInputChange}
                                />
                                <span className="checkbox-custom"></span>
                                Allow likes and dislikes
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Render modal using portal to avoid container constraints
    return createPortal(modalContent, document.body);
}
