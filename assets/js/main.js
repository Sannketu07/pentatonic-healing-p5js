// Unified main.js for all elements
let userInput = "";
let maxInputLength = 20;
let bg;
let hangingImages = {};
let audioMap = {};
let nunitoFont;
let melodyMap = {};
let charObjects = [];
let particles = []; // 粒子效果

// Get element from URL or default to 'tu'
let element = window.selectedElement || 'tu';

// Color schemes for five elements
const colorSchemes = {
  'jin': {
    primary: [101, 67, 33],
    secondary: [139, 69, 19],
    textBg: [245, 245, 220],
    textShadow: [101, 67, 33],
    particle: [192, 192, 192, 150],
    highlight: [139, 69, 19] // Bright beige
  },
  'mu': {
    primary: [34, 139, 34],
    secondary: [71, 240, 126],
    textBg: [240, 255, 240],
    textShadow: [85, 107, 47],
    particle: [144, 238, 144, 150],
    highlight: [71, 240, 126] // Bright green
  },
  'shui': {
    primary: [70, 130, 180],
    secondary: [62, 146, 243],
    textBg: [240, 248, 255],
    textShadow: [25, 25, 112],
    particle: [135, 206, 250, 150],
    highlight: [62, 146, 243] // Bright blue
  },
  'huo': {
    primary: [178, 34, 34],
    secondary: [178, 34, 34],
    textBg: [255, 240, 245],
    textShadow: [139, 0, 0],
    particle: [255, 140, 0, 150],
    highlight: [178, 34, 34] // Bright orange-red
  },
  'tu': {
    primary: [101, 67, 33],
    secondary: [139, 69, 19],
    textBg: [245, 245, 220],
    textShadow: [101, 67, 33],
    particle: [210, 180, 140, 150],
    highlight: [160, 82, 45] // Bright tan
  }
};

let currentColors = colorSchemes[element];

// Element-specific texts
const elementTexts = {
  'jin': {
    title: 'Whispers of Metal',
    subtitle: 'Type 20 characters, press Enter to send',
    prompt: 'Composing: '
  },
  'mu': {
    title: 'Spring Unfolding',
    subtitle: 'Type 20 characters, press Enter to send',
    prompt: 'Composing: '
  },
  'shui': {
    title: 'Water Dreams',
    subtitle: 'Type 20 characters, press Enter to send',
    prompt: 'Composing: '
  },
  'huo': {
    title: 'Fire in Bloom',
    subtitle: 'Type 20 characters, press Enter to send',
    prompt: 'Composing: '
  },
  'tu': {
    title: 'Earth of Calm',
    subtitle: 'Type 20 characters, press Enter to send',
    prompt: 'Composing: '
  }
};

// Particle class for background effects
class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 6);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.alpha = random(50, 150);
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  
  display() {
    noStroke();
    fill(...currentColors.particle.slice(0, 3), this.alpha);
    circle(this.x, this.y, this.size);
  }
}

function preload() {
  try {
    bg = loadImage(`../assets/images/${element}.png`, 
      () => console.log('Background loaded'),
      () => console.error('Failed to load background')
    );
    
    nunitoFont = loadFont("../assets/fonts/hanchan.ttf",
      () => console.log('Font loaded'),
      () => console.error('Failed to load font')
    );

    // Load hanging images for letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let letter of letters) {
      hangingImages[letter] = loadImage(`../assets/images/${letter}.png`);
    }

    // Load special character images
    const specialChars = {
      ' ': 'space',
      ',': 'comma',
      '.': 'dot',
      '!': 'exclam',
      '?': 'question'
    };
    for (let [char, filename] of Object.entries(specialChars)) {
      hangingImages[char] = loadImage(`../assets/images/${filename}.png`);
    }

    // Load sound files
    const notes = ['gong_C4', 'shang_D4', 'jue_E4', 'zhi_G4', 'yu_A4', 
                   'space', 'dot', 'comma', 'exclamation', 'question'];
    for (let note of notes) {
      melodyMap[note] = loadSound(`../assets/sounds/${note}.mp3`);
    }

    // Character to sound mapping
    audioMap = {
      'e': 'gong_C4', 'a': 'gong_C4', 't': 'gong_C4', 'o': 'gong_C4',
      'n': 'shang_D4', 'i': 'shang_D4', 's': 'shang_D4', 'h': 'shang_D4',
      'r': 'jue_E4', 'd': 'jue_E4', 'l': 'jue_E4',
      'c': 'zhi_G4', 'u': 'zhi_G4', 'm': 'zhi_G4', 'w': 'zhi_G4',
      'g': 'yu_A4', 'y': 'yu_A4', 'p': 'yu_A4', 'b': 'yu_A4',
      'v': 'yu_A4', 'k': 'yu_A4', 'j': 'yu_A4', 'x': 'yu_A4',
      'q': 'yu_A4', 'z': 'yu_A4', 'f': 'yu_A4',
      ' ': 'space', ',': 'comma', '.': 'dot', '!': 'exclamation', '?': 'question'
    };
  } catch (error) {
    console.error('Preload error:', error);
  }
}

function setup() {
  try {
    createCanvas(windowWidth, windowHeight);
    if (nunitoFont) {
      textFont(nunitoFont);
    }
    textAlign(CENTER, CENTER);
    currentColors = colorSchemes[element];
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
    
    console.log('Setup complete for element:', element);
  } catch (error) {
    console.error('Setup error:', error);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reset particles on resize
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0);

  // Draw background image
  if (bg) {
    imageMode(CENTER);
    const imgAspect = bg.width / bg.height;
    const canvasAspect = width / height;
    let drawWidth, drawHeight;

    if (canvasAspect > imgAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
    } else {
      drawHeight = height;
      drawWidth = height * imgAspect;
    }

    image(bg, width / 2, height / 2, drawWidth, drawHeight);
  }
  
  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Display texts with fade-in effect
  push();
  let titleAlpha = min(255, frameCount * 3);
  
  // Main title
  textSize(width * 0.02);
  fill(...currentColors.primary, titleAlpha);
  text(elementTexts[element].title, width / 2, height * 0.05);

  // Subtitle
  textSize(width * 0.012);
  fill(...currentColors.primary, titleAlpha * 0.7);
  text(elementTexts[element].subtitle, width / 2, height * 0.15);

  // Current input
  textSize(width * 0.016);
  fill(...currentColors.primary, titleAlpha);
  text(elementTexts[element].prompt + userInput, width / 2, height * 0.24);
  
  // Blinking cursor
  if (frameCount % 60 < 30) {
    textSize(width * 0.016);
    let cursorX = textWidth(elementTexts[element].prompt + userInput) / 2 + width / 2 + 5;
    text("_", cursorX, height * 0.22);
  }
  pop();

  // Character display area
  const charY = height * 0.4;
  const hangingImgWidth = width * 0.03;
  const hangingImgHeight = height * 0.48;
  const hangingOffsetY = height * 0.28;

  for (let i = 0; i < charObjects.length; i++) {
    let ch = charObjects[i];
    
    // Enhanced floating animation
    let floatOffset = sin(frameCount * 0.05 + i * 0.3) * 5;
    
    // Smooth scale and lift animation when playing
    let charScale = 1;
    let charLift = 0;
    let imgScale = 1;
    let glowAlpha = 0;
    
    if (ch.playing) {
      // Animate scale from 1 to 1.2 smoothly
      let progress = (frameCount - ch.playStartFrame) / 20; // 20 frames for animation
      progress = constrain(progress, 0, 1);
      // Ease-out effect
      progress = 1 - pow(1 - progress, 3);
      
      charScale = lerp(1, 1.2, progress);
      charLift = lerp(0, -30, progress); // Character lifts up 30 pixels
      imgScale = lerp(1, 1.2, progress); // Image only scales, no lift
      glowAlpha = lerp(0, 180, progress);
    }

    // Draw character with lift and scale
    push();
    translate(ch.x, charY + floatOffset + charLift);
    scale(charScale);
    
    // Glow effect using element color
    if (ch.playing && glowAlpha > 0) {
      // Outer glow
      for (let r = 4; r > 0; r--) {
        fill(...currentColors.secondary, glowAlpha / (5 - r));
        textSize(width * 0.02 + r * 2);
        text(ch.char, 0, 0);
      }
    }

    // Main character with element color when playing
    textSize(width * 0.02);
    if (ch.playing) {
      fill(...currentColors.secondary);
    } else {
      fill(...currentColors.textBg);
    }
    text(ch.char, 0, 0);
    pop();

    // Hanging image with scale only (no lift)
    let hangingKey = ch.char.toUpperCase();
    if (hangingImages[hangingKey]) {
      push();
      translate(ch.x, charY + hangingOffsetY + floatOffset);
      scale(imgScale);
      
      // Color tint transition when playing
      if (ch.playing) {
        // Calculate color transition progress
        let progress = (frameCount - ch.playStartFrame) / 20;
        progress = constrain(progress, 0, 1);
        progress = 1 - pow(1 - progress, 3); // Ease-out
        
        // Interpolate from white to element highlight color
        let r = lerp(255, currentColors.highlight[0], progress);
        let g = lerp(255, currentColors.highlight[1], progress);
        let b = lerp(255, currentColors.highlight[2], progress);
        
        tint(r, g, b, 255);
      } else {
        // Normal state - slightly transparent white
        tint(255, 255, 255, 200);
      }
      
      imageMode(CENTER);
      image(
        hangingImages[hangingKey],
        0, 0,
        hangingImgWidth,
        hangingImgHeight
      );
      pop();
    }
  }
  
  // Display keystroke hint at bottom
  if (charObjects.length === 0 && frameCount > 120) {
    push();
    textSize(width * 0.014);
    fill(...currentColors.primary, sin(frameCount * 0.05) * 50 + 150);
    text("Start typing to compose your melody...", width / 2, height * 0.85);
    pop();
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (userInput.length > 0) {
      playUserMelody();
    }
    return;
  }

  if (keyCode === BACKSPACE) {
    if (userInput.length > 0) {
      userInput = userInput.substring(0, userInput.length - 1);
      let removed = charObjects.pop();
      
      // Create burst particles on delete
      createBurstParticles(removed.x, height * 0.4);
    }
    return;
  }

  let inputChar = key.toLowerCase();
  if (!'abcdefghijklmnopqrstuvwxyz ,.?!'.includes(inputChar)) return;
  if (userInput.length >= maxInputLength) return;

  userInput += inputChar;

  charObjects.push({
    char: key,
    x: calculateXPosition(charObjects.length),
    y: height * 0.4,
    playing: false,
    playStartFrame: 0
  });
  
  // Create particles on key press
  createBurstParticles(calculateXPosition(charObjects.length), height * 0.4);

  // Play sound
  let note = audioMap[inputChar] || '-';
  if (melodyMap[note]) melodyMap[note].play();
}

function createBurstParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    let p = new Particle();
    p.x = x;
    p.y = y;
    p.speedX = random(-2, 2);
    p.speedY = random(-3, -1);
    p.size = random(3, 8);
    particles.push(p);
  }
  
  // Remove old particles to maintain performance
  if (particles.length > 100) {
    particles.splice(0, 10);
  }
}

function calculateXPosition(index) {
  let maskWidth = width * 0.75;
  let spacing = maskWidth / maxInputLength;
  return (width - maskWidth) / 2 + spacing * (index + 0.5);
}

function playUserMelody() {
  // Stop all currently playing sounds
  for (let note in melodyMap) {
    if (melodyMap[note].isPlaying()) {
      melodyMap[note].stop();
    }
  }

  const noteDelay = 2400;

  for (let i = 0; i < charObjects.length; i++) {
    let ch = charObjects[i];
    let inputChar = ch.char.toLowerCase();
    let note = audioMap[inputChar] || '-';

    setTimeout(() => {
      if (melodyMap[note]) {
        melodyMap[note].play();
        charObjects[i].playing = true;
        charObjects[i].playStartFrame = frameCount; // Record start frame for animation
        
        // Create particle burst when playing
        createBurstParticles(charObjects[i].x, height * 0.4);
        
        setTimeout(() => {
          charObjects[i].playing = false;
        }, noteDelay - 100);
      }
    }, i * noteDelay);
  }
}