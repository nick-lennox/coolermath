export function formatLatex(latex: string): string {
  if (!latex) return '';
  
  // Clean up whitespace
  let formatted = latex.trim();
  
  // Handle align* environments
  if (formatted.includes('\\begin{align*}')) {
    // Ensure proper spacing around alignment points
    formatted = formatted.replace(/&=/g, ' &= ');
    formatted = formatted.replace(/&\\leq/g, ' &\\leq ');
    formatted = formatted.replace(/&\\geq/g, ' &\\geq ');
    
    // Replace double backslashes with newline commands
    formatted = formatted.replace(/\\\\/g, '\\newline');
  }
  
  // Handle matrix environments
  if (formatted.includes('\\begin{matrix}') || 
      formatted.includes('\\begin{pmatrix}') ||
      formatted.includes('\\begin{bmatrix}')) {
    // Ensure proper spacing in matrices
    formatted = formatted.replace(/&/g, ' & ');
  }
  
  // Handle fractions
  formatted = formatted.replace(/\\frac{([^}]*)}{([^}]*)}/g, (_, num, den) => {
    return `\\frac{${num.trim()}}{${den.trim()}}`;
  });
  
  return formatted;
}