/* ========================================
   CANVAS RENDERER
   Skeleton Drawing and Visualization
   ======================================== */

import { POSE_CONNECTIONS } from './pose-detection.js';
import { getFormCategory } from './angle-calculator.js';

/**
 * Canvas Renderer Class
 * Handles drawing pose skeleton, landmarks, and visualizations
 */
export class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        
        // Rendering options
        this.showSkeleton = true;
        this.showLandmarks = true;
        this.showAngleLabels = true;
        this.mirrorMode = true; // Mirror for natural movement
        
        // Colors
        this.colors = {
            good: '#00ff88',
            fair: '#ffa500',
            poor: '#ff6b6b',
            primary: '#00d9ff',
            landmark: '#00d9ff',
            connection: '#00d9ff',
            text: '#ffffff'
        };

        // Font settings
        this.fonts = {
            angle: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            label: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        };
    }

    /**
     * Resize canvas to match video dimensions
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Draw pose landmarks and skeleton
     * @param {Array} landmarks - Pose landmarks (normalized 0-1)
     * @param {Object} trackedJoints - Currently tracked joint indices
     * @param {number} currentAngle - Current joint angle
     * @param {number} formQuality - Form quality percentage
     */
    drawPose(landmarks, trackedJoints = null, currentAngle = null, formQuality = 100) {
        if (!landmarks || landmarks.length === 0) {
            return;
        }

        // Convert normalized to pixel coordinates
        const pixelLandmarks = landmarks.map(lm => ({
            x: lm.x * this.width,
            y: lm.y * this.height,
            z: lm.z,
            visibility: lm.visibility
        }));

        // Apply mirror effect
        if (this.mirrorMode) {
            pixelLandmarks.forEach(lm => {
                lm.x = this.width - lm.x;
            });
        }

        // Determine color based on form quality
        const formCategory = getFormCategory(formQuality);
        const activeColor = formCategory.color;

        // Draw connections (skeleton)
        if (this.showSkeleton) {
            this.drawConnections(pixelLandmarks, trackedJoints, activeColor);
        }

        // Draw landmarks (joints)
        if (this.showLandmarks) {
            this.drawLandmarks(pixelLandmarks, trackedJoints, activeColor);
        }

        // Draw angle label
        if (this.showAngleLabels && trackedJoints && currentAngle !== null) {
            this.drawAngleLabel(pixelLandmarks, trackedJoints, currentAngle, activeColor);
        }
    }

    /**
     * Draw skeleton connections
     * @param {Array} landmarks - Pixel landmark coordinates
     * @param {Object} trackedJoints - Currently tracked joints
     * @param {string} activeColor - Color for tracked joints
     */
    drawConnections(landmarks, trackedJoints, activeColor) {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];

            // Skip if landmarks not visible enough
            if (!start || !end || 
                (start.visibility && start.visibility < 0.5) ||
                (end.visibility && end.visibility < 0.5)) {
                return;
            }

            // Determine color
            let color = this.colors.connection;
            
            if (trackedJoints && (
                (trackedJoints.includes(startIdx) && trackedJoints.includes(endIdx)) ||
                (startIdx === trackedJoints[1] && (endIdx === trackedJoints[0] || endIdx === trackedJoints[2])) ||
                (endIdx === trackedJoints[1] && (startIdx === trackedJoints[0] || startIdx === trackedJoints[2]))
            )) {
                color = activeColor;
                this.ctx.lineWidth = 5;
            } else {
                this.ctx.lineWidth = 2;
            }

            // Draw line with gradient
            const gradient = this.ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color + '80'); // Add transparency

            this.ctx.strokeStyle = gradient;
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 10;

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();

            // Reset shadow
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Draw landmark points
     * @param {Array} landmarks - Pixel landmark coordinates
     * @param {Object} trackedJoints - Currently tracked joints
     * @param {string} activeColor - Color for tracked joints
     */
    drawLandmarks(landmarks, trackedJoints, activeColor) {
        landmarks.forEach((landmark, index) => {
            // Skip if not visible enough
            if (landmark.visibility && landmark.visibility < 0.5) {
                return;
            }

            // Determine size and color
            let radius = 4;
            let color = this.colors.landmark;

            if (trackedJoints && trackedJoints.includes(index)) {
                radius = 8;
                color = activeColor;
            }

            // Draw outer glow
            this.ctx.beginPath();
            this.ctx.arc(landmark.x, landmark.y, radius + 3, 0, 2 * Math.PI);
            this.ctx.fillStyle = color + '40'; // Transparent glow
            this.ctx.fill();

            // Draw main circle
            this.ctx.beginPath();
            this.ctx.arc(landmark.x, landmark.y, radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Draw inner highlight
            this.ctx.beginPath();
            this.ctx.arc(landmark.x - radius/3, landmark.y - radius/3, radius/2, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.fill();
        });
    }

    /**
     * Draw angle label near joint
     * @param {Array} landmarks - Pixel landmark coordinates
     * @param {Array} trackedJoints - Joint indices [A, B, C]
     * @param {number} angle - Angle value
     * @param {string} color - Text color
     */
    drawAngleLabel(landmarks, trackedJoints, angle, color) {
        if (!trackedJoints || trackedJoints.length < 3) {
            return;
        }

        // Get vertex landmark (middle joint)
        const vertex = landmarks[trackedJoints[1]];
        
        if (!vertex || (vertex.visibility && vertex.visibility < 0.5)) {
            return;
        }

        const angleText = `${Math.round(angle)}°`;

        // Draw background
        this.ctx.font = this.fonts.angle;
        const metrics = this.ctx.measureText(angleText);
        const padding = 8;
        const bgWidth = metrics.width + padding * 2;
        const bgHeight = 30;

        const x = vertex.x + 20;
        const y = vertex.y - 20;

        // Background with glass effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.roundRect(x, y - bgHeight/2, bgWidth, bgHeight, 8);
        this.ctx.fill();
        this.ctx.stroke();

        // Text
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(angleText, x + bgWidth/2, y);
    }

    /**
     * Draw rounded rectangle
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} radius - Corner radius
     */
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    /**
     * Draw range indicator arc
     * @param {Array} landmarks - Pixel landmark coordinates
     * @param {Array} trackedJoints - Joint indices
     * @param {Object} thresholds - Exercise thresholds {down, up}
     * @param {number} currentAngle - Current angle
     */
    drawRangeIndicator(landmarks, trackedJoints, thresholds, currentAngle) {
        if (!trackedJoints || trackedJoints.length < 3) {
            return;
        }

        const vertex = landmarks[trackedJoints[1]];
        const pointA = landmarks[trackedJoints[0]];
        const pointC = landmarks[trackedJoints[2]];

        if (!vertex || !pointA || !pointC) {
            return;
        }

        const radius = 50;

        // Calculate start angle
        const angleA = Math.atan2(pointA.y - vertex.y, pointA.x - vertex.x);
        const angleC = Math.atan2(pointC.y - vertex.y, pointC.x - vertex.x);

        // Draw target range arc
        this.ctx.strokeStyle = this.colors.primary + '40';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(vertex.x, vertex.y, radius, angleA, angleC, false);
        this.ctx.stroke();
    }

    /**
     * Draw text with background
     * @param {string} text - Text to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Text color
     */
    drawTextWithBackground(text, x, y, color = this.colors.text) {
        this.ctx.font = this.fonts.label;
        const metrics = this.ctx.measureText(text);
        const padding = 6;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - padding, y - 18 - padding, metrics.width + padding * 2, 24 + padding * 2);

        // Text
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Toggle skeleton visibility
     * @param {boolean} show - Show skeleton
     */
    toggleSkeleton(show) {
        this.showSkeleton = show;
    }

    /**
     * Toggle landmarks visibility
     * @param {boolean} show - Show landmarks
     */
    toggleLandmarks(show) {
        this.showLandmarks = show;
    }

    /**
     * Toggle angle labels
     * @param {boolean} show - Show angle labels
     */
    toggleAngleLabels(show) {
        this.showAngleLabels = show;
    }

    /**
     * Set mirror mode
     * @param {boolean} mirror - Enable mirror mode
     */
    setMirrorMode(mirror) {
        this.mirrorMode = mirror;
    }

    /**
     * Update colors
     * @param {Object} colors - New color scheme
     */
    updateColors(colors) {
        this.colors = { ...this.colors, ...colors };
    }
}

/**
 * Create canvas renderer instance
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {CanvasRenderer} Renderer instance
 */
export function createRenderer(canvas) {
    return new CanvasRenderer(canvas);
}

// Export default
export default CanvasRenderer;
