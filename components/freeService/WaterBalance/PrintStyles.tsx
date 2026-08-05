'use client';

import React from 'react';

export default function PrintStyles() {
    return (
        <style>{`
      @media print {
        @page { size: A4 portrait; margin: 15mm; }
        html, body { 
          background: #ffffff !important; 
          color: #000000 !important; 
          font-family: "Times New Roman", Times, serif !important;
        }
      }
    `}</style>
    );
}
