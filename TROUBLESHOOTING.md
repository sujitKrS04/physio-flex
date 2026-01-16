# 🔧 Troubleshooting Guide

Common issues and solutions for Physio-Flex.

## 🎥 Camera Issues

### Problem: Camera permission denied

**Solutions:**

1. Click the 🔒 icon in browser address bar
2. Change camera permission to "Allow"
3. Refresh the page
4. Click "Start Camera" again

### Problem: Camera not found

**Solutions:**

- Ensure webcam is connected
- Close other apps using camera (Zoom, Teams, etc.)
- Try different USB port (external webcam)
- Restart browser
- Check Device Manager (Windows) or System Preferences (Mac)

### Problem: Camera shows black screen

**Solutions:**

- Check if camera LED is on
- Ensure good lighting in room
- Try different browser
- Update camera drivers
- Disable browser hardware acceleration

---

## 🤖 Pose Detection Issues

### Problem: Skeleton not appearing

**Solutions:**

1. **Step back** - Show full body in frame
2. **Improve lighting** - Face window or add lights
3. **Wait 3-5 seconds** - AI model loading time
4. **Check console** - Press F12, look for errors
5. **Wear contrasting colors** - Different from background

### Problem: Skeleton tracking jerky/unstable

**Solutions:**

- Improve room lighting (most common fix)
- Reduce background clutter
- Stand still for 2 seconds to calibrate
- Close resource-heavy apps
- Use Chrome for best performance

### Problem: Joints not detected correctly

**Solutions:**

- Ensure all tracked joints visible
- Remove baggy clothing if possible
- Step back to show more body
- Adjust camera angle (chest height ideal)
- Face camera directly

---

## 🔢 Rep Counting Issues

### Problem: Reps not counting

**Possible Causes & Solutions:**

**1. Poor Form Quality**

- Check form badge (should be yellow/green)
- Aim for 60%+ form quality
- Complete full range of motion
- Move slower and more controlled

**2. Incomplete Range**

- Start position: Verify angle matches threshold
- End position: Verify angle matches threshold
- Hold each position briefly (1 second)

**3. Joints Not Visible**

- Keep tracked joints in frame
- Step back if needed
- Check which joints the exercise tracks (see tips)

**4. Moving Too Fast**

- Slow down movements
- Pause at start and end positions
- Focus on form over speed

### Problem: Reps counting incorrectly (too many/few)

**Solutions:**

- Reset counter and start fresh
- Ensure proper starting position
- Move through complete range
- Check settings - adjust strictness
- Review exercise description for proper form

---

## ⚡ Performance Issues

### Problem: Low FPS (< 20)

**Solutions:**

1. **Close other tabs** - Browser memory
2. **Close other apps** - System resources
3. **Lower browser zoom** - Reduce to 100%
4. **Use Chrome** - Best MediaPipe performance
5. **Restart browser** - Clear memory
6. **Update browser** - Latest version

### Problem: App freezing/crashing

**Solutions:**

- Check RAM usage (Task Manager/Activity Monitor)
- Close unnecessary apps
- Use Incognito/Private mode
- Clear browser cache
- Try different browser
- Restart computer

### Problem: Delayed response

**Solutions:**

- Check FPS counter (bottom left)
- Improve lighting for better detection
- Reduce video quality if possible
- Close background apps
- Disable browser extensions temporarily

---

## 🎨 Display Issues

### Problem: Layout broken on mobile

**Solutions:**

- Rotate device to portrait mode
- Clear browser cache
- Update browser
- Try different browser
- Check viewport zoom (should be 100%)

### Problem: Theme not changing

**Solutions:**

- Click theme toggle button (moon/sun icon)
- Clear localStorage: F12 → Application → Clear
- Refresh page
- Check browser console for errors

### Problem: Stats not updating

**Solutions:**

- Check if camera is active
- Ensure pose is detected (skeleton visible)
- Reset counter
- Refresh page
- Check browser console

---

## 🌐 Browser-Specific Issues

### Chrome Issues

**Problem:** High CPU usage

- Disable hardware acceleration
- Settings → Advanced → System
- Toggle off "Use hardware acceleration"

### Firefox Issues

**Problem:** MediaPipe slower

- This is expected - Chrome has better support
- Upgrade to latest Firefox version
- Lower ModelComplexity setting

### Safari Issues

**Problem:** Some features not working

- Update to Safari 14+
- Enable camera in Safari preferences
- Try Chrome as alternative

### Mobile Browser Issues

**Problem:** Poor performance

- Use native browser (Safari/Chrome)
- Reduce background apps
- Ensure good device performance
- Try landscape orientation

---

## 🔍 Debugging Steps

### Basic Debugging Process:

1. **Open Console** (F12 or Cmd+Option+I)
2. **Look for errors** (red text)
3. **Check camera status** (green = good)
4. **Verify pose detection** (should log landmarks)
5. **Test different exercise** (isolate issue)

### Check Console Messages:

```
✅ Good signs:
- "Camera started successfully"
- "MediaPipe Pose initialized"
- "Pose detection started"
- "Rep X completed"

❌ Bad signs:
- "Camera access denied"
- "Failed to initialize"
- Any red error messages
```

### Advanced Debugging:

Access app instance in console:

```javascript
// Check app state
window.physioFlexApp;

// Check camera status
window.physioFlexApp.camera.getStatus();

// Check if pose detected
window.physioFlexApp.pose.isPoseDetected();

// Get rep counter status
window.physioFlexApp.repCounter?.getStatus();
```

---

## 📱 Device-Specific Tips

### Windows

- Use Chrome or Edge for best results
- Update graphics drivers
- Check Windows Camera privacy settings

### macOS

- Allow camera in System Preferences → Security
- Use Safari 14+ or Chrome
- Check lighting (Macs tend to have darker cameras)

### iOS

- Use Safari (best iOS support)
- Enable camera in Settings → Safari
- Requires iOS 14+

### Android

- Use Chrome
- Enable camera permission
- Requires Android 8+
- Better performance on newer devices

---

## 🆘 Still Having Issues?

### Quick Fixes to Try First:

1. ✅ Refresh page (F5 or Cmd+R)
2. ✅ Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. ✅ Clear cache and reload
4. ✅ Try Incognito/Private mode
5. ✅ Restart browser
6. ✅ Restart computer

### If Nothing Works:

1. Check browser compatibility (Chrome 90+)
2. Test on different device
3. Check internet connection (CDN for MediaPipe)
4. Disable VPN/proxy temporarily
5. Check browser console for specific errors
6. Try different exercise (isolate issue)

### System Requirements:

- **Browser:** Chrome 90+, Firefox 88+, Safari 14+
- **Camera:** 720p or better recommended
- **RAM:** 4GB minimum, 8GB recommended
- **CPU:** Dual-core 2.0GHz minimum
- **Internet:** Required for MediaPipe CDN

---

## 💡 Pro Tips for Best Experience

### Optimal Setup:

- ✨ **Lighting:** Bright, even lighting (face window)
- ✨ **Distance:** 6-8 feet from camera
- ✨ **Height:** Camera at chest level
- ✨ **Background:** Plain, contrasting background
- ✨ **Clothing:** Fitted clothes, contrasting colors
- ✨ **Space:** Clear 6x6 foot area

### Exercise-Specific Tips:

**Upper Body:**

- Keep elbows visible
- Face camera directly
- Show full arm extension

**Lower Body:**

- Show full body including feet
- Step back more than upper body
- Keep knees and ankles visible

**Core:**

- Profile or 3/4 view may work better
- Ensure hip and shoulder landmarks visible
- Use yoga mat for better tracking

---

## 📞 Getting More Help

1. **Check README.md** - Full documentation
2. **Review exercise tips** - In app when exercise selected
3. **Browser console** - F12 for detailed errors
4. **GitHub Issues** - Report bugs or request features

---

**Remember:** 90% of issues are solved by:

1. Better lighting
2. Showing full body
3. Using Chrome browser
4. Refreshing the page

**Good luck and happy exercising!** 💪
