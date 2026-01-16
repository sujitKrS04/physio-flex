/* ========================================
   ANGLE CALCULATION ENGINE
   Trigonometry Functions for Joint Angle Measurement
   ======================================== */

/**
 * Calculate the angle between three points in 2D/3D space
 * Uses the law of cosines and atan2 for accurate angle calculation
 * 
 * @param {Object} pointA - First point {x, y, z}
 * @param {Object} pointB - Vertex point (angle center) {x, y, z}
 * @param {Object} pointC - Third point {x, y, z}
 * @returns {number} Angle in degrees (0-180)
 */
export function calculateAngle(pointA, pointB, pointC) {
    // Calculate vectors from B to A and B to C
    const vectorBA = {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
        z: (pointA.z || 0) - (pointB.z || 0)
    };

    const vectorBC = {
        x: pointC.x - pointB.x,
        y: pointC.y - pointB.y,
        z: (pointC.z || 0) - (pointB.z || 0)
    };

    // Calculate dot product
    const dotProduct = 
        vectorBA.x * vectorBC.x + 
        vectorBA.y * vectorBC.y + 
        vectorBA.z * vectorBC.z;

    // Calculate magnitudes
    const magnitudeBA = Math.sqrt(
        vectorBA.x ** 2 + 
        vectorBA.y ** 2 + 
        vectorBA.z ** 2
    );

    const magnitudeBC = Math.sqrt(
        vectorBC.x ** 2 + 
        vectorBC.y ** 2 + 
        vectorBC.z ** 2
    );

    // Avoid division by zero
    if (magnitudeBA === 0 || magnitudeBC === 0) {
        return 0;
    }

    // Calculate angle using arccos
    const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
    
    // Clamp cosAngle to [-1, 1] to avoid NaN from floating-point errors
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
    
    // Convert to degrees
    const angleRadians = Math.acos(clampedCosAngle);
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
}

/**
 * Calculate 2D angle using atan2 (more stable for 2D calculations)
 * 
 * @param {Object} pointA - First point {x, y}
 * @param {Object} pointB - Vertex point {x, y}
 * @param {Object} pointC - Third point {x, y}
 * @returns {number} Angle in degrees (0-180)
 */
export function calculate2DAngle(pointA, pointB, pointC) {
    // Calculate angles from vertex to each point
    const angleBA = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    const angleBC = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x);
    
    // Calculate difference
    let angle = Math.abs(angleBA - angleBC);
    
    // Convert to degrees
    angle = angle * (180 / Math.PI);
    
    // Ensure angle is in 0-180 range
    if (angle > 180) {
        angle = 360 - angle;
    }
    
    return angle;
}

/**
 * Low-pass filter to smooth angle jitter
 * Uses exponential moving average
 * 
 * @param {number} currentAngle - Current measured angle
 * @param {number} previousAngle - Previous filtered angle
 * @param {number} alpha - Smoothing factor (0-1, higher = less smoothing)
 * @returns {number} Smoothed angle
 */
export function smoothAngle(currentAngle, previousAngle, alpha = 0.3) {
    if (previousAngle === null || previousAngle === undefined) {
        return currentAngle;
    }
    
    // Exponential moving average
    return alpha * currentAngle + (1 - alpha) * previousAngle;
}

/**
 * Moving average filter for angle smoothing
 * 
 * @param {Array<number>} angleHistory - Array of recent angles
 * @param {number} windowSize - Number of values to average
 * @returns {number} Averaged angle
 */
export function movingAverageAngle(angleHistory, windowSize = 5) {
    if (!angleHistory || angleHistory.length === 0) {
        return 0;
    }
    
    // Get last N values
    const recentAngles = angleHistory.slice(-windowSize);
    
    // Calculate average
    const sum = recentAngles.reduce((acc, val) => acc + val, 0);
    return sum / recentAngles.length;
}

/**
 * Check if angle is within threshold range
 * 
 * @param {number} angle - Current angle
 * @param {number} target - Target angle
 * @param {number} tolerance - Acceptable deviation
 * @returns {boolean} True if within range
 */
export function isAngleInRange(angle, target, tolerance = 10) {
    return Math.abs(angle - target) <= tolerance;
}

/**
 * Calculate form quality percentage based on angle accuracy
 * 
 * @param {number} angle - Current angle
 * @param {number} targetAngle - Ideal target angle
 * @param {number} maxDeviation - Maximum acceptable deviation
 * @returns {number} Quality percentage (0-100)
 */
export function calculateFormQuality(angle, targetAngle, maxDeviation = 20) {
    const deviation = Math.abs(angle - targetAngle);
    
    if (deviation >= maxDeviation) {
        return 0;
    }
    
    // Linear scale: 0 deviation = 100%, maxDeviation = 0%
    const quality = 100 * (1 - deviation / maxDeviation);
    
    return Math.max(0, Math.min(100, quality));
}

/**
 * Determine form quality category based on percentage
 * 
 * @param {number} qualityPercentage - Quality score (0-100)
 * @returns {Object} {category: string, color: string}
 */
export function getFormCategory(qualityPercentage) {
    if (qualityPercentage >= 80) {
        return { category: 'Good', color: '#00ff88', cssClass: 'badge-good' };
    } else if (qualityPercentage >= 60) {
        return { category: 'Fair', color: '#ffa500', cssClass: 'badge-fair' };
    } else {
        return { category: 'Poor', color: '#ff6b6b', cssClass: 'badge-poor' };
    }
}

/**
 * Calculate distance between two points
 * 
 * @param {Object} pointA - First point {x, y, z}
 * @param {Object} pointB - Second point {x, y, z}
 * @returns {number} Euclidean distance
 */
export function calculateDistance(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    const dz = (pointA.z || 0) - (pointB.z || 0);
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Normalize angle to 0-180 range
 * 
 * @param {number} angle - Input angle
 * @returns {number} Normalized angle
 */
export function normalizeAngle(angle) {
    // Ensure angle is positive
    while (angle < 0) {
        angle += 360;
    }
    
    // Normalize to 0-180
    if (angle > 180) {
        angle = 360 - angle;
    }
    
    return angle;
}

/**
 * Check if landmark is visible and has good confidence
 * 
 * @param {Object} landmark - Pose landmark {x, y, z, visibility}
 * @param {number} minVisibility - Minimum visibility threshold (0-1)
 * @returns {boolean} True if landmark is usable
 */
export function isLandmarkVisible(landmark, minVisibility = 0.5) {
    if (!landmark) return false;
    
    // Check if visibility property exists and meets threshold
    if (landmark.visibility !== undefined) {
        return landmark.visibility >= minVisibility;
    }
    
    // If no visibility data, assume visible if coordinates exist
    return landmark.x !== undefined && landmark.y !== undefined;
}

/**
 * Calculate the midpoint between two landmarks
 * 
 * @param {Object} pointA - First point {x, y, z}
 * @param {Object} pointB - Second point {x, y, z}
 * @returns {Object} Midpoint {x, y, z}
 */
export function calculateMidpoint(pointA, pointB) {
    return {
        x: (pointA.x + pointB.x) / 2,
        y: (pointA.y + pointB.y) / 2,
        z: ((pointA.z || 0) + (pointB.z || 0)) / 2
    };
}

/**
 * Check if body alignment is straight (for plank, etc.)
 * 
 * @param {Object} point1 - First point
 * @param {Object} point2 - Second point
 * @param {Object} point3 - Third point
 * @param {number} targetAngle - Target alignment angle (usually 180)
 * @param {number} tolerance - Acceptable deviation
 * @returns {boolean} True if aligned properly
 */
export function checkAlignment(point1, point2, point3, targetAngle = 180, tolerance = 15) {
    const angle = calculateAngle(point1, point2, point3);
    return isAngleInRange(angle, targetAngle, tolerance);
}

/**
 * Class for maintaining angle history and statistics
 */
export class AngleTracker {
    constructor(historySize = 10) {
        this.historySize = historySize;
        this.angleHistory = [];
        this.smoothedAngle = null;
    }

    /**
     * Add new angle measurement
     * @param {number} angle - New angle value
     * @returns {number} Smoothed angle
     */
    addAngle(angle) {
        this.angleHistory.push(angle);
        
        // Maintain history size
        if (this.angleHistory.length > this.historySize) {
            this.angleHistory.shift();
        }
        
        // Calculate smoothed angle
        this.smoothedAngle = this.getSmoothedAngle();
        
        return this.smoothedAngle;
    }

    /**
     * Get smoothed angle using moving average
     * @returns {number} Smoothed angle
     */
    getSmoothedAngle() {
        return movingAverageAngle(this.angleHistory);
    }

    /**
     * Get current angle (most recent)
     * @returns {number} Current angle
     */
    getCurrentAngle() {
        return this.angleHistory[this.angleHistory.length - 1] || 0;
    }

    /**
     * Reset tracker
     */
    reset() {
        this.angleHistory = [];
        this.smoothedAngle = null;
    }

    /**
     * Get angle statistics
     * @returns {Object} {min, max, avg, current, smoothed}
     */
    getStats() {
        if (this.angleHistory.length === 0) {
            return { min: 0, max: 0, avg: 0, current: 0, smoothed: 0 };
        }

        const min = Math.min(...this.angleHistory);
        const max = Math.max(...this.angleHistory);
        const avg = this.angleHistory.reduce((sum, val) => sum + val, 0) / this.angleHistory.length;

        return {
            min: Math.round(min),
            max: Math.round(max),
            avg: Math.round(avg),
            current: Math.round(this.getCurrentAngle()),
            smoothed: Math.round(this.smoothedAngle || 0)
        };
    }
}

// Export all functions
export default {
    calculateAngle,
    calculate2DAngle,
    smoothAngle,
    movingAverageAngle,
    isAngleInRange,
    calculateFormQuality,
    getFormCategory,
    calculateDistance,
    normalizeAngle,
    isLandmarkVisible,
    calculateMidpoint,
    checkAlignment,
    AngleTracker
};
