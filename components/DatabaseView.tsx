/// <reference types="react" />
import React, { useState, useMemo } from 'react';
import dbContent from '../DB.md?raw';

const DatabaseView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter content based on search
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return dbContent;

    const lines = dbContent.split('\n');
    const filtered = lines.filter(line =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.join('\n');
  }, [searchQuery]);

  // Convert markdown to basic HTML for rendering
  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - headers, lists, tables
    const lines = content.split('\n');
    let html = '';
    let inTable = false;

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        html += `<h1 class="text-3xl font-bold mt-6 mb-4 text-slate-900">${line.substring(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2 class="text-2xl font-bold mt-5 mb-3 text-slate-800">${line.substring(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3 class="text-xl font-semibold mt-4 mb-2 text-slate-700">${line.substring(4)}</h3>`;
      }
      // Table
      else if (line.startsWith('|')) {
        if (!inTable) {
          html += '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-slate-300">';
          inTable = true;
        }
        const cells = line.split('|').filter(cell => cell.trim());
        const isHeaderSeparator = line.includes('---');

        if (!isHeaderSeparator) {
          const cellType = (index === 0 || (html.includes('</tr>') && lines[index - 1]?.includes('---'))) ? 'th' : 'td';
          const cellClass = cellType === 'th'
            ? 'border border-slate-300 px-4 py-2 bg-slate-100 font-semibold text-left'
            : 'border border-slate-300 px-4 py-2';

          html += '<tr>';
          cells.forEach(cell => {
            html += `<${cellType} class="${cellClass}">${cell.trim()}</${cellType}>`;
          });
          html += '</tr>';
        }
      } else if (inTable && !line.startsWith('|')) {
        html += '</table></div>';
        inTable = false;
        html += `<p class="my-2 text-slate-700">${line}</p>`;
      }
      // Lists
      else if (line.startsWith('- ')) {
        html += `<li class="ml-4 my-1 text-slate-700">${line.substring(2)}</li>`;
      }
      // Bold text
      else if (line.includes('**')) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<p class="my-2 text-slate-700">${formatted}</p>`;
      }
      // Regular text
      else if (line.trim()) {
        html += `<p class="my-2 text-slate-700">${line}</p>`;
      }
      // Empty line
      else {
        html += '<br/>';
      }
    });

    if (inTable) {
      html += '</table></div>';
    }

    return html;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Database Bandi</h1>
              <p className="text-sm text-slate-600">328+ opportunità di finanziamento mappate</p>
            </div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Torna all'app
            </a>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca nel database..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 prose max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(filteredContent) }}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;
