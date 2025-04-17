/**
 * Utility to extract dominant colors from an image
 */

export const extractColors = (imageUrl: string, colorCount: number = 5): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Enable CORS for the image
    img.src = imageUrl;
    
    img.onload = () => {
      // Create canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Process colors
      const colorMap: Record<string, number> = {};
      const step = Math.max(1, Math.floor(imageData.length / 4 / 10000)); // Sample at most 10000 pixels
      
      // Sample pixels and count color occurrences
      for (let i = 0; i < imageData.length; i += 4 * step) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Quantize colors to reduce the number of unique colors
        const quantizedR = Math.round(r / 16) * 16;
        const quantizedG = Math.round(g / 16) * 16;
        const quantizedB = Math.round(b / 16) * 16;
        
        const colorKey = `rgb(${quantizedR},${quantizedG},${quantizedB})`;
        colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
      }
      
      // Sort colors by frequency
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .slice(0, colorCount);
      
      resolve(sortedColors);
    };
    
    img.onerror = () => {
      // Return empty array if image fails to load
      resolve([]);
    };
  });
};