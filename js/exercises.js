/* ========================================
   EXERCISE LIBRARY CONFIGURATION
   10 Different Exercise Types with Tracking Parameters
   ======================================== */

// MediaPipe Pose Landmark Constants
export const POSE_LANDMARKS = {
    NOSE: 0,
    LEFT_EYE_INNER: 1,
    LEFT_EYE: 2,
    LEFT_EYE_OUTER: 3,
    RIGHT_EYE_INNER: 4,
    RIGHT_EYE: 5,
    RIGHT_EYE_OUTER: 6,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    MOUTH_LEFT: 9,
    MOUTH_RIGHT: 10,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_PINKY: 17,
    RIGHT_PINKY: 18,
    LEFT_INDEX: 19,
    RIGHT_INDEX: 20,
    LEFT_THUMB: 21,
    RIGHT_THUMB: 22,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,
    LEFT_FOOT_INDEX: 31,
    RIGHT_FOOT_INDEX: 32
};

// Exercise Configuration Database
export const EXERCISES = {
    bicepCurls: {
        name: "Bicep Curls",
        category: "Upper Body",
        targetMuscle: "Biceps",
        difficulty: "Beginner",
        description: "Stand with feet shoulder-width apart. Keep your elbows close to your body and curl the weight up.",
        
        // Joint angles to track [pointA, pointB, pointC]
        joints: [
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_ELBOW,
            POSE_LANDMARKS.RIGHT_WRIST
        ],
        
        // Alternative joints (for left side)
        jointsAlt: [
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_ELBOW,
            POSE_LANDMARKS.LEFT_WRIST
        ],
        
        // Angle thresholds
        thresholds: {
            down: 160,      // Arm fully extended (start position)
            up: 40,         // Arm fully curled (end position)
            tolerance: 10   // Acceptable deviation
        },
        
        // Calories per rep (approximate)
        caloriesPerRep: 0.5,
        
        // Tips for proper form
        tips: "Keep your elbows stationary and close to your body. Control the movement both up and down.",
        
        // Form validation rules
        formRules: {
            shoulderStability: true,    // Shoulder should not move excessively
            controlledMotion: true       // Movement should be smooth
        },
        
        // Rep counting type
        repType: "range" // Counts when transitioning through full range
    },

    shoulderPress: {
        name: "Shoulder Press",
        category: "Upper Body",
        targetMuscle: "Deltoids",
        difficulty: "Intermediate",
        description: "Press weights overhead while keeping your core tight and back straight.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_ELBOW
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_ELBOW
        ],
        
        thresholds: {
            down: 90,       // Arms at shoulder level
            up: 160,        // Arms fully extended overhead
            tolerance: 10
        },
        
        caloriesPerRep: 0.7,
        tips: "Keep your core engaged. Don't arch your back. Press straight up, not forward.",
        
        formRules: {
            coreEngagement: true,
            backAlignment: true
        },
        
        repType: "range"
    },

    lateralRaises: {
        name: "Lateral Raises",
        category: "Upper Body",
        targetMuscle: "Lateral Deltoids",
        difficulty: "Beginner",
        description: "Raise your arms to the sides until they're parallel with the ground.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_WRIST
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_WRIST
        ],
        
        thresholds: {
            down: 20,       // Arms at sides
            up: 80,         // Arms parallel to ground
            tolerance: 10
        },
        
        caloriesPerRep: 0.4,
        tips: "Keep a slight bend in your elbows. Raise to shoulder height, not higher. Control the descent.",
        
        formRules: {
            controlledMovement: true,
            properHeight: true
        },
        
        repType: "range"
    },

    tricepExtensions: {
        name: "Tricep Extensions",
        category: "Upper Body",
        targetMuscle: "Triceps",
        difficulty: "Beginner",
        description: "Extend your arms overhead, keeping your upper arms stationary.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_ELBOW,
            POSE_LANDMARKS.RIGHT_WRIST
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_ELBOW,
            POSE_LANDMARKS.LEFT_WRIST
        ],
        
        thresholds: {
            down: 50,       // Elbow bent (flexed position)
            up: 160,        // Arm fully extended
            tolerance: 10
        },
        
        caloriesPerRep: 0.4,
        tips: "Keep your upper arms still and close to your head. Only move your forearms.",
        
        formRules: {
            upperArmStability: true,
            fullExtension: true
        },
        
        repType: "range"
    },

    frontRaises: {
        name: "Front Raises",
        category: "Upper Body",
        targetMuscle: "Front Deltoids",
        difficulty: "Beginner",
        description: "Raise your arms straight in front of you to shoulder height.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_WRIST
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_WRIST
        ],
        
        thresholds: {
            down: 30,       // Arms in front of hips
            up: 90,         // Arms parallel to ground
            tolerance: 10
        },
        
        caloriesPerRep: 0.4,
        tips: "Keep your back straight. Raise to shoulder height. Use controlled movements.",
        
        formRules: {
            backAlignment: true,
            controlledMotion: true
        },
        
        repType: "range"
    },

    squats: {
        name: "Squats",
        category: "Lower Body",
        targetMuscle: "Quads, Glutes",
        difficulty: "Beginner",
        description: "Lower your hips until thighs are parallel to the ground, then stand back up.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_KNEE,
            POSE_LANDMARKS.RIGHT_ANKLE
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_KNEE,
            POSE_LANDMARKS.LEFT_ANKLE
        ],
        
        thresholds: {
            down: 100,      // Squat depth (parallel or below)
            up: 160,        // Standing position
            tolerance: 10
        },
        
        caloriesPerRep: 0.8,
        tips: "Keep your chest up, knees over toes. Push through your heels to stand up.",
        
        formRules: {
            kneeAlignment: true,
            chestUp: true,
            depth: true
        },
        
        repType: "range"
    },

    lunges: {
        name: "Lunges",
        category: "Lower Body",
        targetMuscle: "Quads, Glutes",
        difficulty: "Intermediate",
        description: "Step forward and lower your body until both knees are bent at 90 degrees.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_KNEE,
            POSE_LANDMARKS.RIGHT_ANKLE
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_KNEE,
            POSE_LANDMARKS.LEFT_ANKLE
        ],
        
        thresholds: {
            down: 100,      // Lunge depth
            up: 160,        // Standing position
            tolerance: 10
        },
        
        caloriesPerRep: 0.7,
        tips: "Keep your torso upright. Front knee should not go past your toes. Back knee nearly touches ground.",
        
        formRules: {
            torsoUpright: true,
            kneeAlignment: true,
            balance: true
        },
        
        repType: "range"
    },

    calfRaises: {
        name: "Calf Raises",
        category: "Lower Body",
        targetMuscle: "Calves",
        difficulty: "Beginner",
        description: "Rise up on your toes, lifting your heels as high as possible.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_KNEE,
            POSE_LANDMARKS.RIGHT_ANKLE,
            POSE_LANDMARKS.RIGHT_FOOT_INDEX
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_KNEE,
            POSE_LANDMARKS.LEFT_ANKLE,
            POSE_LANDMARKS.LEFT_FOOT_INDEX
        ],
        
        thresholds: {
            down: 110,      // Heels down
            up: 140,        // On toes
            tolerance: 8
        },
        
        caloriesPerRep: 0.3,
        tips: "Rise up as high as you can on your toes. Squeeze your calves at the top. Lower with control.",
        
        formRules: {
            fullRangeOfMotion: true,
            controlledDescent: true
        },
        
        repType: "range"
    },

    sitUps: {
        name: "Sit-ups",
        category: "Core",
        targetMuscle: "Abs",
        difficulty: "Beginner",
        description: "Lie on your back, then lift your torso up towards your knees.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_KNEE
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_KNEE
        ],
        
        thresholds: {
            down: 30,       // Lying flat
            up: 70,         // Sitting up
            tolerance: 10
        },
        
        caloriesPerRep: 0.5,
        tips: "Keep your feet flat on the ground. Use your abs to lift, not momentum. Don't pull on your neck.",
        
        formRules: {
            neckAlignment: true,
            controlledMotion: true
        },
        
        repType: "range"
    },

    plankHold: {
        name: "Plank Hold",
        category: "Core",
        targetMuscle: "Abs, Core",
        difficulty: "Intermediate",
        description: "Hold your body in a straight line, supported on forearms and toes.",
        
        joints: [
            POSE_LANDMARKS.RIGHT_SHOULDER,
            POSE_LANDMARKS.RIGHT_HIP,
            POSE_LANDMARKS.RIGHT_ANKLE
        ],
        
        jointsAlt: [
            POSE_LANDMARKS.LEFT_SHOULDER,
            POSE_LANDMARKS.LEFT_HIP,
            POSE_LANDMARKS.LEFT_ANKLE
        ],
        
        thresholds: {
            down: 160,      // Straight body alignment (minimum)
            up: 180,        // Perfect straight line
            tolerance: 15   // More tolerance for alignment
        },
        
        caloriesPerRep: 1.2, // Per 10 seconds
        tips: "Keep your body in a straight line. Don't let your hips sag or pike up. Engage your core.",
        
        formRules: {
            bodyAlignment: true,
            hipPosition: true,
            coreEngagement: true
        },
        
        repType: "hold" // Duration tracking instead of reps
    }
};

// Get exercise by ID
export function getExercise(exerciseId) {
    return EXERCISES[exerciseId] || null;
}

// Get all exercise IDs
export function getAllExerciseIds() {
    return Object.keys(EXERCISES);
}

// Get exercises by category
export function getExercisesByCategory(category) {
    return Object.entries(EXERCISES)
        .filter(([_, exercise]) => exercise.category === category)
        .map(([id, exercise]) => ({ id, ...exercise }));
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty) {
    return Object.entries(EXERCISES)
        .filter(([_, exercise]) => exercise.difficulty === difficulty)
        .map(([id, exercise]) => ({ id, ...exercise }));
}

// Export for use in other modules
export default EXERCISES;
