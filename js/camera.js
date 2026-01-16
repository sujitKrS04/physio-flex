/* ========================================
   CAMERA CONTROLLER
   Webcam Initialization and Controls
   ======================================== */

/**
 * Camera Manager Class
 * Handles webcam access, initialization, and controls
 */
export class CameraManager {
    constructor() {
        this.videoElement = null;
        this.stream = null;
        this.isActive = false;
        this.constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30, max: 60 },
                facingMode: 'user' // Front-facing camera
            },
            audio: false
        };
    }

    /**
     * Initialize camera manager with video element
     * @param {HTMLVideoElement} videoElement - Video element to attach stream
     */
    initialize(videoElement) {
        if (!videoElement) {
            throw new Error('Video element is required');
        }

        this.videoElement = videoElement;
        console.log('Camera manager initialized');
    }

    /**
     * Check if browser supports getUserMedia
     * @returns {boolean} True if supported
     */
    isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * Request camera permissions and start stream
     * @returns {Promise<MediaStream>} Camera stream
     */
    async startCamera() {
        if (!this.isSupported()) {
            throw new Error('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Edge.');
        }

        if (this.isActive) {
            console.log('Camera already active');
            return this.stream;
        }

        try {
            console.log('Requesting camera access...');
            
            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            
            // Attach stream to video element
            this.videoElement.srcObject = this.stream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });

            // Play video
            await this.videoElement.play();
            
            this.isActive = true;
            console.log('Camera started successfully');
            console.log(`Video resolution: ${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`);
            
            return this.stream;
            
        } catch (error) {
            this.isActive = false;
            console.error('Camera access error:', error);
            
            // Provide user-friendly error messages
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Camera access denied. Please grant permission to use your camera.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No camera found. Please connect a camera and try again.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Camera is already in use by another application. Please close other apps using the camera.');
            } else {
                throw new Error(`Camera error: ${error.message}`);
            }
        }
    }

    /**
     * Stop camera stream
     */
    stopCamera() {
        if (!this.isActive) {
            console.log('Camera not active');
            return;
        }

        try {
            // Stop all tracks
            if (this.stream) {
                this.stream.getTracks().forEach(track => {
                    track.stop();
                    console.log('Camera track stopped:', track.kind);
                });
            }

            // Clear video element
            if (this.videoElement) {
                this.videoElement.srcObject = null;
            }

            this.stream = null;
            this.isActive = false;
            
            console.log('Camera stopped successfully');
        } catch (error) {
            console.error('Error stopping camera:', error);
        }
    }

    /**
     * Pause camera stream (without stopping)
     */
    pauseCamera() {
        if (this.videoElement && this.isActive) {
            this.videoElement.pause();
            console.log('Camera paused');
        }
    }

    /**
     * Resume camera stream
     */
    resumeCamera() {
        if (this.videoElement && this.isActive) {
            this.videoElement.play();
            console.log('Camera resumed');
        }
    }

    /**
     * Get current video dimensions
     * @returns {Object} {width, height}
     */
    getVideoDimensions() {
        if (!this.videoElement) {
            return { width: 0, height: 0 };
        }

        return {
            width: this.videoElement.videoWidth,
            height: this.videoElement.videoHeight
        };
    }

    /**
     * Get camera status
     * @returns {Object} Camera status info
     */
    getStatus() {
        return {
            isActive: this.isActive,
            isSupported: this.isSupported(),
            dimensions: this.getVideoDimensions(),
            hasStream: !!this.stream
        };
    }

    /**
     * Switch camera (front/back) on mobile devices
     * @param {string} facingMode - 'user' (front) or 'environment' (back)
     */
    async switchCamera(facingMode = 'user') {
        const wasActive = this.isActive;
        
        if (wasActive) {
            this.stopCamera();
        }

        // Update constraints
        this.constraints.video.facingMode = facingMode;

        if (wasActive) {
            await this.startCamera();
        }

        console.log(`Camera facing mode changed to: ${facingMode}`);
    }

    /**
     * Take a screenshot from current video frame
     * @returns {string} Data URL of screenshot
     */
    takeScreenshot() {
        if (!this.videoElement || !this.isActive) {
            throw new Error('Camera not active');
        }

        // Create temporary canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        
        // Draw current video frame (flipped horizontally to match display)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.videoElement, 0, 0);

        // Convert to data URL
        return canvas.toDataURL('image/png');
    }

    /**
     * Download screenshot
     * @param {string} filename - File name for download
     */
    downloadScreenshot(filename = 'physio-flex-screenshot.png') {
        try {
            const dataUrl = this.takeScreenshot();
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            link.click();
            
            console.log('Screenshot downloaded');
        } catch (error) {
            console.error('Error downloading screenshot:', error);
        }
    }

    /**
     * Get available camera devices
     * @returns {Promise<Array>} List of video input devices
     */
    async getAvailableCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            
            console.log(`Found ${cameras.length} camera(s)`);
            return cameras;
        } catch (error) {
            console.error('Error enumerating devices:', error);
            return [];
        }
    }

    /**
     * Set specific camera device
     * @param {string} deviceId - Device ID to use
     */
    async setCameraDevice(deviceId) {
        const wasActive = this.isActive;
        
        if (wasActive) {
            this.stopCamera();
        }

        // Update constraints with specific device
        this.constraints.video.deviceId = { exact: deviceId };
        
        if (wasActive) {
            await this.startCamera();
        }

        console.log(`Camera device set to: ${deviceId}`);
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.stopCamera();
        this.videoElement = null;
        console.log('Camera manager destroyed');
    }
}

/**
 * Create and export singleton instance
 */
export const cameraManager = new CameraManager();

/**
 * Helper function to check camera permissions
 * @returns {Promise<string>} Permission state: 'granted', 'denied', or 'prompt'
 */
export async function checkCameraPermission() {
    try {
        if (navigator.permissions && navigator.permissions.query) {
            const result = await navigator.permissions.query({ name: 'camera' });
            return result.state;
        }
        return 'unknown';
    } catch (error) {
        console.log('Permission API not supported');
        return 'unknown';
    }
}

/**
 * Request camera permission with user-friendly prompts
 * @returns {Promise<boolean>} True if permission granted
 */
export async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Stop stream immediately (we just wanted to check permission)
        stream.getTracks().forEach(track => track.stop());
        
        return true;
    } catch (error) {
        console.error('Permission request failed:', error);
        return false;
    }
}

// Export default
export default cameraManager;
