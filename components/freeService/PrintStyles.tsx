'use client';

import React from 'react';

export default function PrintStyles() {
    return (
        <style>{`
      @media print {
        /* Прячем абсолютно всё, кроме специальной выделенной зоны печати */
        body > * {
          display: none !important;
        }
        
        #print-portal-root, #print-portal-root * {
          display: block !important;
        }

        @page { 
          size: A4 portrait; 
          margin: 15mm; 
        }

        html, body { 
          background: #ffffff !important; 
          color: #000000 !important; 
          font-family: "Times New Roman", Times, serif !important;
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
        }
      }
    `}</style>
    );
}
