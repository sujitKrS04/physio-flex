# 💪 Physio-Flex - AI-Powered Fitness Trainer

A professional, browser-based fitness application that uses webcam AI pose detection to provide real-time exercise form correction and automatic rep counting across 10 different workout types.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)

## ✨ Features

### 🎯 Core Functionality

- **Real-time Pose Detection**: 33-point skeleton tracking using MediaPipe Pose
- **Automatic Rep Counting**: Intelligent state machine counts reps with form validation
- **10 Exercise Types**: Comprehensive workout library covering upper body, lower body, and core
- **Form Quality Feedback**: Real-time form analysis with visual and text feedback
- **Dual Theme System**: Premium dark mode and clean light mode with seamless toggle
- **100% Privacy First**: All processing happens locally in your browser - no data sent anywhere

### 🏋️ Exercise Library

#### Upper Body (5 Exercises)

1. **Bicep Curls** - Biceps targeting
2. **Shoulder Press** - Deltoid development
3. **Lateral Raises** - Lateral deltoid isolation
4. **Tricep Extensions** - Triceps strengthening
5. **Front Raises** - Front deltoid focus

#### Lower Body (3 Exercises)

6. **Squats** - Quad and glute compound
7. **Lunges** - Leg and balance training
8. **Calf Raises** - Calf muscle isolation

#### Core (2 Exercises)

9. **Sit-ups** - Abdominal strengthening
10. **Plank Hold** - Core stability and endurance

### 🎨 Design Features

- **Glassmorphism UI**: Modern glass-effect cards with backdrop blur
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile (320px+)
- **Smooth Animations**: Fluid CSS transitions and keyframe animations
- **Color-Coded Feedback**: Green (good), orange (fair), red (poor form)
- **Real-time Stats Dashboard**: Live tracking of reps, angles, form quality, time, and calories

### 🔧 Technical Features

- **MediaPipe Integration**: Industry-leading pose detection accuracy
- **Low-pass Filtering**: Smooth angle measurements without jitter
- **Hysteresis Logic**: Prevents false rep triggers
- **State Machine**: Robust rep counting with position validation
- **Canvas Rendering**: Smooth 30 FPS skeleton overlay
- **LocalStorage**: Persistent theme and settings preferences

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam access
- Local web server (for file:// protocol security)

### Installation

1. **Clone or download** this repository:

```bash
git clone https://github.com/yourusername/physio-flex.git
cd physio-flex
```

2. **Start a local web server**:

**Option A - Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B - Node.js:**

```bash
npx http-server -p 8000
```

**Option C - VS Code:**

- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

3. **Open in browser**:

```
http://localhost:8000
```

### First Time Setup

1. **Grant Camera Permission**: Click "Allow" when prompted for camera access
2. **Select Exercise**: Choose from 10 different exercises in the dropdown
3. **Start Camera**: Click the green "Start Camera" button
4. **Position Yourself**: Stand where your full body is visible in frame
5. **Start Exercising**: Begin your workout - reps will count automatically!

## 📖 How to Use

### Exercise Selection

1. Open the exercise dropdown in the left sidebar
2. Choose your desired exercise (e.g., "Bicep Curls")
3. Read the exercise description and tips

### Starting a Workout

1. Ensure good lighting and full body visibility
2. Click "Start Camera" to activate webcam
3. Wait for AI model to load (3-5 seconds)
4. Position yourself in the starting position
5. Perform the exercise with proper form

### Understanding Feedback

**Form Quality Badge:**

- 🟢 **Good (80-100%)**: Perfect form, keep it up!
- 🟡 **Fair (60-79%)**: Acceptable, minor adjustments needed
- 🔴 **Poor (<60%)**: Form needs correction, rep may not count

**Angle Display:**

- Shows current joint angle in real-time
- Green = correct position
- Orange/Red = adjust form

**Rep Counter:**

- Large number shows completed reps
- Animates on rep completion
- Only counts reps with acceptable form (>50%)

### Stopping a Workout

1. Click "Stop Camera" to end session
2. View workout summary with stats
3. Click "Reset Counter" to clear stats for next set

## 🎯 Exercise Form Guidelines

### Bicep Curls

- Keep elbows close to body
- Controlled motion up and down
- Full extension at bottom, full curl at top

### Shoulder Press

- Core engaged throughout
- Press straight up, not forward
- Don't arch your back

### Squats

- Chest up, knees over toes
- Descend until thighs parallel
- Push through heels to stand

### Plank Hold

- Maintain straight body line
- Don't let hips sag or pike
- Hold as long as possible with good form

## ⚙️ Settings

Click the settings icon (⚙️) in the header to customize:

### Form Strictness

- **Relaxed (±10°)**: More forgiving angle tolerance
- **Normal (±5°)**: Default, balanced strictness
- **Strict (±3°)**: Precise form required

### Display Options

- **Voice Feedback**: Enable audio feedback (experimental)
- **Show Skeleton**: Toggle skeleton overlay visibility

### Theme

- Click moon/sun icon to switch between dark and light themes
- Preference saved automatically

## 🏗️ Project Structure

```
physio-flex/
│
├── index.html                 # Main HTML structure
│
├── css/
│   ├── variables.css          # CSS custom properties & themes
│   ├── base.css               # Reset, typography, globals
│   ├── layout.css             # Grid system, responsive layout
│   ├── components.css         # Buttons, cards, forms, badges
│   └── animations.css         # Keyframes & transitions
│
├── js/
│   ├── main.js                # App initialization & orchestration
│   ├── camera.js              # Webcam management
│   ├── pose-detection.js      # MediaPipe integration
│   ├── angle-calculator.js    # Trigonometry & calculations
│   ├── rep-counter.js         # State machine logic
│   ├── exercises.js           # Exercise configurations
│   ├── ui-controller.js       # DOM manipulation
│   └── canvas-renderer.js     # Skeleton visualization
│
└── README.md                  # This file
```

## 🔐 Privacy & Security

### Data Privacy

- ✅ **100% Client-Side**: All processing in browser
- ✅ **No Server Communication**: Zero data uploads
- ✅ **No Tracking**: No analytics or cookies
- ✅ **Local Storage Only**: Settings saved on your device
- ✅ **Camera Stream**: Never recorded or stored

### Browser Permissions

- **Camera**: Required for pose detection
- **LocalStorage**: Optional, for saving preferences

## 🌐 Browser Compatibility

| Browser | Version | Status             |
| ------- | ------- | ------------------ |
| Chrome  | 90+     | ✅ Fully Supported |
| Firefox | 88+     | ✅ Fully Supported |
| Edge    | 90+     | ✅ Fully Supported |
| Safari  | 14+     | ✅ Supported       |
| Opera   | 76+     | ✅ Supported       |

### Mobile Support

- ✅ iOS Safari 14+
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ⚠️ Requires good device performance for smooth operation

## ⚡ Performance

### Optimization

- Target: 30 FPS pose detection
- Latency: <100ms movement to feedback
- Memory: <150MB typical usage
- Battery: Optimized for mobile devices

### Tips for Best Performance

- Use Chrome for best MediaPipe performance
- Ensure good lighting conditions
- Position camera at chest height
- Keep full body in frame
- Close other intensive browser tabs

## 🛠️ Troubleshooting

### Camera Not Working

- Check browser permissions (lock icon in address bar)
- Ensure no other app is using the camera
- Try refreshing the page
- Use a different browser

### Pose Not Detected

- Improve lighting in room
- Step back to show full body
- Wear contrasting clothing
- Remove obstructions from frame

### Low FPS / Lag

- Close other browser tabs
- Use a more powerful device
- Lower browser zoom level
- Try different browser

### Reps Not Counting

- Check form quality indicator
- Ensure full range of motion
- Move slower and more controlled
- Verify all tracked joints are visible

## 🎓 Technical Details

### Technologies Used

- **MediaPipe Pose**: Google's ML pose detection
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with custom properties
- **Canvas API**: Real-time rendering
- **Web APIs**: getUserMedia, LocalStorage, Web Speech (optional)

### Architecture

- **Modular Design**: Separate concerns across files
- **Event-Driven**: Callback-based component communication
- **State Machine**: Robust rep counting logic
- **Reactive UI**: Automatic DOM updates

### Angle Calculation

Uses law of cosines for 3D angle measurement:

```javascript
angle = arccos((BA · BC) / (|BA| × |BC|))
```

With low-pass filtering for smoothing:

```javascript
smoothed = α × current + (1 - α) × previous
```

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional exercise types
- Enhanced form validation rules
- Voice coaching improvements
- Workout program builder
- Social sharing features
- Progressive Web App (PWA) features

## 📄 License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2026 Physio-Flex

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **MediaPipe Team**: For excellent pose detection library
- **Google**: For TensorFlow.js ecosystem
- **Open Source Community**: For inspiration and tools

## 📞 Support

For issues, questions, or feedback:

- Open an issue on GitHub
- Check troubleshooting section above
- Review browser console for errors

## 🎯 Roadmap

### Planned Features

- [ ] Workout history tracking
- [ ] Custom workout programs
- [ ] Exercise video demonstrations
- [ ] Multiple simultaneous exercises
- [ ] Partner/group workouts
- [ ] Exercise recommendations
- [ ] Export workout data
- [ ] Offline PWA support

---

**Made with 💪 and AI** | Built for Privacy | Open Source | 100% Client-Side

**Start your fitness journey today - no signup, no tracking, just results!**
