/* ========================================
   REP COUNTER - STATE MACHINE
   Intelligent Repetition Counting with Form Validation
   ======================================== */

import { isAngleInRange, calculateFormQuality } from './angle-calculator.js';

/**
 * Rep Counter States
 */
export const RepState = {
    IDLE: 'IDLE',
    START_POSITION: 'START_POSITION',
    IN_MOTION: 'IN_MOTION',
    END_POSITION: 'END_POSITION',
    REP_COMPLETE: 'REP_COMPLETE'
};

/**
 * Rep Counter Class
 * Implements state machine for counting exercise repetitions
 */
export class RepCounter {
    constructor(exercise) {
        this.exercise = exercise;
        this.state = RepState.IDLE;
        this.repCount = 0;
        this.currentAngle = 0;
        this.previousAngle = 0;
        
        // Form quality tracking
        this.formQuality = 100;
        this.formHistory = [];
        this.averageFormQuality = 100;
        
        // State tracking
        this.inStartPosition = false;
        this.inEndPosition = false;
        this.framesSinceStateChange = 0;
        this.minFramesInPosition = 5; // Hysteresis to prevent false triggers
        
        // Plank-specific (time-based)
        this.isHoldExercise = exercise.repType === 'hold';
        this.holdStartTime = null;
        this.totalHoldTime = 0; // In seconds
        this.currentHoldDuration = 0;
        
        // Callbacks
        this.onRepComplete = null;
        this.onStateChange = null;
        this.onFormFeedback = null;
    }

    /**
     * Update rep counter with new angle measurement
     * @param {number} angle - Current joint angle
     * @returns {Object} Status update
     */
    update(angle) {
        if (!angle || isNaN(angle)) {
            return this.getStatus();
        }

        this.previousAngle = this.currentAngle;
        this.currentAngle = angle;
        this.framesSinceStateChange++;

        // Calculate form quality
        this.updateFormQuality(angle);

        // Handle hold exercises differently
        if (this.isHoldExercise) {
            return this.updateHoldExercise(angle);
        }

        // Handle range-based exercises
        return this.updateRangeExercise(angle);
    }

    /**
     * Update hold exercise (plank)
     * @param {number} angle - Current body alignment angle
     * @returns {Object} Status update
     */
    updateHoldExercise(angle) {
        const { down, up, tolerance } = this.exercise.thresholds;
        const targetAngle = (down + up) / 2; // Target alignment
        
        // Check if in proper hold position
        const isInPosition = isAngleInRange(angle, targetAngle, tolerance);

        if (isInPosition) {
            if (!this.holdStartTime) {
                // Start timing
                this.holdStartTime = Date.now();
                this.changeState(RepState.START_POSITION);
                this.triggerFeedback('Hold this position!', 'good');
            } else {
                // Update hold duration
                this.currentHoldDuration = (Date.now() - this.holdStartTime) / 1000;
                this.totalHoldTime = this.currentHoldDuration;
                
                // Update "rep" count every 10 seconds
                const currentReps = Math.floor(this.totalHoldTime / 10);
                if (currentReps > this.repCount) {
                    this.repCount = currentReps;
                    this.triggerRepComplete();
                }

                if (this.state !== RepState.IN_MOTION) {
                    this.changeState(RepState.IN_MOTION);
                }
            }
        } else {
            if (this.holdStartTime) {
                // Lost position
                this.changeState(RepState.END_POSITION);
                this.triggerFeedback('Position lost! Realign your body.', 'poor');
                this.holdStartTime = null;
            }
        }

        return this.getStatus();
    }

    /**
     * Update range-based exercise
     * @param {number} angle - Current joint angle
     * @returns {Object} Status update
     */
    updateRangeExercise(angle) {
        const { down, up, tolerance } = this.exercise.thresholds;

        // Check positions with hysteresis
        const isNearStart = isAngleInRange(angle, down, tolerance);
        const isNearEnd = isAngleInRange(angle, up, tolerance);

        // State machine logic
        switch (this.state) {
            case RepState.IDLE:
                // Waiting for start position
                if (isNearStart) {
                    this.changeState(RepState.START_POSITION);
                    this.inStartPosition = true;
                }
                break;

            case RepState.START_POSITION:
                // In start position, waiting to move
                if (!isNearStart && this.framesSinceStateChange > this.minFramesInPosition) {
                    this.changeState(RepState.IN_MOTION);
                    this.inStartPosition = false;
                    this.triggerFeedback('Good! Keep going.', 'good');
                }
                break;

            case RepState.IN_MOTION:
                // Moving toward end position
                if (isNearEnd && this.framesSinceStateChange > this.minFramesInPosition) {
                    this.changeState(RepState.END_POSITION);
                    this.inEndPosition = true;
                }
                break;

            case RepState.END_POSITION:
                // In end position, waiting to return
                if (!isNearEnd && this.framesSinceStateChange > this.minFramesInPosition) {
                    // Check if returning to start
                    if (this.isMovingTowardStart(angle, down)) {
                        this.changeState(RepState.IN_MOTION);
                        this.inEndPosition = false;
                    }
                } else if (isNearStart && this.framesSinceStateChange > this.minFramesInPosition) {
                    // Completed full rep
                    this.completeRep();
                }
                break;

            case RepState.REP_COMPLETE:
                // Rep just completed, wait for next start
                if (isNearStart) {
                    this.changeState(RepState.START_POSITION);
                    this.inStartPosition = true;
                }
                break;
        }

        return this.getStatus();
    }

    /**
     * Check if angle is moving toward start position
     * @param {number} currentAngle - Current angle
     * @param {number} targetAngle - Target (start) angle
     * @returns {boolean} True if moving toward start
     */
    isMovingTowardStart(currentAngle, targetAngle) {
        const currentDiff = Math.abs(currentAngle - targetAngle);
        const previousDiff = Math.abs(this.previousAngle - targetAngle);
        return currentDiff < previousDiff;
    }

    /**
     * Complete a repetition
     */
    completeRep() {
        // Only count rep if form quality is acceptable (>50%)
        if (this.formQuality >= 50) {
            this.repCount++;
            this.changeState(RepState.REP_COMPLETE);
            this.triggerRepComplete();
            this.triggerFeedback('Rep complete! 💪', 'success');
        } else {
            this.changeState(RepState.START_POSITION);
            this.triggerFeedback('Poor form. Rep not counted.', 'poor');
        }

        // Reset position flags
        this.inStartPosition = false;
        this.inEndPosition = false;
    }

    /**
     * Update form quality based on angle
     * @param {number} angle - Current angle
     */
    updateFormQuality(angle) {
        const { down, up } = this.exercise.thresholds;
        
        // Determine target angle based on current state
        let targetAngle;
        if (this.inStartPosition || isAngleInRange(angle, down, 15)) {
            targetAngle = down;
        } else if (this.inEndPosition || isAngleInRange(angle, up, 15)) {
            targetAngle = up;
        } else {
            // In motion - no specific target
            this.formQuality = 80; // Default decent form
            return;
        }

        // Calculate quality
        const quality = calculateFormQuality(angle, targetAngle, 20);
        this.formQuality = Math.round(quality);
        
        // Track history
        this.formHistory.push(quality);
        if (this.formHistory.length > 30) {
            this.formHistory.shift();
        }

        // Calculate average
        if (this.formHistory.length > 0) {
            const sum = this.formHistory.reduce((a, b) => a + b, 0);
            this.averageFormQuality = Math.round(sum / this.formHistory.length);
        }

        // Trigger feedback for poor form
        if (this.formQuality < 50 && this.framesSinceStateChange > 10) {
            this.triggerFeedback('Adjust your form!', 'poor');
        } else if (this.formQuality >= 80 && this.framesSinceStateChange > 10) {
            // Occasional positive feedback
            if (Math.random() < 0.1) { // 10% chance
                this.triggerFeedback('Perfect form!', 'good');
            }
        }
    }

    /**
     * Change state
     * @param {string} newState - New state
     */
    changeState(newState) {
        if (this.state !== newState) {
            const oldState = this.state;
            this.state = newState;
            this.framesSinceStateChange = 0;

            console.log(`State changed: ${oldState} → ${newState}`);

            // Trigger callback
            if (this.onStateChange) {
                this.onStateChange(newState, oldState);
            }
        }
    }

    /**
     * Trigger rep complete callback
     */
    triggerRepComplete() {
        if (this.onRepComplete) {
            this.onRepComplete({
                repCount: this.repCount,
                formQuality: this.formQuality,
                averageFormQuality: this.averageFormQuality,
                holdTime: this.isHoldExercise ? this.totalHoldTime : null
            });
        }
    }

    /**
     * Trigger form feedback callback
     * @param {string} message - Feedback message
     * @param {string} type - Feedback type (good, fair, poor, success)
     */
    triggerFeedback(message, type) {
        if (this.onFormFeedback) {
            this.onFormFeedback(message, type);
        }
    }

    /**
     * Get current status
     * @returns {Object} Current counter status
     */
    getStatus() {
        return {
            repCount: this.repCount,
            state: this.state,
            currentAngle: Math.round(this.currentAngle),
            formQuality: this.formQuality,
            averageFormQuality: this.averageFormQuality,
            isHoldExercise: this.isHoldExercise,
            holdTime: this.totalHoldTime,
            currentHoldDuration: this.currentHoldDuration
        };
    }

    /**
     * Reset counter
     */
    reset() {
        this.state = RepState.IDLE;
        this.repCount = 0;
        this.currentAngle = 0;
        this.previousAngle = 0;
        this.formQuality = 100;
        this.formHistory = [];
        this.averageFormQuality = 100;
        this.inStartPosition = false;
        this.inEndPosition = false;
        this.framesSinceStateChange = 0;
        this.holdStartTime = null;
        this.totalHoldTime = 0;
        this.currentHoldDuration = 0;

        console.log('Rep counter reset');
    }

    /**
     * Set callbacks
     * @param {Object} callbacks - Callback functions
     */
    setCallbacks(callbacks) {
        if (callbacks.onRepComplete) {
            this.onRepComplete = callbacks.onRepComplete;
        }
        if (callbacks.onStateChange) {
            this.onStateChange = callbacks.onStateChange;
        }
        if (callbacks.onFormFeedback) {
            this.onFormFeedback = callbacks.onFormFeedback;
        }
    }

    /**
     * Get statistics
     * @returns {Object} Counter statistics
     */
    getStats() {
        return {
            totalReps: this.repCount,
            averageFormQuality: this.averageFormQuality,
            currentState: this.state,
            holdTime: this.isHoldExercise ? this.totalHoldTime : 0
        };
    }
}

/**
 * Create rep counter for specific exercise
 * @param {Object} exercise - Exercise configuration
 * @returns {RepCounter} New rep counter instance
 */
export function createRepCounter(exercise) {
    return new RepCounter(exercise);
}

// Export default
export default RepCounter;
