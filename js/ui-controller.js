/* ========================================
   UI CONTROLLER
   DOM Manipulation and User Interface Updates
   ======================================== */

import { getFormCategory } from './angle-calculator.js';

/**
 * UI Controller Class
 * Manages all DOM updates and user interface interactions
 */
export class UIController {
    constructor() {
        // Cache DOM elements
        this.elements = {
            // Exercise selection
            exerciseSelect: document.getElementById('exerciseSelect'),
            exerciseInfo: document.getElementById('exerciseInfo'),
            exerciseName: document.getElementById('exerciseName'),
            targetMuscle: document.getElementById('targetMuscle'),
            difficulty: document.getElementById('difficulty'),
            exerciseDescription: document.getElementById('exerciseDescription'),
            exerciseTips: document.getElementById('tipText'),

            // Stats
            statsCard: document.getElementById('statsCard'),
            repCount: document.getElementById('repCount'),
            angleValue: document.getElementById('angleValue'),
            gaugeProgress: document.getElementById('gaugeProgress'),
            formBadge: document.getElementById('formBadge'),
            formText: document.getElementById('formText'),
            formPercentage: document.getElementById('formPercentage'),
            sessionTimer: document.getElementById('sessionTimer'),
            calorieCount: document.getElementById('calorieCount'),

            // Controls
            startCameraBtn: document.getElementById('startCameraBtn'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            resetBtn: document.getElementById('resetBtn'),
            statusText: document.getElementById('statusText'),

            // Canvas
            videoElement: document.getElementById('videoElement'),
            outputCanvas: document.getElementById('outputCanvas'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            feedbackMessage: document.getElementById('feedbackMessage'),
            fpsValue: document.getElementById('fpsValue'),

            // Modals
            settingsModal: document.getElementById('settingsModal'),
            summaryModal: document.getElementById('summaryModal'),
            settingsBtn: document.getElementById('settingsBtn'),
            themeToggle: document.getElementById('themeToggle')
        };

        // State
        this.sessionStartTime = null;
        this.timerInterval = null;
        this.feedbackTimeout = null;
    }

    /**
     * Initialize UI controller
     */
    initialize() {
        this.setupModalListeners();
        console.log('UI Controller initialized');
    }

    /**
     * Setup modal event listeners
     */
    setupModalListeners() {
        // Settings modal
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => {
                this.showModal('settingsModal');
            });
        }

        // Close modal buttons
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    /**
     * Show exercise information
     * @param {Object} exercise - Exercise configuration
     */
    showExerciseInfo(exercise) {
        if (!exercise) return;

        this.elements.exerciseName.textContent = exercise.name;
        this.elements.targetMuscle.textContent = exercise.targetMuscle;
        this.elements.difficulty.textContent = exercise.difficulty;
        this.elements.exerciseDescription.textContent = exercise.description;
        this.elements.exerciseTips.textContent = exercise.tips;

        // Show exercise info card
        this.elements.exerciseInfo.style.display = 'block';
        this.elements.exerciseInfo.classList.add('slide-in');
    }

    /**
     * Hide exercise information
     */
    hideExerciseInfo() {
        this.elements.exerciseInfo.style.display = 'none';
    }

    /**
     * Show stats card
     */
    showStatsCard() {
        this.elements.statsCard.style.display = 'block';
        this.elements.statsCard.classList.add('slide-in');
    }

    /**
     * Hide stats card
     */
    hideStatsCard() {
        this.elements.statsCard.style.display = 'none';
    }

    /**
     * Update rep counter display
     * @param {number} reps - Current rep count
     */
    updateRepCount(reps) {
        this.elements.repCount.textContent = reps;
        this.elements.repCount.classList.add('rep-pop');
        
        setTimeout(() => {
            this.elements.repCount.classList.remove('rep-pop');
        }, 500);
    }

    /**
     * Update angle display and gauge
     * @param {number} angle - Current angle in degrees
     */
    updateAngle(angle) {
        const roundedAngle = Math.round(angle);
        this.elements.angleValue.textContent = `${roundedAngle}°`;

        // Update gauge (0-180° maps to stroke-dashoffset)
        const maxDashOffset = 251.2; // Full circumference
        const dashOffset = maxDashOffset - (angle / 180) * maxDashOffset;
        this.elements.gaugeProgress.style.strokeDashoffset = dashOffset;
    }

    /**
     * Update form quality badge
     * @param {number} qualityPercentage - Form quality (0-100)
     */
    updateFormQuality(qualityPercentage) {
        const category = getFormCategory(qualityPercentage);
        
        // Update text
        this.elements.formText.textContent = category.category;
        this.elements.formPercentage.textContent = `${Math.round(qualityPercentage)}%`;

        // Update badge style
        this.elements.formBadge.className = `form-badge ${category.cssClass}`;
    }

    /**
     * Update session timer
     */
    startSessionTimer() {
        this.sessionStartTime = Date.now();
        
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            
            const timeString = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
            this.elements.sessionTimer.textContent = timeString;
        }, 1000);
    }

    /**
     * Stop session timer
     */
    stopSessionTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Reset session timer
     */
    resetSessionTimer() {
        this.stopSessionTimer();
        this.elements.sessionTimer.textContent = '00:00';
        this.sessionStartTime = null;
    }

    /**
     * Update calorie count
     * @param {number} calories - Calories burned
     */
    updateCalories(calories) {
        this.elements.calorieCount.innerHTML = `${Math.round(calories)} <span class="stat-unit">kcal</span>`;
    }

    /**
     * Update camera status
     * @param {string} status - Status message
     * @param {string} type - Status type (info, success, error)
     */
    updateStatus(status, type = 'info') {
        this.elements.statusText.textContent = status;
        
        // Could add color coding based on type
        if (type === 'error') {
            this.elements.statusText.style.color = 'var(--color-error)';
        } else if (type === 'success') {
            this.elements.statusText.style.color = 'var(--color-success)';
        } else {
            this.elements.statusText.style.color = 'var(--text-secondary)';
        }
    }

    /**
     * Update FPS display
     * @param {number} fps - Current FPS
     */
    updateFPS(fps) {
        this.elements.fpsValue.textContent = fps;
    }

    /**
     * Show feedback message
     * @param {string} message - Feedback message
     * @param {string} type - Message type (good, fair, poor, success)
     */
    showFeedback(message, type = 'info') {
        // Clear existing timeout
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }

        this.elements.feedbackMessage.textContent = message;
        this.elements.feedbackMessage.style.display = 'block';
        
        // Apply color based on type
        const colors = {
            good: 'var(--color-success)',
            fair: 'var(--color-warning)',
            poor: 'var(--color-error)',
            success: 'var(--color-success)',
            info: 'var(--color-primary)'
        };
        
        this.elements.feedbackMessage.style.color = colors[type] || colors.info;
        this.elements.feedbackMessage.classList.add('notification-slide-in');

        // Auto-hide after 3 seconds
        this.feedbackTimeout = setTimeout(() => {
            this.hideFeedback();
        }, 3000);
    }

    /**
     * Hide feedback message
     */
    hideFeedback() {
        this.elements.feedbackMessage.style.display = 'none';
        this.elements.feedbackMessage.classList.remove('notification-slide-in');
    }

    /**
     * Show loading indicator
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        this.elements.loadingIndicator.querySelector('p').textContent = message;
        this.elements.loadingIndicator.style.display = 'flex';
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
    }

    /**
     * Show welcome screen
     */
    showWelcomeScreen() {
        this.elements.welcomeScreen.style.display = 'flex';
    }

    /**
     * Hide welcome screen
     */
    hideWelcomeScreen() {
        this.elements.welcomeScreen.style.display = 'none';
    }

    /**
     * Enable camera controls
     */
    enableControls() {
        this.elements.startCameraBtn.disabled = false;
        this.elements.stopCameraBtn.disabled = false;
        this.elements.resetBtn.disabled = false;
    }

    /**
     * Disable camera controls
     */
    disableControls() {
        this.elements.startCameraBtn.disabled = true;
        this.elements.stopCameraBtn.disabled = true;
        this.elements.resetBtn.disabled = true;
    }

    /**
     * Update button states based on camera status
     * @param {boolean} isActive - Camera is active
     */
    updateButtonStates(isActive) {
        if (isActive) {
            this.elements.startCameraBtn.disabled = true;
            this.elements.stopCameraBtn.disabled = false;
            this.elements.resetBtn.disabled = false;
        } else {
            this.elements.startCameraBtn.disabled = false;
            this.elements.stopCameraBtn.disabled = true;
            this.elements.resetBtn.disabled = true;
        }
    }

    /**
     * Show modal
     * @param {string} modalId - Modal element ID
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * Hide modal
     * @param {string} modalId - Modal element ID
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Show workout summary modal
     * @param {Object} summary - Workout summary data
     */
    showSummary(summary) {
        document.getElementById('summaryReps').textContent = summary.reps || 0;
        document.getElementById('summaryTime').textContent = summary.time || '0:00';
        document.getElementById('summaryCalories').textContent = summary.calories || 0;
        document.getElementById('summaryForm').textContent = `${summary.formQuality || 100}%`;
        
        this.showModal('summaryModal');
    }

    /**
     * Reset all stats displays
     */
    resetStats() {
        this.updateRepCount(0);
        this.updateAngle(0);
        this.updateFormQuality(100);
        this.updateCalories(0);
        this.resetSessionTimer();
        this.hideFeedback();
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showFeedback(message, 'poor');
        this.updateStatus(message, 'error');
    }

    /**
     * Get DOM elements (for external access)
     * @returns {Object} DOM elements
     */
    getElements() {
        return this.elements;
    }

    /**
     * Get session duration in seconds
     * @returns {number} Duration in seconds
     */
    getSessionDuration() {
        if (!this.sessionStartTime) return 0;
        return Math.floor((Date.now() - this.sessionStartTime) / 1000);
    }

    /**
     * Format time for display
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time (MM:SS)
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

/**
 * Create UI controller instance
 * @returns {UIController} UI controller
 */
export function createUIController() {
    return new UIController();
}

// Export default
export default UIController;
