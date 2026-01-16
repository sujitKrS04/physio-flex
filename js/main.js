/* ========================================
   MAIN APPLICATION
   Physio-Flex - AI Fitness Trainer
   ======================================== */

import { getExercise } from './exercises.js';
import { calculateAngle, AngleTracker } from './angle-calculator.js';
import { cameraManager } from './camera.js';
import { poseDetector } from './pose-detection.js';
import { createRepCounter } from './rep-counter.js';
import { CanvasRenderer } from './canvas-renderer.js';
import { UIController } from './ui-controller.js';

/**
 * Main Application Class
 */
class PhysioFlexApp {
    constructor() {
        // Core components
        this.ui = new UIController();
        this.camera = cameraManager;
        this.pose = poseDetector;
        this.renderer = null;
        this.repCounter = null;
        this.angleTracker = new AngleTracker(10);
        
        // State
        this.currentExercise = null;
        this.isRunning = false;
        this.animationFrame = null;
        this.totalCalories = 0;
        
        // Settings
        this.settings = {
            strictMode: 'normal',
            voiceFeedback: false,
            showSkeleton: true
        };

        // Load settings from localStorage
        this.loadSettings();
    }

    /**
     * Initialize application
     */
    async initialize() {
        console.log('🏋️ Initializing Physio-Flex...');

        try {
            // Initialize UI
            this.ui.initialize();

            // Get DOM elements
            const elements = this.ui.getElements();

            // Initialize canvas renderer
            this.renderer = new CanvasRenderer(elements.outputCanvas);

            // Initialize camera
            this.camera.initialize(elements.videoElement);

            // Setup event listeners
            this.setupEventListeners();

            // Setup theme toggle
            this.setupThemeToggle();

            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.ui.showError('Failed to initialize application');
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        const elements = this.ui.getElements();

        // Exercise selection
        elements.exerciseSelect.addEventListener('change', (e) => {
            this.handleExerciseChange(e.target.value);
        });

        // Camera controls
        elements.startCameraBtn.addEventListener('click', () => {
            this.startWorkout();
        });

        elements.stopCameraBtn.addEventListener('click', () => {
            this.stopWorkout();
        });

        elements.resetBtn.addEventListener('click', () => {
            this.resetCounter();
        });

        // Settings
        const strictModeSelect = document.getElementById('strictMode');
        const voiceFeedbackCheck = document.getElementById('voiceFeedback');
        const showSkeletonCheck = document.getElementById('showSkeleton');

        if (strictModeSelect) {
            strictModeSelect.addEventListener('change', (e) => {
                this.settings.strictMode = e.target.value;
                this.saveSettings();
            });
        }

        if (voiceFeedbackCheck) {
            voiceFeedbackCheck.addEventListener('change', (e) => {
                this.settings.voiceFeedback = e.target.checked;
                this.saveSettings();
            });
        }

        if (showSkeletonCheck) {
            showSkeletonCheck.addEventListener('change', (e) => {
                this.settings.showSkeleton = e.target.checked;
                this.renderer.toggleSkeleton(e.target.checked);
                this.saveSettings();
            });
        }

        // Summary modal close
        const summaryCloseBtn = document.getElementById('summaryCloseBtn');
        if (summaryCloseBtn) {
            summaryCloseBtn.addEventListener('click', () => {
                this.ui.hideModal('summaryModal');
            });
        }
    }

    /**
     * Setup theme toggle
     */
    setupThemeToggle() {
        const themeToggle = this.ui.getElements().themeToggle;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('physio-flex-theme') || 'dark';
        document.body.className = `theme-${savedTheme}`;

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.className = `theme-${newTheme}`;
            localStorage.setItem('physio-flex-theme', newTheme);

            console.log(`Theme changed to: ${newTheme}`);
        });
    }

    /**
     * Handle exercise selection change
     * @param {string} exerciseId - Selected exercise ID
     */
    handleExerciseChange(exerciseId) {
        if (!exerciseId) {
            this.ui.hideExerciseInfo();
            return;
        }

        const exercise = getExercise(exerciseId);
        
        if (exercise) {
            this.currentExercise = exercise;
            this.ui.showExerciseInfo(exercise);
            
            // Reset if already running
            if (this.isRunning) {
                this.resetCounter();
            }

            console.log(`Selected exercise: ${exercise.name}`);
        }
    }

    /**
     * Start workout
     */
    async startWorkout() {
        if (!this.currentExercise) {
            this.ui.showError('Please select an exercise first');
            return;
        }

        if (this.isRunning) {
            console.log('Workout already running');
            return;
        }

        try {
            this.ui.showLoading('Starting camera...');
            this.ui.updateStatus('Starting camera...', 'info');

            // Start camera
            await this.camera.startCamera();
            this.ui.updateStatus('Camera started', 'success');

            // Initialize pose detector
            this.ui.showLoading('Initializing AI model...');
            await this.pose.initialize(this.ui.getElements().videoElement, {
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            // Setup pose results callback
            this.pose.start((results) => this.handlePoseResults(results));

            // Initialize rep counter
            this.repCounter = createRepCounter(this.currentExercise);
            this.repCounter.setCallbacks({
                onRepComplete: (data) => this.handleRepComplete(data),
                onFormFeedback: (message, type) => this.ui.showFeedback(message, type)
            });

            // Show UI elements
            this.ui.hideWelcomeScreen();
            this.ui.hideLoading();
            this.ui.showStatsCard();
            this.ui.startSessionTimer();
            this.ui.updateButtonStates(true);

            // Start processing loop
            this.isRunning = true;
            this.processingLoop();

            console.log('✅ Workout started');

        } catch (error) {
            console.error('Error starting workout:', error);
            this.ui.hideLoading();
            this.ui.showError(error.message || 'Failed to start workout');
            this.stopWorkout();
        }
    }

    /**
     * Stop workout
     */
    stopWorkout() {
        if (!this.isRunning) {
            console.log('Workout not running');
            return;
        }

        // Stop processing loop
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        // Stop components
        this.pose.stop();
        this.camera.stopCamera();
        this.ui.stopSessionTimer();

        // Clear canvas
        this.renderer.clear();

        // Update UI
        this.ui.updateButtonStates(false);
        this.ui.updateStatus('Camera stopped', 'info');

        // Show summary
        this.showWorkoutSummary();

        console.log('⏹️ Workout stopped');
    }

    /**
     * Reset counter
     */
    resetCounter() {
        if (this.repCounter) {
            this.repCounter.reset();
        }
        
        this.angleTracker.reset();
        this.totalCalories = 0;
        
        this.ui.resetStats();
        this.ui.showFeedback('Counter reset', 'info');
        
        console.log('🔄 Counter reset');
    }

    /**
     * Main processing loop
     */
    async processingLoop() {
        if (!this.isRunning) return;

        try {
            // Process frame
            await this.pose.processFrame();
            
            // Update FPS
            this.ui.updateFPS(this.pose.getFPS());

        } catch (error) {
            console.error('Processing error:', error);
        }

        // Schedule next frame
        this.animationFrame = requestAnimationFrame(() => this.processingLoop());
    }

    /**
     * Handle pose detection results
     * @param {Object} results - Pose detection results
     */
    handlePoseResults(results) {
        if (!this.isRunning || !results.poseLandmarks) {
            return;
        }

        const landmarks = results.poseLandmarks;

        // Get tracked joints based on exercise
        const joints = this.currentExercise.joints;
        const jointsAlt = this.currentExercise.jointsAlt;

        // Try primary joints first (right side)
        let trackedLandmarks = joints.map(idx => landmarks[idx]);
        let usingJoints = joints;

        // Check if all landmarks are visible
        const allVisible = trackedLandmarks.every(lm => 
            lm && lm.visibility && lm.visibility > 0.5
        );

        // If not visible, try alternative joints (left side)
        if (!allVisible && jointsAlt) {
            trackedLandmarks = jointsAlt.map(idx => landmarks[idx]);
            usingJoints = jointsAlt;
        }

        // Calculate angle
        if (trackedLandmarks.length >= 3) {
            const [pointA, pointB, pointC] = trackedLandmarks;
            
            if (pointA && pointB && pointC) {
                const angle = calculateAngle(pointA, pointB, pointC);
                const smoothedAngle = this.angleTracker.addAngle(angle);

                // Update rep counter
                const status = this.repCounter.update(smoothedAngle);

                // Update UI
                this.ui.updateAngle(smoothedAngle);
                this.ui.updateFormQuality(status.formQuality);

                // Render on canvas
                this.renderFrame(landmarks, usingJoints, smoothedAngle, status.formQuality);
            }
        }
    }

    /**
     * Render frame on canvas
     * @param {Array} landmarks - Pose landmarks
     * @param {Array} joints - Tracked joint indices
     * @param {number} angle - Current angle
     * @param {number} formQuality - Form quality percentage
     */
    renderFrame(landmarks, joints, angle, formQuality) {
        // Clear canvas
        this.renderer.clear();

        // Resize canvas if needed
        const { width, height } = this.camera.getVideoDimensions();
        if (this.renderer.width !== width || this.renderer.height !== height) {
            this.renderer.resize(width, height);
        }

        // Draw pose
        this.renderer.drawPose(landmarks, joints, angle, formQuality);
    }

    /**
     * Handle rep completion
     * @param {Object} data - Rep data
     */
    handleRepComplete(data) {
        // Update rep count
        this.ui.updateRepCount(data.repCount);

        // Calculate calories
        const caloriesPerRep = this.currentExercise.caloriesPerRep || 0.5;
        this.totalCalories += caloriesPerRep;
        this.ui.updateCalories(this.totalCalories);

        // Voice feedback (if enabled)
        if (this.settings.voiceFeedback) {
            this.speakFeedback(`${data.repCount} reps`);
        }

        console.log(`Rep ${data.repCount} completed (Form: ${data.formQuality}%)`);
    }

    /**
     * Show workout summary
     */
    showWorkoutSummary() {
        const duration = this.ui.getSessionDuration();
        const timeString = this.ui.formatTime(duration);
        
        const summary = {
            reps: this.repCounter ? this.repCounter.getStats().totalReps : 0,
            time: timeString,
            calories: Math.round(this.totalCalories),
            formQuality: this.repCounter ? this.repCounter.getStats().averageFormQuality : 100
        };

        this.ui.showSummary(summary);
    }

    /**
     * Speak feedback (Web Speech API)
     * @param {string} text - Text to speak
     */
    speakFeedback(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        localStorage.setItem('physio-flex-settings', JSON.stringify(this.settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('physio-flex-settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
}

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Physio-Flex Starting...');
    
    try {
        const app = new PhysioFlexApp();
        await app.initialize();
        
        // Make app globally accessible for debugging
        window.physioFlexApp = app;
        
        console.log('✨ Physio-Flex Ready!');
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        alert('Failed to start Physio-Flex. Please refresh the page and try again.');
    }
});

// Service Worker registration (optional - for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js').then(registration => {
        //     console.log('ServiceWorker registered:', registration);
        // }).catch(error => {
        //     console.log('ServiceWorker registration failed:', error);
        // });
    });
}
