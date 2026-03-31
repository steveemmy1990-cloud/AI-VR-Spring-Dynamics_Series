# Audio Features Troubleshooting Guide

## Introduction Page Voice (Listen to Intro)

The intro page can play the introduction in two ways:

1. **Pre-recorded human voice (recommended)**  
   Place an audio file named **`intro-voice.mp3`** in the project’s **`public`** folder. The app will play this when the user clicks “Listen to intro,” giving a natural, fine female (or any) human voice. Record the script in a quiet room with a good microphone for best results.

2. **Browser text-to-speech fallback**  
   If `public/intro-voice.mp3` is not present, the app uses the browser’s text-to-speech and tries to select a female voice (e.g. Samantha, Karen, Google UK English Female) for a softer result. Quality depends on the device and browser.

---

## Voice Recognition (Microphone Input)

### Requirements:
- **Browser**: Chrome, Edge, or Safari (latest versions)
- **Permissions**: Microphone access must be granted
- **Connection**: HTTPS or localhost only (security requirement)

### How to Use:
1. Click the robot to activate it
2. Click the 🔊 icon to enable voice mode
3. **Hold down** the "Hold to Speak" button
4. Speak clearly while holding the button
5. Release the button when done speaking

### Visual Feedback:
- **Button turns red** = Microphone is active and listening
- **"🔴 Microphone active"** appears below button
- **Transcript shows** = Your speech was recognized
- **"You said: ..."** = Your words were captured

### Common Issues:

**Problem**: No visual feedback when holding button
- **Solution**: Make sure you're clicking and **holding** the button, not just clicking
- **Check**: Browser console for errors (F12)
- **Try**: Refresh the page and click robot again

**Problem**: Browser asks for microphone permission
- **Solution**: Click "Allow" to grant permission
- **Note**: Permission is required for voice features

**Problem**: "Speech recognition error" alert
- **Solution**: 
  - Use Chrome or Edge browser
  - Make sure you're on localhost or HTTPS
  - Check microphone is not used by another app

**Problem**: Transcript not appearing
- **Solution**: 
  - Speak clearly and wait for button to be pressed
  - Check microphone volume in system settings
  - Try speaking louder or closer to microphone

## Text-to-Speech (Audio Output)

### Requirements:
- All modern browsers support text-to-speech
- System volume must be turned up
- Voice mode must be enabled

### How to Use:
1. Enable voice mode with 🔊 icon
2. Ask a question (text or voice)
3. AI responds with both text AND audio

### Visual Feedback:
- **"🔊 AI is speaking..."** appears during audio playback
- **Pulsing animation** on speech bubble when speaking
- **"🔊"** icon in bubble content

### Common Issues:

**Problem**: No audio output
- **Solution**:
  - Check system volume is not muted
  - Make sure voice mode is enabled (🔊 icon should be highlighted)
  - Try toggling voice mode off and on again

**Problem**: Audio cuts off mid-sentence
- **Solution**: 
  - This is a browser timing issue
  - Wait for current audio to finish before asking next question
  - Avoid clicking multiple times quickly

**Problem**: Robotic or unclear voice
- **Solution**: 
  - This is normal for browser text-to-speech
  - Different browsers have different voice quality
  - Chrome typically has the best voice quality

## Testing the Features

### Quick Test:
1. Click robot (should turn blue)
2. Enable voice mode (click 🔊)
3. Type "hi" and click Send
4. You should hear: "Hello! I'm your AI assistant..."
5. Try voice: Hold button, say "help", release
6. You should see transcript and hear response

### Verification Checklist:
- [ ] Robot turns blue when clicked
- [ ] Chat interface appears at bottom left
- [ ] Voice mode button toggles (🔊/🔇)
- [ ] Text input works (type and send)
- [ ] Button turns red when held
- [ ] Status shows "Microphone active"
- [ ] Transcript appears after speaking
- [ ] AI responds with text bubble
- [ ] Audio plays in voice mode (🔊)
- [ ] Speaking indicator appears

## Browser Console Logs

If features aren't working, check the browser console (F12) for these logs:

**Good logs:**
```
Starting speech recognition...
Speech recognized: [your text]
Processing user message: [your text]
AI response generated: [response]
Voice mode active, speaking response
Speaking: [response]
Speech started
Speech ended
```

**Problem logs:**
```
Error starting speech recognition: [error]
Speech recognition error: [error]
Speech error: [error]
```

## Browser Support

### ✅ Fully Supported:
- **Chrome** (Desktop & Android) - Best experience
- **Edge** (Desktop) - Excellent support
- **Safari** (Desktop & iOS) - Good support

### ⚠️ Limited Support:
- **Firefox** - No speech recognition support
- **Opera** - May have issues

### Recommendations:
- Use **Chrome** for best experience
- Use **Edge** as alternative
- **Safari** works but may need permissions

## Permissions

### Granting Microphone Access:

**Chrome/Edge:**
1. Browser will show popup: "Allow microphone access"
2. Click "Allow"
3. If blocked: Click lock icon in address bar → Site settings → Microphone → Allow

**Safari:**
1. Safari → Settings → Websites → Microphone
2. Find localhost → Allow

### If Permissions Denied:
- Features will show error alerts
- You can still use text mode
- To re-enable: Clear site data and refresh

## Performance Tips

1. **Use headphones** to prevent audio feedback
2. **Speak clearly** and at normal pace
3. **Wait for AI to finish** speaking before asking next question
4. **One question at a time** for best results
5. **Use text mode** if in noisy environment

## Getting Help

If issues persist:
1. Check browser console (F12) for errors
2. Try different browser (Chrome recommended)
3. Check system microphone/speaker settings
4. Restart browser
5. Clear browser cache and refresh

The AI will work in text mode even if audio features aren't available!
