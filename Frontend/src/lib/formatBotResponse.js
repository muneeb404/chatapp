export function formatBotResponse(text) {
    const lines = text.split('\n');
    let formattedHtml = '';
    let inList = false;
    let inSection = false;
  
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('# ')) {
        if (inSection) formattedHtml += '</div>';
        if (inList) {
          formattedHtml += '</ul>';
          inList = false;
        }
        formattedHtml += `<h2 class="text-2xl font-bold mt-6 mb-3">${line.substring(2)}</h2>`;
        formattedHtml += '<div class="pl-4">';
        inSection = true;
      } else if (line.startsWith('## ')) {
        if (inList) {
          formattedHtml += '</ul>';
          inList = false;
        }
        formattedHtml += `<h3 class="text-xl font-semibold mt-4 mb-2">${line.substring(3)}</h3>`;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          formattedHtml += '<ul class="list-disc list-inside mb-3 space-y-1">';
          inList = true;
        }
        formattedHtml += `<li>${formatInlineStyles(line.substring(2))}</li>`;
      } else {
        if (inList) {
          formattedHtml += '</ul>';
          inList = false;
        }
        if (line) {
          formattedHtml += `<p class="mb-3">${formatInlineStyles(line)}</p>`;
        }
      }
    });
  
    if (inList) formattedHtml += '</ul>';
    if (inSection) formattedHtml += '</div>';
  
    return formattedHtml;
  }
  
  function formatInlineStyles(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 rounded px-1">$1</code>');
  }
  