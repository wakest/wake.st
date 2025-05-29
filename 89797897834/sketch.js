function setup() {
  createCanvas(600, 400); // Adjusted canvas size
  textFont('monospace');
  textSize(20);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(255); // White text
}

function draw() {
  background(0); // Black background

  // Define text strings
  let topText = "the fediverse";
  let bottomText = "a place to play";

  // Parameters for sine wave distortion
  let amplitudeTop = map(mouseY, 0, height, 5, 20); // Mouse Y controls amplitude
  let frequencyTop = map(mouseX, 0, width, 0.01, 0.05); // Mouse X controls frequency

  let amplitudeBottom = map(mouseY, 0, height, 5, 20); // Mouse Y controls amplitude
  let frequencyBottom = map(mouseX, 0, width, 0.01, 0.05); // Mouse X controls frequency

  // Draw the top text
  push(); // Save current drawing state
  translate(width / 2, height / 4); // Center the text vertically in the top half

  for (let i = 0; i < topText.length; i++) {
    let angle = map(i, 0, topText.length, -PI / 2, PI / 2); // Distribute characters along an arc
    let x = i * 15 - (topText.length * 15) / 2; // Center the text horizontally
    let y = sin(angle * 5 + frameCount * 0.05) * 10 ; // Basic wobble animation
    y += sin(i * frequencyTop) * amplitudeTop; // Apply sine wave distortion based on mouse position

    push();
    translate(x, y);
    rotate(angle + sin(i * frequencyTop) * amplitudeTop * 0.01); // Rotate characters slightly

    text(topText.charAt(i), 0, 0);
    pop();
  }
  pop(); // Restore original drawing state

  // Draw the bottom text
  push(); // Save current drawing state
  translate(width / 2, height * 3/4); // Center the text vertically in the bottom half

  for (let i = 0; i < bottomText.length; i++) {
    let angle = map(i, 0, bottomText.length, -PI / 2, PI / 2); // Distribute characters along an arc
    let x = i * 15 - (bottomText.length * 15) / 2; // Center the text horizontally
    let y = sin(angle * 5 + frameCount * 0.05) * 10; // Basic wobble animation
    y += sin(i * frequencyBottom) * amplitudeBottom; // Apply sine wave distortion based on mouse position

    push();
    translate(x, y);
    rotate(angle + sin(i * frequencyBottom) * amplitudeBottom * 0.01); // Rotate characters slightly

    text(bottomText.charAt(i), 0, 0);
    pop();
  }
  pop(); // Restore original drawing state

}