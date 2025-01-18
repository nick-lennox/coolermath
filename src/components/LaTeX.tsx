import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { formatLatex } from '../lib/latex/format';

interface LaTeXProps {
  math: string;
  block?: boolean;
}

export function LaTeX({ math, block = false }: LaTeXProps) {
  // Format the LaTeX content
  const formattedMath = formatLatex(math);
  
  // If the math starts with \begin or contains newlines, force block mode
  const shouldBeBlock = block || 
    formattedMath.startsWith('\\begin') || 
    formattedMath.includes('\\newline');

  try {
    return shouldBeBlock ? (
      <BlockMath math={formattedMath} />
    ) : (
      <InlineMath math={formattedMath} />
    );
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return <span className="text-red-500">Error rendering LaTeX</span>;
  }
}