/* ========================================
   POSE DETECTION ENGINE
   MediaPipe Pose Integration & Landmark Extraction
   ======================================== */

import { isLandmarkVisible } from './angle-calculator.js';

/**
 * Pose Detection Manager Class
 * Handles MediaPipe Pose initialization and processing
 */
export class PoseDetector {
    constructor() {
        this.pose = null;
        this.isInitialized = false;
        this.isProcessing = false;
        this.onResultsCallback = null;
        this.videoElement = null;
        
        // Performance tracking
        this.frameCount = 0;
        this.lastFrameTime = Date.now();
        this.fps = 0;
        
        // Pose detection results
        this.lastResults = null;
    }

    /**
     * Initialize MediaPipe Pose
     * @param {HTMLVideoElement} videoElement - Video element to process
     * @param {Object} config - Configuration options
     */
    async initialize(videoElement, config = {}) {
        if (this.isInitialized) {
            console.log('Pose detector already initialized');
            return;
        }

        this.videoElement = videoElement;

        try {
            console.log('Initializing MediaPipe Pose...');

            // Create Pose instance
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            // Configure pose detection options
            await this.pose.setOptions({
                modelComplexity: config.modelComplexity || 1, // 0=Lite, 1=Full, 2=Heavy
                smoothLandmarks: config.smoothLandmarks !== undefined ? config.smoothLandmarks : true,
                enableSegmentation: config.enableSegmentation || false,
                smoothSegmentation: config.smoothSegmentation || true,
                minDetectionConfidence: config.minDetectionConfidence || 0.5,
                minTrackingConfidence: config.minTrackingConfidence || 0.5
            });

            // Set up results callback
            this.pose.onResults((results) => this.handleResults(results));

            this.isInitialized = true;
            console.log('MediaPipe Pose initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize pose detector:', error);
            throw new Error('Failed to load AI model. Please refresh the page and try again.');
        }
    }

    /**
     * Handle pose detection results
     * @param {Object} results - MediaPipe pose results
     */
    handleResults(results) {
        this.lastResults = results;
        
        // Calculate FPS
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastFrameTime = now;
        }

        // Call user-defined callback
        if (this.onResultsCallback && typeof this.onResultsCallback === 'function') {
            this.onResultsCallback(results);
        }

        this.isProcessing = false;
    }

    /**
     * Process a single video frame
     */
    async processFrame() {
        if (!this.isInitialized || !this.videoElement) {
            return;
        }

        if (this.isProcessing) {
            return; // Skip frame if still processing
        }

        try {
            this.isProcessing = true;
            await this.pose.send({ image: this.videoElement });
        } catch (error) {
            console.error('Error processing frame:', error);
            this.isProcessing = false;
        }
    }

    /**
     * Start continuous pose detection
     * @param {Function} onResults - Callback function for results
     */
    start(onResults) {
        if (!this.isInitialized) {
            throw new Error('Pose detector not initialized');
        }

        this.onResultsCallback = onResults;
        console.log('Pose detection started');
    }

    /**
     * Stop pose detection
     */
    stop() {
        this.onResultsCallback = null;
        console.log('Pose detection stopped');
    }

    /**
     * Get current FPS
     * @returns {number} Current frames per second
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Get last detection results
     * @returns {Object} Last pose results
     */
    getLastResults() {
        return this.lastResults;
    }

    /**
     * Check if pose is detected in frame
     * @returns {boolean} True if pose detected
     */
    isPoseDetected() {
        return this.lastResults && 
               this.lastResults.poseLandmarks && 
               this.lastResults.poseLandmarks.length > 0;
    }

    /**
     * Get specific landmark by index
     * @param {number} landmarkIndex - Landmark index
     * @returns {Object|null} Landmark {x, y, z, visibility}
     */
    getLandmark(landmarkIndex) {
        if (!this.isPoseDetected()) {
            return null;
        }

        const landmarks = this.lastResults.poseLandmarks;
        
        if (landmarkIndex >= 0 && landmarkIndex < landmarks.length) {
            return landmarks[landmarkIndex];
        }

        return null;
    }

    /**
     * Get multiple landmarks by indices
     * @param {Array<number>} landmarkIndices - Array of landmark indices
     * @returns {Array<Object>} Array of landmarks
     */
    getLandmarks(landmarkIndices) {
        if (!Array.isArray(landmarkIndices)) {
            return [];
        }

        return landmarkIndices.map(index => this.getLandmark(index)).filter(lm => lm !== null);
    }

    /**
     * Check if all required landmarks are visible
     * @param {Array<number>} landmarkIndices - Required landmark indices
     * @param {number} minVisibility - Minimum visibility threshold
     * @returns {boolean} True if all landmarks visible
     */
    areLandmarksVisible(landmarkIndices, minVisibility = 0.5) {
        if (!this.isPoseDetected()) {
            return false;
        }

        for (const index of landmarkIndices) {
            const landmark = this.getLandmark(index);
            if (!landmark || !isLandmarkVisible(landmark, minVisibility)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convert normalized coordinates to pixel coordinates
     * @param {Object} landmark - Normalized landmark {x, y}
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} Pixel coordinates {x, y}
     */
    static toPixelCoordinates(landmark, width, height) {
        return {
            x: landmark.x * width,
            y: landmark.y * height,
            z: landmark.z || 0,
            visibility: landmark.visibility
        };
    }

    /**
     * Get all landmarks in pixel coordinates
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Array<Object>} Array of pixel coordinates
     */
    getPixelLandmarks(width, height) {
        if (!this.isPoseDetected()) {
            return [];
        }

        return this.lastResults.poseLandmarks.map(landmark => 
            PoseDetector.toPixelCoordinates(landmark, width, height)
        );
    }

    /**
     * Get pose world landmarks (3D coordinates in meters)
     * @returns {Array<Object>|null} 3D world landmarks
     */
    getWorldLandmarks() {
        if (!this.isPoseDetected()) {
            return null;
        }

        return this.lastResults.poseWorldLandmarks || null;
    }

    /**
     * Update detector configuration
     * @param {Object} config - New configuration options
     */
    async updateConfig(config) {
        if (!this.isInitialized) {
            throw new Error('Pose detector not initialized');
        }

        await this.pose.setOptions(config);
        console.log('Pose detector configuration updated');
    }

    /**
     * Reset detector state
     */
    reset() {
        this.lastResults = null;
        this.frameCount = 0;
        this.fps = 0;
        console.log('Pose detector state reset');
    }

    /**
     * Cleanup and release resources
     */
    async destroy() {
        this.stop();
        
        if (this.pose) {
            await this.pose.close();
            this.pose = null;
        }

        this.isInitialized = false;
        this.videoElement = null;
        this.lastResults = null;
        
        console.log('Pose detector destroyed');
    }
}

/**
 * Pose Connections for skeleton drawing
 * Defines which landmarks connect to each other
 */
export const POSE_CONNECTIONS = [
    // Face
    [0, 1], [1, 2], [2, 3], [3, 7],
    [0, 4], [4, 5], [5, 6], [6, 8],
    [9, 10],
    
    // Torso
    [11, 12], [11, 23], [12, 24], [23, 24],
    
    // Right arm
    [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
    [18, 20],
    
    // Left arm
    [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
    [17, 19],
    
    // Right leg
    [24, 26], [26, 28], [28, 30], [28, 32],
    [30, 32],
    
    // Left leg
    [23, 25], [25, 27], [27, 29], [27, 31],
    [29, 31]
];

/**
 * Get landmark name by index
 * @param {number} index - Landmark index
 * @returns {string} Landmark name
 */
export function getLandmarkName(index) {
    const names = [
        'Nose', 'Left Eye Inner', 'Left Eye', 'Left Eye Outer',
        'Right Eye Inner', 'Right Eye', 'Right Eye Outer',
        'Left Ear', 'Right Ear', 'Mouth Left', 'Mouth Right',
        'Left Shoulder', 'Right Shoulder', 'Left Elbow', 'Right Elbow',
        'Left Wrist', 'Right Wrist', 'Left Pinky', 'Right Pinky',
        'Left Index', 'Right Index', 'Left Thumb', 'Right Thumb',
        'Left Hip', 'Right Hip', 'Left Knee', 'Right Knee',
        'Left Ankle', 'Right Ankle', 'Left Heel', 'Right Heel',
        'Left Foot Index', 'Right Foot Index'
    ];
    
    return names[index] || `Landmark ${index}`;
}

/**
 * Create and export singleton instance
 */
export const poseDetector = new PoseDetector();

// Export default
export default poseDetector;
