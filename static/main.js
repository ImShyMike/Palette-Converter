const canvas = document.getElementById('imageCanvas');
const upload = document.getElementById('upload');
const downloadBtn = document.getElementById('downloadBtn');
const ditherToggle = document.getElementById('ditherToggle');
const paletteSelect = document.getElementById('paletteSelect');
const multiplierToggle = document.getElementById('multiplierToggle');
const autoRedraw = document.getElementById('autoRedraw');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const fullSizeImage = document.getElementById('fullSizeImage');

const ctx = canvas.getContext('2d');

let originalImage; // To store the original image
let filteredImageData; // To store the filtered image data

const canvasWidth = 500;
const canvasHeight = 500;

// Color palettes
const palettes = {
  "CatLatte": [
    [220, 224, 231], // Mantle
    [235, 239, 245], // Base
    [240, 245, 252], // Surface
    [250, 253, 255], // Overlay
    [45, 50, 60],    // Text
    [60, 65, 75],    // Subtext0
    [75, 80, 90],    // Subtext1
    [90, 95, 110],   // Subtext2
    [220, 50, 50],   // Red
    [235, 80, 85],   // Pink
    [250, 110, 200], // Mauve
    [190, 100, 240], // Purple
    [70, 180, 85],   // Green
    [50, 160, 150],  // Teal
    [70, 200, 220],  // Sky
    [40, 120, 230],  // Blue
    [250, 150, 80],  // Peach
    [240, 190, 100], // Yellow
    [255, 255, 255]  // White
  ],
  "CatFrappe": [
    [48, 52, 70],   // Mantle
    [41, 44, 60],   // Base
    [65, 69, 89],   // Surface
    [98, 104, 128], // Overlay
    [198, 208, 245],// Text
    [181, 191, 226],// Subtext0
    [165, 173, 206],// Subtext1
    [147, 153, 178],// Subtext2
    [231, 130, 132],// Red
    [234, 153, 156],// Pink
    [244, 184, 228],// Mauve
    [202, 158, 230],// Purple
    [166, 209, 137],// Green
    [129, 200, 190],// Teal
    [153, 209, 219],// Sky
    [140, 170, 238],// Blue
    [245, 169, 127],// Peach
    [229, 200, 144],// Yellow
    [229, 233, 240] // White
  ],
  "CatMacchiato": [
    [30, 32, 48],   // Mantle
    [25, 27, 40],   // Base
    [40, 42, 59],   // Surface
    [70, 72, 98],   // Overlay
    [200, 210, 255],// Text
    [180, 190, 230],// Subtext0
    [160, 170, 210],// Subtext1
    [140, 150, 190],// Subtext2
    [240, 120, 130],// Red
    [245, 135, 140],// Pink
    [235, 165, 210],// Mauve
    [190, 135, 230],// Purple
    [140, 200, 110],// Green
    [100, 180, 170],// Teal
    [120, 190, 200],// Sky
    [110, 150, 230],// Blue
    [250, 150, 100],// Peach
    [230, 200, 130],// Yellow
    [230, 235, 250] // White
  ],
  "CatMocha": [
    [20, 22, 30],   // Mantle
    [15, 17, 25],   // Base
    [30, 32, 50],   // Surface
    [60, 62, 85],   // Overlay
    [220, 230, 250],// Text
    [200, 210, 240],// Subtext0
    [170, 180, 220],// Subtext1
    [150, 160, 190],// Subtext2
    [250, 100, 100],// Red
    [245, 120, 130],// Pink
    [230, 150, 200],// Mauve
    [200, 120, 230],// Purple
    [120, 190, 110],// Green
    [90, 170, 160], // Teal
    [110, 180, 190],// Sky
    [100, 130, 220],// Blue
    [240, 140, 90], // Peach
    [220, 190, 120],// Yellow
    [220, 230, 240] // White
  ],
  "Solarized": [
    [0, 43, 54],    // Base03
    [7, 54, 66],    // Base02
    [88, 110, 117], // Base01
    [101, 123, 131],// Base00
    [131, 148, 150],// Base0
    [147, 161, 161],// Base1
    [238, 232, 213],// Base2
    [253, 246, 227],// Base3
    [220, 50, 47],  // Red
    [211, 54, 130], // Magenta
    [108, 113, 196],// Violet
    [38, 139, 210], // Blue
    [42, 161, 152], // Cyan
    [133, 153, 0],  // Green
    [181, 137, 0],  // Yellow
    [203, 75, 22]   // Orange
  ],
  "Dracula": [
    [40, 42, 54],   // Background
    [68, 71, 90],   // Current Line
    [248, 248, 242],// Foreground
    [189, 147, 249],// Purple
    [255, 121, 198],// Pink
    [139, 233, 253],// Cyan
    [80, 250, 123], // Green
    [241, 250, 140],// Yellow
    [255, 184, 108],// Orange
    [255, 85, 85]   // Red
  ],
  "Nord": [
    [46, 52, 64],   // Polar Night 0
    [59, 66, 82],   // Polar Night 1
    [67, 76, 94],   // Polar Night 2
    [76, 86, 106],  // Polar Night 3
    [216, 222, 233],// Snow Storm 0
    [229, 233, 240],// Snow Storm 1
    [236, 239, 244],// Snow Storm 2
    [191, 97, 106], // Aurora Red
    [208, 135, 112],// Aurora Orange
    [235, 203, 139],// Aurora Yellow
    [163, 190, 140],// Aurora Green
    [180, 142, 173],// Aurora Purple
    [136, 192, 208] // Aurora Blue
  ],
  "Gruvbox": [
    [29, 32, 33],   // Dark0
    [40, 40, 40],   // Dark1
    [60, 56, 54],   // Dark2
    [213, 196, 161],// Light0
    [239, 229, 190],// Light1
    [250, 245, 219],// Light2
    [251, 73, 52],  // Red
    [235, 59, 149], // Pink
    [211, 134, 155],// Purple
    [108, 113, 196],// Blue
    [184, 187, 38], // Green
    [152, 151, 26], // Yellow
    [214, 93, 14],  // Orange
    [189, 97, 26]   // Brown
  ],
  "GruvboxLight": [
    [251, 241, 199],// Light0 Hard
    [235, 219, 178],// Light0 Soft
    [213, 196, 161],// Light1
    [146, 131, 116],// Light2
    [102, 92, 84],  // Light3
    [214, 93, 14],  // Orange
    [251, 73, 52],  // Red
    [215, 153, 33], // Yellow
    [184, 187, 38], // Green
    [69, 133, 136], // Aqua
    [129, 161, 193],// Blue
    [177, 98, 134]  // Purple
  ],
  "Monokai": [
    [39, 40, 34],   // Background
    [73, 72, 62],   // Foreground
    [249, 38, 114], // Red
    [174, 129, 255],// Pink
    [102, 217, 239],// Cyan
    [166, 226, 46], // Green
    [253, 151, 31], // Orange
    [230, 219, 116],// Yellow
    [253, 95, 241], // Magenta
    [166, 176, 244] // Blue
  ],
  "RGB": [
    [0, 0, 0],      // Black
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green
    [0, 0, 255],    // Blue
    [255, 255, 0],  // Yellow
    [255, 0, 255],  // Magenta
    [0, 255, 255],  // Cyan
    [255, 255, 255] // White
  ],
  "RGBv2": [
    [0, 0, 0],      // Black
    [128, 0, 0],    // Red 2
    [255, 0, 0],    // Red
    [0, 128, 0],    // Green 2
    [0, 255, 0],    // Green
    [0, 0, 128],    // Blue 2
    [0, 0, 255],    // Blue
    [128, 128, 0],  // Yellow 2
    [255, 255, 0],  // Yellow
    [128, 0, 128],  // Magenta 2
    [255, 0, 255],  // Magenta
    [0, 255, 255],  // Cyan
    [0, 128, 128],  // Cyan 2
    [255, 255, 255] // White
  ]
};

paletteSelect.addEventListener('change', () => {
  if (autoRedraw.checked) {
    applyFilter();
  }
});

multiplierToggle.addEventListener('change', () => {
  if (autoRedraw.checked) {
    applyFilter();
  }
});

ditherToggle.addEventListener('change', () => {
  if (autoRedraw.checked) {
    applyFilter();
  }
});

upload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      originalImage = img; // Store the original image
      if (autoRedraw.checked) {
        applyFilter(); // Apply filter automatically
      } else {
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = originalImage.width; // Use original width
        fullCanvas.height = originalImage.height; // Use original height
        const fullCtx = fullCanvas.getContext('2d');

        // Draw the original image on the full canvas
        fullCtx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);

        // Draw the cropped version on the main canvas
        cropAndDisplay(fullCanvas);
      }
    };
    img.src = URL.createObjectURL(file);
  }
});

applyFilterBtn.addEventListener('click', () => {
  applyFilter();
});

// Function to download the filtered image
downloadBtn.addEventListener('click', () => {
  // Create a download link for the filtered image
  const link = document.createElement('a');
  link.href = filteredImageData; // Use the filtered image data
  link.download = 'converted_image.png'; // Set the download filename
  document.body.appendChild(link);
  link.click(); // Trigger the download
  document.body.removeChild(link); // Clean up
});

// Update the applyFilter function to store the filtered image data
function applyFilter() {
  if (!originalImage) {
    return;
  }

  // Create a new canvas to render the full image
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = originalImage.width; // Use original width
  fullCanvas.height = originalImage.height; // Use original height
  const fullCtx = fullCanvas.getContext('2d');

  // Draw the original image on the full canvas
  fullCtx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);

  const imageData = fullCtx.getImageData(0, 0, fullCanvas.width, fullCanvas.height);
  const data = imageData.data;

  for (let y = 0; y < fullCanvas.height; y++) {
    for (let x = 0; x < fullCanvas.width; x++) {
      const index = (y * fullCanvas.width + x) * 4;
      const oldR = data[index];     // Red channel
      const oldG = data[index + 1]; // Green channel
      const oldB = data[index + 2]; // Blue channel

      // Get the closest color from the palette
      const multipliers = multiplierToggle.checked ? [0.3, 0.59, 0.11] : [1, 1, 1];
      const [newR, newG, newB] = getClosestColor(multipliers, oldR, oldG, oldB);

      // Set new pixel values
      data[index] = newR;
      data[index + 1] = newG;
      data[index + 2] = newB;

      if (ditherToggle.checked) {
        // Calculate the error for each channel
        const errorR = oldR - newR;
        const errorG = oldG - newG;
        const errorB = oldB - newB;

        // Distribute the error to neighboring pixels using Floyd-Steinberg
        if (x + 1 < fullCanvas.width) {
          const neighborIndex = (y * fullCanvas.width + (x + 1)) * 4;
          data[neighborIndex] += (errorR * 7) / 16;     // Right
          data[neighborIndex + 1] += (errorG * 7) / 16; // Right
          data[neighborIndex + 2] += (errorB * 7) / 16; // Right
        }
        if (x - 1 >= 0 && y + 1 < fullCanvas.height) {
          const neighborIndex = ((y + 1) * fullCanvas.width + (x - 1)) * 4;
          data[neighborIndex] += (errorR * 3) / 16;     // Bottom left
          data[neighborIndex + 1] += (errorG * 3) / 16; // Bottom left
          data[neighborIndex + 2] += (errorB * 3) / 16; // Bottom left
        }
        if (y + 1 < fullCanvas.height) {
          const neighborIndex = ((y + 1) * fullCanvas.width + x) * 4;
          data[neighborIndex] += (errorR * 5) / 16;     // Bottom
          data[neighborIndex + 1] += (errorG * 5) / 16; // Bottom
          data[neighborIndex + 2] += (errorB * 5) / 16; // Bottom
        }
        if (x + 1 < fullCanvas.width && y + 1 < fullCanvas.height) {
          const neighborIndex = ((y + 1) * fullCanvas.width + (x + 1)) * 4;
          data[neighborIndex] += (errorR * 1) / 16;     // Bottom right
          data[neighborIndex + 1] += (errorG * 1) / 16; // Bottom right
          data[neighborIndex + 2] += (errorB * 1) / 16; // Bottom right
        }
      }
    }
  }

  fullCtx.putImageData(imageData, 0, 0);

  // Draw the cropped version on the main canvas
  cropAndDisplay(fullCanvas);
}

function cropAndDisplay(canvas) {
  // Store the filtered image data before cropping
  filteredImageData = canvas.toDataURL('image/png');

  // Now draw the cropped version on the main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Maintain aspect ratio while drawing the image
  const aspectRatio = originalImage.width / originalImage.height; // Calculate aspect ratio
  let newWidth = canvasWidth;
  let newHeight = canvasHeight;

  // Adjust dimensions to maintain aspect ratio
  if (canvasWidth / aspectRatio <= canvasHeight) {
    newHeight = canvasWidth / aspectRatio; // Adjust height based on width
  } else {
    newWidth = canvasHeight * aspectRatio; // Adjust width based on height
  }

  // Calculate offsets to center the image
  const offsetX = (canvasWidth - newWidth) / 2; // Calculate horizontal offset
  const offsetY = (canvasHeight - newHeight) / 2; // Calculate vertical offset

  ctx.drawImage(canvas, 0, 0, originalImage.width, originalImage.height, offsetX, offsetY, newWidth, newHeight); // Resize and draw the image
}

function getClosestColor(multipliers, r, g, b) {
  let closestColor = [0, 0, 0];
  let minDistance = Infinity;

  const selectedPalette = palettes[paletteSelect.value];
  selectedPalette.forEach(color => {
    const [r2, g2, b2] = color;
    const newDistance = Math.sqrt((((r2 - r) * multipliers[0]) ** 2 + ((g2 - g) * multipliers[1]) ** 2 + ((b2 - b) * multipliers[2]) ** 2));
    if (newDistance < minDistance) {
      closestColor = color;
      minDistance = newDistance;
    }
  });

  return closestColor;
}

canvas.addEventListener('click', () => {
  if (filteredImageData) {
    const modal = document.getElementById("imageModal");
    const fullSizeImage = document.getElementById("fullSizeImage");
    
    fullSizeImage.src = filteredImageData; // Use the filtered image data for preview
    modal.style.display = "block"; // Show the modal
  }
});

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // Prevent the default context menu from appearing

  if (filteredImageData) {
    window.open(filteredImageData, '_blank').focus();
  }
});

const closeModal = document.getElementsByClassName("close")[0];
closeModal.onclick = function() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none"; // Hide the modal
};

window.onclick = function(event) {
  const modal = document.getElementById("imageModal");
  if (event.target == modal) {
    modal.style.display = "none"; // Hide the modal if clicked outside
  }
};

fullSizeImage.addEventListener('click', () => {
  window.open(filteredImageData, '_blank').focus();
});
