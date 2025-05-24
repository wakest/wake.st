let textInput;
let sizePercentageSlider;
let spacingFactorSlider;
let startAngleSlider;
let textSizeSlider;
let currentText = "";

const randomWordList = ["explore", "create", "visual", "code", "trash", "fun", "think", "circle", "text", "design", "ideas", "pattern", "effect", "dream", "imagine", "dunk", "flow", "cycle", "curve"];

// --- UI Layout Constants ---
const PALETTE_PADDING = 15;
const PALETTE_HEADER_HEIGHT = 30;
const UI_LABEL_TEXT_SIZE = 13;
const UI_LABEL_TEXT_HEIGHT_APPROX = 16;
const UI_LABEL_TO_ELEMENT_VERTICAL_GAP = 4;
const UI_DOM_ELEMENT_HEIGHT_APPROX = 24;
const UI_CUSTOM_INTERACTIVE_AREA_HEIGHT = UI_DOM_ELEMENT_HEIGHT_APPROX + 6;
const UI_ELEMENT_GROUP_VERTICAL_GAP = 15;
const UI_SIDE_BY_SIDE_SLIDER_GAP_X = 15;
const SUB_SECTION_TOGGLE_ICON_SIZE = 12;


const GROUP_DOM_ELEMENT_ONLY_HEIGHT = UI_DOM_ELEMENT_HEIGHT_APPROX;
const GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT = UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP + UI_DOM_ELEMENT_HEIGHT_APPROX;
const GROUP_WITH_CUSTOM_LABEL_AND_ELEMENT_HEIGHT = UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT;
const GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT = UI_CUSTOM_INTERACTIVE_AREA_HEIGHT;


// --- Palette Configuration ---
let palette = {
  x: 20, y: 20, w: 360,
  h: 0, // Will be dynamically calculated in repositionUIElements
  isDragging: false, dragOffsetX: 0, dragOffsetY: 0,
  isHidden: false, storedX: 20, storedY: 20,
  hideButtonIconChar: "–", hideButtonIconSize: 20, hideButtonAreaSize: 25, hideButtonPadding: 5,
  showButtonDiameter: 30, 
  hiddenButtonX: 0, hiddenButtonY: 0, 
  isDraggingHiddenButton: false, hiddenButtonDragOffsetX: 0, hiddenButtonDragOffsetY: 0,
  mouseDownOnHiddenButtonX: 0, mouseDownOnHiddenButtonY: 0,
  bgColor: null, borderColor: null, textColor: null, labelColor: null, iconColor: null,
  // Font/Case section visibility
  isFontCaseSectionVisible: true,
  fontCaseToggleIconRect: { x: 0, y: 0, w: SUB_SECTION_TOGGLE_ICON_SIZE + 4, h: SUB_SECTION_TOGGLE_ICON_SIZE + 4 },
  // Font selection
  availableFonts: ["Arial", "Brush Script MT", "Georgia", "Impact"],
  currentFontIndex: 0, 
  fontToggleRects: [], 
  // Case toggle
  isUppercaseActive: false,
  uppercaseToggleRect: { x: 0, y: 0, w: 0, h: 0 },
  lowercaseToggleRect: { x: 0, y: 0, w: 0, h: 0 },
  // Circle visibility
  isCircleVisible: true,
  circleToggleButtonRect: { x: 0, y: 0, w: 0, h: 0 },
  // Save button
  saveButtonRect: { x: 0, y: 0, w: 0, h: 0 },
  saveButtonIsCurrentlyPressed: false,
  isSavingFrame: false, wasHiddenBeforeSave: false,
  // Colors
  activePillColor: null, inactivePillFillColor: null, 
  pressedPillColor: null, dimTextColor: null,
  defaultPaletteFont: null,
};

const FULL_WIDTH_ELEMENT_PALETTE = palette.w - (2 * PALETTE_PADDING);
const SINGLE_SLIDER_WIDTH = (FULL_WIDTH_ELEMENT_PALETTE - UI_SIDE_BY_SIDE_SLIDER_GAP_X) / 2;
const NUM_FONT_CHOICES = palette.availableFonts.length;
const FONT_PILL_GAP = 5;
const FONT_PILL_WIDTH = (FULL_WIDTH_ELEMENT_PALETTE - (FONT_PILL_GAP * (NUM_FONT_CHOICES - 1))) / NUM_FONT_CHOICES;


let globalStylesInjected = false;

function injectGlobalStyles() { /* ... (same) ... */ 
    if (globalStylesInjected) return;
    const TRACK_HEIGHT_PX = 16; const THUMB_DIAMETER_PX = 12;
    const WEBKIT_THUMB_MARGIN_TOP_PX = (TRACK_HEIGHT_PX - THUMB_DIAMETER_PX) / 2;
    const minCSS=`input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:${UI_DOM_ELEMENT_HEIGHT_APPROX}px;background:transparent;cursor:pointer;outline:none;padding:0;margin:0}input[type=range]::-webkit-slider-runnable-track{width:100%;height:${TRACK_HEIGHT_PX}px;background:#383838;border-radius:${TRACK_HEIGHT_PX/2}px;border:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;margin-top:${WEBKIT_THUMB_MARGIN_TOP_PX}px;width:${THUMB_DIAMETER_PX}px;height:${THUMB_DIAMETER_PX}px;background:#fff;border-radius:50%;border:none}input[type=range]::-moz-range-track{width:100%;height:${TRACK_HEIGHT_PX}px;background:#383838;border-radius:${TRACK_HEIGHT_PX/2}px;border:none}input[type=range]::-moz-range-thumb{width:${THUMB_DIAMETER_PX}px;height:${THUMB_DIAMETER_PX}px;background:#fff;border-radius:50%;border:none}input[type=text]:focus{outline:none}`;
    const styleElement = document.createElement('style'); styleElement.type = 'text/css';
    if (styleElement.styleSheet) { styleElement.styleSheet.cssText = minCSS; } 
    else { styleElement.appendChild(document.createTextNode(minCSS)); }
    document.head.appendChild(styleElement);
    globalStylesInjected = true;
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  palette.defaultPaletteFont = textFont(); 
  
  palette.bgColor = color(0, 0, 15, 95); palette.borderColor = color(0, 0, 40, 100);
  palette.textColor = color(0, 0, 90, 100); palette.labelColor = color(0, 0, 80, 100);
  palette.iconColor = color(0, 0, 70, 100); palette.dimTextColor = color(0, 0, 55, 100);
  palette.activePillColor = color(0, 0, 35, 90); 
  palette.inactivePillFillColor = color(0, 0, 20, 90);
  palette.pressedPillColor = color(0, 0, 45, 95);

  injectGlobalStyles();

  let words = [];
  for (let i = 0; i < 3; i++) { words.push(randomWordList[floor(random(randomWordList.length))]); }
  currentText = words.join(" • ");

  textInput = createInput(currentText); textInput.input(() => { currentText = textInput.value(); }); styleInput(textInput);
  sizePercentageSlider = createSlider(10, 80, 50); styleSlider(sizePercentageSlider);
  spacingFactorSlider = createSlider(0.5, 3.0, 1.0, 0.01); styleSlider(spacingFactorSlider);
  startAngleSlider = createSlider(0, TWO_PI, PI, 0.01); styleSlider(startAngleSlider);
  textSizeSlider = createSlider(8, 48, 18, 1); styleSlider(textSizeSlider);
  
  palette.hiddenButtonX = palette.x + palette.hideButtonPadding + palette.hideButtonAreaSize / 2;
  palette.hiddenButtonY = palette.y + PALETTE_HEADER_HEIGHT / 2;
  
  for (let i = 0; i < palette.availableFonts.length; i++) {
    palette.fontToggleRects.push({ x: 0, y: 0, w: 0, h: 0 });
  }

  repositionUIElements(); // This will also calculate initial palette.h
  if (palette.isHidden) { hideDOMElements(); }
}

function styleInput(element) { /* ... (same) ... */ 
  element.style('background-color', '#111111'); element.style('color', '#FFFFFF');
  element.style('border', '1px solid #333333'); 
  element.style('border-radius', '6px');
  element.style('padding', '0px 8px'); element.style('box-sizing', 'border-box');
  element.style('height', UI_DOM_ELEMENT_HEIGHT_APPROX + 'px');
}
function styleSlider(element) { /* ... (same) ... */ 
  element.style('height', UI_DOM_ELEMENT_HEIGHT_APPROX + 'px');
  element.style('box-sizing', 'border-box');
  element.style('background', 'transparent'); 
  element.style('border', 'none');     
  element.style('border-radius', '0'); 
  element.style('padding', '0'); 
}
function hsbToCss(p5Color) { /* ... (same) ... */
    let c = color(hue(p5Color), saturation(p5Color), brightness(p5Color));
    return c.toString('#rrggbb');
}

function hideDOMElements() { /* ... (same) ... */
  textInput.hide(); sizePercentageSlider.hide(); spacingFactorSlider.hide();
  startAngleSlider.hide(); textSizeSlider.hide(); 
}
function showDOMElements() { /* ... (same) ... */
  textInput.show(); sizePercentageSlider.show(); spacingFactorSlider.show();
  startAngleSlider.show(); textSizeSlider.show(); 
}

function draw() {
  background(0, 0, 7); 
  textFont(palette.availableFonts[palette.currentFontIndex]);

  let currentSizePercentage = sizePercentageSlider.value();
  let currentTextSpacing = spacingFactorSlider.value();
  let currentStartAngle = startAngleSlider.value();
  let currentDynamicTextSize = textSizeSlider.value();
  let currentStrToDraw = palette.isUppercaseActive ? currentText.toUpperCase() : currentText;
  
  let centerX = width / 2; let centerY = height / 2;
  let baseDiameter = (currentSizePercentage / 100) * min(width, height);
  
  if (palette.isCircleVisible) {
    noFill(); strokeWeight(max(1, min(width, height) / 200)); stroke(0, 0, 60);
    ellipse(centerX, centerY, baseDiameter, baseDiameter);
  }

  if (currentStrToDraw && currentStrToDraw.trim().length > 0) {
    let textPathRadius = (baseDiameter / 2) + currentDynamicTextSize * 0.8;
    push(); textSize(currentDynamicTextSize); fill(0, 0, 90); noStroke(); textAlign(CENTER, CENTER);
    for (let i = 0; i < currentStrToDraw.length; i++) {
      let char = currentStrToDraw.charAt(i);
      let baseAngle = map(i, 0, currentStrToDraw.length, 0, TWO_PI * currentTextSpacing);
      let charAngle = baseAngle + currentStartAngle;
      let x = centerX + textPathRadius * cos(charAngle); let y = centerY + textPathRadius * sin(charAngle);
      push(); translate(x, y); rotate(charAngle + HALF_PI); text(char, 0, 0); pop();
    }
    pop();
  }
  textFont(palette.defaultPaletteFont);

  if (palette.isSavingFrame) {
    saveCanvas('wrappedTextArt', 'png');
    palette.isSavingFrame = false;
    if (!palette.wasHiddenBeforeSave) { showDOMElements(); }
  } else {
    drawPalette();
  }
}

function drawPalette() {
  push();
  textFont(palette.defaultPaletteFont);

  if (palette.isHidden) {
    fill(palette.bgColor); stroke(palette.borderColor); strokeWeight(1.5);
    ellipse(palette.hiddenButtonX, palette.hiddenButtonY, palette.showButtonDiameter, palette.showButtonDiameter);
    noStroke(); fill(palette.textColor); textAlign(CENTER, CENTER); textSize(palette.hideButtonIconSize * 1.3);
    text("+", palette.hiddenButtonX, palette.hiddenButtonY);
  } else {
    fill(palette.bgColor); stroke(palette.borderColor); strokeWeight(1);
    rect(palette.x, palette.y, palette.w, palette.h, 8); // Use dynamic palette.h

    fill(palette.textColor); textAlign(CENTER, CENTER); textSize(16); noStroke();
    text("Controls", palette.x + palette.w / 2, palette.y + PALETTE_HEADER_HEIGHT / 2);

    let hideIconCenterX = palette.x + palette.hideButtonPadding + palette.hideButtonAreaSize / 2;
    let hideIconCenterY = palette.y + PALETTE_HEADER_HEIGHT / 2;
    fill(palette.textColor); textAlign(CENTER, CENTER); textSize(palette.hideButtonIconSize);
    text(palette.hideButtonIconChar, hideIconCenterX, hideIconCenterY -1);

    let yCursor = palette.y + PALETTE_HEADER_HEIGHT + PALETTE_PADDING;
    
    // Text Input (no p5.js label)
    yCursor += GROUP_DOM_ELEMENT_ONLY_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP; 
    
    // Slider Rows
    fill(palette.labelColor); textAlign(LEFT, BOTTOM); textSize(UI_LABEL_TEXT_SIZE); noStroke();
    text(`Circle Size: ${sizePercentageSlider.value()}%`, palette.x + PALETTE_PADDING, yCursor + UI_LABEL_TEXT_HEIGHT_APPROX);
    text(`Spacing: ${spacingFactorSlider.value().toFixed(2)}x`, palette.x + PALETTE_PADDING + SINGLE_SLIDER_WIDTH + UI_SIDE_BY_SIDE_SLIDER_GAP_X, yCursor + UI_LABEL_TEXT_HEIGHT_APPROX);
    yCursor += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP;
    text(`Rotation: ${degrees(startAngleSlider.value()).toFixed(0)}°`, palette.x + PALETTE_PADDING, yCursor + UI_LABEL_TEXT_HEIGHT_APPROX);
    text(`Text Size: ${textSizeSlider.value()}px`, palette.x + PALETTE_PADDING + SINGLE_SLIDER_WIDTH + UI_SIDE_BY_SIDE_SLIDER_GAP_X, yCursor + UI_LABEL_TEXT_HEIGHT_APPROX);
    yCursor += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP;

    // Font Selection Section
    fill(palette.labelColor); textAlign(LEFT, BOTTOM); textSize(UI_LABEL_TEXT_SIZE); noStroke();
    text("Font:", palette.x + PALETTE_PADDING, yCursor + UI_LABEL_TEXT_HEIGHT_APPROX);
    // Draw Font/Case Toggle Icon
    let fcIconChar = palette.isFontCaseSectionVisible ? "–" : "+";
    let fcIconX = palette.fontCaseToggleIconRect.x + palette.fontCaseToggleIconRect.w / 2;
    let fcIconY = palette.fontCaseToggleIconRect.y + palette.fontCaseToggleIconRect.h / 2;
    fill(palette.textColor); textAlign(CENTER, CENTER); textSize(SUB_SECTION_TOGGLE_ICON_SIZE + 2); noStroke();
    text(fcIconChar, fcIconX, fcIconY);
    
    if (palette.isFontCaseSectionVisible) {
        let fontToggleInteractiveAreaY = yCursor + UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP;
        let fontPillHeight = UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - 8; 
        let fontPillY = fontToggleInteractiveAreaY + (UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - fontPillHeight) / 2;
        let fontPillRadius = fontPillHeight / 2;
        
        for (let i = 0; i < palette.availableFonts.length; i++) {
            let r = palette.fontToggleRects[i];
            noStroke();
            fill(i === palette.currentFontIndex ? palette.activePillColor : palette.inactivePillFillColor);
            rect(r.x, fontPillY, r.w, fontPillHeight, fontPillRadius);
            
            fill(i === palette.currentFontIndex ? palette.textColor : palette.dimTextColor);
            textAlign(CENTER, CENTER); textSize(UI_LABEL_TEXT_SIZE * 0.85);
            textFont(palette.availableFonts[i]); 
            text(palette.availableFonts[i], r.x + r.w / 2, fontToggleInteractiveAreaY + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT / 2);
            textFont(palette.defaultPaletteFont); 
        }
        yCursor += GROUP_WITH_CUSTOM_LABEL_AND_ELEMENT_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP;

        // Case Toggle (no p5.js label)
        let caseToggleInteractiveAreaY = yCursor; 
        let pillHeight = UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - 8; 
        let casePillY = caseToggleInteractiveAreaY + (UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - pillHeight) / 2;
        let casePillRadius = pillHeight / 2;
        noStroke(); 
        fill(palette.isUppercaseActive ? palette.activePillColor : palette.inactivePillFillColor); 
        rect(palette.uppercaseToggleRect.x, casePillY, palette.uppercaseToggleRect.w, pillHeight, casePillRadius, 0, 0, casePillRadius);
        fill(!palette.isUppercaseActive ? palette.activePillColor : palette.inactivePillFillColor); 
        rect(palette.lowercaseToggleRect.x, casePillY, palette.lowercaseToggleRect.w, pillHeight, 0, casePillRadius, casePillRadius, 0);
        textAlign(CENTER, CENTER); textSize(UI_LABEL_TEXT_SIZE * 0.9); noStroke();
        fill(palette.isUppercaseActive ? palette.textColor : palette.dimTextColor);
        text("UPPERCASE", palette.uppercaseToggleRect.x + palette.uppercaseToggleRect.w / 2, caseToggleInteractiveAreaY + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT / 2);
        fill(!palette.isUppercaseActive ? palette.textColor : palette.dimTextColor);
        text("lowercase", palette.lowercaseToggleRect.x + palette.lowercaseToggleRect.w / 2, caseToggleInteractiveAreaY + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT / 2);
        yCursor += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP;
    } else {
        // If Font/Case section is hidden, just advance yCursor by the space its label took up.
         yCursor += UI_LABEL_TEXT_HEIGHT_APPROX + UI_ELEMENT_GROUP_VERTICAL_GAP; // Approximate height of the "Font [-]" line
    }


    // Show/Hide Circle Button
    let pillHeight = UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - 8; // Re-declare locally
    let circleButtonInteractiveAreaY = yCursor;
    let circleButtonPillY = circleButtonInteractiveAreaY + (UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - pillHeight)/2;
    noStroke(); fill(palette.activePillColor); 
    rect(palette.circleToggleButtonRect.x, circleButtonPillY, palette.circleToggleButtonRect.w, pillHeight, pillHeight/2);
    fill(palette.textColor); textAlign(CENTER, CENTER); textSize(UI_LABEL_TEXT_SIZE); noStroke();
    let circleButtonText = palette.isCircleVisible ? "Hide Circle" : "Show Circle";
    text(circleButtonText, palette.circleToggleButtonRect.x + palette.circleToggleButtonRect.w / 2, circleButtonInteractiveAreaY + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT / 2);
    yCursor += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT + UI_ELEMENT_GROUP_VERTICAL_GAP;

    // Save Image Button
    let saveButtonInteractiveAreaY = yCursor;
    let savePillY = saveButtonInteractiveAreaY + (UI_CUSTOM_INTERACTIVE_AREA_HEIGHT - pillHeight)/2;
    noStroke();
    if (palette.saveButtonIsCurrentlyPressed) { fill(palette.pressedPillColor); }
    else { fill(palette.activePillColor); }
    rect(palette.saveButtonRect.x, savePillY, palette.saveButtonRect.w, pillHeight, pillHeight/2);
    fill(palette.textColor); textAlign(CENTER, CENTER); textSize(UI_LABEL_TEXT_SIZE); noStroke();
    text("Save Image", palette.saveButtonRect.x + palette.saveButtonRect.w / 2, saveButtonInteractiveAreaY + UI_CUSTOM_INTERACTIVE_AREA_HEIGHT / 2);
  }
  pop();
}

function repositionUIElements() {
  if (palette.isHidden || palette.isSavingFrame) return;
  
  let currentTotalHeight = PALETTE_HEADER_HEIGHT + (2 * PALETTE_PADDING); // Start with header and padding
  let yCursor = palette.y + PALETTE_HEADER_HEIGHT + PALETTE_PADDING;
  let elementActualY; 
  let customElementInteractiveAreaY;

  // Text Input
  elementActualY = yCursor; 
  textInput.position(palette.x + PALETTE_PADDING, elementActualY); textInput.size(FULL_WIDTH_ELEMENT_PALETTE);
  yCursor += GROUP_DOM_ELEMENT_ONLY_HEIGHT;
  currentTotalHeight += GROUP_DOM_ELEMENT_ONLY_HEIGHT;
  if (true) { // Check if there's another group after this
      yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP;
      currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP;
  }


  // Slider Rows
  elementActualY = yCursor + UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP;
  sizePercentageSlider.position(palette.x + PALETTE_PADDING, elementActualY); sizePercentageSlider.style('width', SINGLE_SLIDER_WIDTH + 'px');
  spacingFactorSlider.position(palette.x + PALETTE_PADDING + SINGLE_SLIDER_WIDTH + UI_SIDE_BY_SIDE_SLIDER_GAP_X, elementActualY); spacingFactorSlider.style('width', SINGLE_SLIDER_WIDTH + 'px');
  yCursor += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT;
  currentTotalHeight += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT;
  if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }

  elementActualY = yCursor + UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP;
  startAngleSlider.position(palette.x + PALETTE_PADDING, elementActualY); startAngleSlider.style('width', SINGLE_SLIDER_WIDTH + 'px');
  textSizeSlider.position(palette.x + PALETTE_PADDING + SINGLE_SLIDER_WIDTH + UI_SIDE_BY_SIDE_SLIDER_GAP_X, elementActualY); textSizeSlider.style('width', SINGLE_SLIDER_WIDTH + 'px');
  yCursor += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT;
  currentTotalHeight += GROUP_WITH_DOM_LABEL_AND_ELEMENT_HEIGHT;
  if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }

  // Font Selection Section Toggle Icon
  let fontLabelWidth = textWidth("Font:") + 10; // Approximate width for "Font: "
  palette.fontCaseToggleIconRect = {
      x: palette.x + PALETTE_PADDING + fontLabelWidth,
      y: yCursor + (UI_LABEL_TEXT_HEIGHT_APPROX - SUB_SECTION_TOGGLE_ICON_SIZE) / 2, // Vertically align with "Font:" label
      w: SUB_SECTION_TOGGLE_ICON_SIZE + 8, // Clickable width
      h: SUB_SECTION_TOGGLE_ICON_SIZE + 4  // Clickable height
  };

  if (palette.isFontCaseSectionVisible) {
    customElementInteractiveAreaY = yCursor + UI_LABEL_TEXT_HEIGHT_APPROX + UI_LABEL_TO_ELEMENT_VERTICAL_GAP;
    let currentXFont = palette.x + PALETTE_PADDING;
    for (let i = 0; i < palette.availableFonts.length; i++) {
        palette.fontToggleRects[i] = {
            x: currentXFont, y: customElementInteractiveAreaY,
            w: FONT_PILL_WIDTH, h: UI_CUSTOM_INTERACTIVE_AREA_HEIGHT
        };
        currentXFont += FONT_PILL_WIDTH + FONT_PILL_GAP;
    }
    yCursor += GROUP_WITH_CUSTOM_LABEL_AND_ELEMENT_HEIGHT;
    currentTotalHeight += GROUP_WITH_CUSTOM_LABEL_AND_ELEMENT_HEIGHT;
    if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }

    // Case Toggle
    customElementInteractiveAreaY = yCursor; // This group has no separate p5 label in this config
    let toggleOptionWidth = FULL_WIDTH_ELEMENT_PALETTE / 2;
    palette.uppercaseToggleRect = {
        x: palette.x + PALETTE_PADDING, y: customElementInteractiveAreaY,
        w: toggleOptionWidth, h: UI_CUSTOM_INTERACTIVE_AREA_HEIGHT
    };
    palette.lowercaseToggleRect = {
        x: palette.x + PALETTE_PADDING + toggleOptionWidth, y: customElementInteractiveAreaY,
        w: toggleOptionWidth, h: UI_CUSTOM_INTERACTIVE_AREA_HEIGHT
    };
    yCursor += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT; // Since "Case:" label was removed for this group
    currentTotalHeight += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT;
    if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }
  } else {
      // Font/Case section is hidden, just account for the "Font:" label line
      yCursor += UI_LABEL_TEXT_HEIGHT_APPROX;
      currentTotalHeight += UI_LABEL_TEXT_HEIGHT_APPROX;
      if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }
  }
  
  // Show/Hide Circle Button
  customElementInteractiveAreaY = yCursor;
  palette.circleToggleButtonRect = {
      x: palette.x + PALETTE_PADDING, y: customElementInteractiveAreaY,
      w: FULL_WIDTH_ELEMENT_PALETTE, h: UI_CUSTOM_INTERACTIVE_AREA_HEIGHT
  };
  yCursor += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT;
  currentTotalHeight += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT;
  if (true) { yCursor += UI_ELEMENT_GROUP_VERTICAL_GAP; currentTotalHeight += UI_ELEMENT_GROUP_VERTICAL_GAP; }


  // Save Image Button
  customElementInteractiveAreaY = yCursor;
  palette.saveButtonRect = {
      x: palette.x + PALETTE_PADDING, y: customElementInteractiveAreaY,
      w: FULL_WIDTH_ELEMENT_PALETTE, h: UI_CUSTOM_INTERACTIVE_AREA_HEIGHT
  };
  currentTotalHeight += GROUP_CUSTOM_ELEMENT_ONLY_HEIGHT;
  // No gap after the last element

  palette.h = currentTotalHeight; // Set dynamic height
}


function isMouseOverDOMElement(element) { /* ... (same) ... */
    if (!element || typeof element.elt === 'undefined' || element.elt.style.display === 'none') { return false; }
    const pos = element.position(); const w = element.width; const h = element.height;
    if (w === 0 && h === 0) return false; 
    return (mouseX >= pos.x && mouseX <= pos.x + w && mouseY >= pos.y && mouseY <= pos.y + h);
}

function mousePressed() {
  if (palette.isSavingFrame) return;
  let eventConsumed = false;

  if (palette.isHidden) {
    if (dist(mouseX, mouseY, palette.hiddenButtonX, palette.hiddenButtonY) < palette.showButtonDiameter / 2) {
      if (mouseButton === LEFT) {
          palette.isDraggingHiddenButton = true;
          palette.hiddenButtonDragOffsetX = mouseX - palette.hiddenButtonX;
          palette.hiddenButtonDragOffsetY = mouseY - palette.hiddenButtonY;
          palette.mouseDownOnHiddenButtonX = mouseX;
          palette.mouseDownOnHiddenButtonY = mouseY;
      }
      eventConsumed = true;
    }
  } else { 
    let hideIconClickX_AreaStart = palette.x + palette.hideButtonPadding;
    let hideIconClickY_AreaStart = palette.y + palette.hideButtonPadding;
    let hideIconClickWidth = palette.hideButtonAreaSize;
    let hideIconClickHeight = PALETTE_HEADER_HEIGHT - 2 * palette.hideButtonPadding;
    if (mouseX > hideIconClickX_AreaStart && mouseX < hideIconClickX_AreaStart + hideIconClickWidth &&
        mouseY > hideIconClickY_AreaStart && mouseY < hideIconClickY_AreaStart + hideIconClickHeight) {
      palette.isHidden = true;
      palette.storedX = palette.x; palette.storedY = palette.y;
      palette.hiddenButtonX = palette.storedX + palette.hideButtonPadding + palette.hideButtonAreaSize / 2;
      palette.hiddenButtonY = palette.storedY + PALETTE_HEADER_HEIGHT / 2;
      hideDOMElements(); eventConsumed = true;
    }
    
    // Font/Case Section Toggle Icon
    if (!eventConsumed && mouseX > palette.fontCaseToggleIconRect.x && mouseX < palette.fontCaseToggleIconRect.x + palette.fontCaseToggleIconRect.w &&
        mouseY > palette.fontCaseToggleIconRect.y && mouseY < palette.fontCaseToggleIconRect.y + palette.fontCaseToggleIconRect.h) {
        palette.isFontCaseSectionVisible = !palette.isFontCaseSectionVisible;
        repositionUIElements(); // Recalculate layout and palette height
        eventConsumed = true;
    }


    if (palette.isFontCaseSectionVisible) { // Only check these if section is visible
        if (!eventConsumed) { // Font Toggles
            for (let i = 0; i < palette.fontToggleRects.length; i++) {
                let r = palette.fontToggleRects[i];
                if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
                    palette.currentFontIndex = i; eventConsumed = true; break; 
                }
            }
        }
        if (!eventConsumed && mouseX > palette.uppercaseToggleRect.x && mouseX < palette.uppercaseToggleRect.x + palette.uppercaseToggleRect.w &&
            mouseY > palette.uppercaseToggleRect.y && mouseY < palette.uppercaseToggleRect.y + palette.uppercaseToggleRect.h) {
            palette.isUppercaseActive = true; eventConsumed = true;
        }
        if (!eventConsumed && mouseX > palette.lowercaseToggleRect.x && mouseX < palette.lowercaseToggleRect.x + palette.lowercaseToggleRect.w &&
            mouseY > palette.lowercaseToggleRect.y && mouseY < palette.lowercaseToggleRect.y + palette.lowercaseToggleRect.h) {
            palette.isUppercaseActive = false; eventConsumed = true;
        }
    }


    if (!eventConsumed && mouseX > palette.circleToggleButtonRect.x && mouseX < palette.circleToggleButtonRect.x + palette.circleToggleButtonRect.w &&
        mouseY > palette.circleToggleButtonRect.y && mouseY < palette.circleToggleButtonRect.y + palette.circleToggleButtonRect.h) {
        palette.isCircleVisible = !palette.isCircleVisible; eventConsumed = true;
    }
    if (!eventConsumed && mouseX > palette.saveButtonRect.x && mouseX < palette.saveButtonRect.x + palette.saveButtonRect.w &&
        mouseY > palette.saveButtonRect.y && mouseY < palette.saveButtonRect.y + palette.saveButtonRect.h) {
        palette.saveButtonIsCurrentlyPressed = true;
        palette.wasHiddenBeforeSave = palette.isHidden;
        if (!palette.wasHiddenBeforeSave) { hideDOMElements(); }
        palette.isSavingFrame = true; eventConsumed = true;
    }

    if (!eventConsumed && 
        (isMouseOverDOMElement(textInput) || 
         isMouseOverDOMElement(sizePercentageSlider) ||
         isMouseOverDOMElement(spacingFactorSlider) ||
         isMouseOverDOMElement(startAngleSlider) ||
         isMouseOverDOMElement(textSizeSlider))) {
        eventConsumed = true; 
    }

    if (!eventConsumed && mouseX > palette.x && mouseX < palette.x + palette.w &&
        mouseY > palette.y && mouseY < palette.y + palette.h) {
      palette.isDragging = true;
      palette.dragOffsetX = mouseX - palette.x; palette.dragOffsetY = mouseY - palette.y;
    }
  }
}

function doubleClicked() {
  if (palette.isSavingFrame || palette.isHidden) return; 
  if (mouseX > palette.x && mouseX < palette.x + palette.w && 
      mouseY > palette.y && mouseY < palette.y + PALETTE_HEADER_HEIGHT) {
      let hideIconClickX_AreaStart = palette.x + palette.hideButtonPadding;
      let hideIconClickWidth = palette.hideButtonAreaSize;
      if (!(mouseX > hideIconClickX_AreaStart && mouseX < hideIconClickX_AreaStart + hideIconClickWidth)) {
        palette.isHidden = true; 
        palette.storedX = palette.x; palette.storedY = palette.y;
        palette.hiddenButtonX = palette.storedX + palette.hideButtonPadding + palette.hideButtonAreaSize / 2;
        palette.hiddenButtonY = palette.storedY + PALETTE_HEADER_HEIGHT / 2;
        hideDOMElements();
      }
  }
}


function mouseDragged() { /* ... (same) ... */
  if (palette.isSavingFrame) return;
  if (palette.isHidden && palette.isDraggingHiddenButton) {
    palette.hiddenButtonX = mouseX - palette.hiddenButtonDragOffsetX;
    palette.hiddenButtonY = mouseY - palette.hiddenButtonDragOffsetY;
    palette.hiddenButtonX = constrain(palette.hiddenButtonX, palette.showButtonDiameter/2, width - palette.showButtonDiameter/2);
    palette.hiddenButtonY = constrain(palette.hiddenButtonY, palette.showButtonDiameter/2, height - palette.showButtonDiameter/2);

  } else if (!palette.isHidden && palette.isDragging) {
    palette.x = mouseX - palette.dragOffsetX; palette.y = mouseY - palette.dragOffsetY;
    constrainPalettePosition(); repositionUIElements(); 
  }
}
function constrainPalettePosition() { /* ... (same) ... */
    palette.x = constrain(palette.x, 0, windowWidth - palette.w);
    palette.y = constrain(palette.y, 0, windowHeight - palette.h);
}

function mouseReleased() { /* ... (same) ... */
  if (palette.isHidden && palette.isDraggingHiddenButton) {
    let distMoved = dist(mouseX, mouseY, palette.mouseDownOnHiddenButtonX, palette.mouseDownOnHiddenButtonY);
    if (distMoved < 5) { 
        palette.isHidden = false;
        palette.x = palette.storedX; 
        palette.y = palette.storedY;
        constrainPalettePosition(); 
        showDOMElements(); 
        repositionUIElements();
    }
  }
  palette.isDragging = false;
  palette.isDraggingHiddenButton = false;
  if(palette.saveButtonIsCurrentlyPressed) { palette.saveButtonIsCurrentlyPressed = false; }
}

function windowResized() { /* ... (same) ... */
  resizeCanvas(windowWidth, windowHeight);
  if (!palette.isHidden) { constrainPalettePosition(); }
  else { 
      palette.hiddenButtonX = constrain(palette.hiddenButtonX, palette.showButtonDiameter/2, width - palette.showButtonDiameter/2);
      palette.hiddenButtonY = constrain(palette.hiddenButtonY, palette.showButtonDiameter/2, height - palette.showButtonDiameter/2);
  }
  
  styleInput(textInput);
  styleSlider(sizePercentageSlider); styleSlider(spacingFactorSlider);
  styleSlider(startAngleSlider); styleSlider(textSizeSlider);
  
  if(!palette.isHidden && !palette.isSavingFrame) repositionUIElements();
}