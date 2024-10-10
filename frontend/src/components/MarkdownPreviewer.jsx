import { useEffect } from "react";
import hljs from 'highlight.js';
import './MarkdownPreviewer.css'
import voiceIconImg from "../assets/voice.png"

function MarkdownPreviewer({ content, className }) {
  // ------------------------------------------------
  // ------------------- Features -------------------
  // ------------------------------------------------

  /*
  Table (NOT limited to a finite # of columns/rows):
  | Header | Header |
  | ------ | ------ |
  | Data   | Data   |
  | Data   | Data   |

  Bold: **bold**
  Italic: *italic*
  Underline: __underline__

  Code block: 
  ```python
  def main():
    return 0
  ```

  Code snippet: `code`
  Header 1: # Header
  Header 2: ## Header
  Header 3: ### Header
  Page break: ---
  Image Links: ![alt](url)
  Links: [text](url)
  */

  useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  const formatContent = (text) => {

    // -------------------------------------------------
    // ------- Escaping Reserved HTML Characters -------
    // -------------------------------------------------

    const ampersandPattern = /&/g;
    text = text.replace(ampersandPattern, '&amp;');

    const lessThanPattern = /</g;
    text = text.replace(lessThanPattern, '&lt;');

    const greaterThanPattern = />/g;
    text = text.replace(greaterThanPattern, '&gt;');

    // ' and " may be overkill but I put them here just in case
    const singleQuotePattern = /'/g;
    text = text.replace(singleQuotePattern, '&apos;');

    const doubleQuotePattern = /"/g;
    text = text.replace(doubleQuotePattern, '&quot;');

    // -------------------------------------------------
    // --------------- Markdown Patterns ---------------
    // -------------------------------------------------

    const tablePattern = /\|(.+)\|\n\|([\s-:|]+)\|\n((\|.+\|\n)*)/g;
    text = text.replace(tablePattern, (match, headers, separator, rows) => {
      const headersArr = headers.split('|').map(h => h.trim()).filter(Boolean);
      const rowsArr = rows.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));

      const thead = `<thead><tr>${headersArr.map(header => `<th class="border border-eMedGray px-2 py-1">${header}</th>`).join('')}</tr></thead>`;

      const tbody = `<tbody>${rowsArr.map(row => `<tr>${row.map(cell => `<td class="border border-eMedGray px-2 py-1">${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;

      return `<table class="border-collapse w-full">${thead}${tbody}</table>`;
    });

    const boldPattern = /\*\*(.*?)\*\*/g;
    text = text.replace(boldPattern, '<b>$1</b>');

    const italicPattern = /\*(.*?)\*/g;
    text = text.replace(italicPattern, '<i>$1</i>');

    const underlinePattern = /__(.*?)__/g;
    text = text.replace(underlinePattern, '<u>$1</u>');

    const codeBlockPattern = /```([A-Za-z]*\n)((.|\n)*?)```/g;
    text = text.replace(codeBlockPattern, (fullStringMatch, language, innerCodeContent) => {
      language = language.toLowerCase().trim();

      const trimmedCode = innerCodeContent.trim();

      if (language) {
        return `<pre class="p-2 my-1 rounded-md bg-eBlack"><code class="language-${language}">${trimmedCode}</code></pre>`;
      } else {
        return `<pre class="p-2 my-1 rounded-md bg-eBlack">${trimmedCode}</pre>`;
      }
    });

    const codePattern = /`(.*?)`/g;
    text = text.replace(codePattern, '<code class="bg-eBlack px-1 py-0.5 rounded-md">$1</code>');

    const header1Pattern = /^# (.*$)/gim;
    text = text.replace(header1Pattern, '<h1 class="text-[2rem]">$1</h1>');

    const header2Pattern = /^## (.*$)/gim;
    text = text.replace(header2Pattern, '<h2 class="text-[1.5rem]">$1</h2>');

    const header3Pattern = /^### (.*$)/gim;
    text = text.replace(header3Pattern, '<h3 class="text-[1.2rem] font-semibold">$1</h3>');

    const pageBreakPattern = /---/g;
    text = text.replace(pageBreakPattern, '<hr>')

    const imagePattern = /!\[(.*?)\]\((.*?)\)/g;
    text = text.replace(imagePattern, '<img src="$2" alt="$1" class="max-w-60 max-h-60" />');

    const linkPattern = /\[(.*?)\]\((.*?)\)/g;
    text = text.replace(linkPattern, '<a href="$2">$1</a>');

    return text;
  };

  return (
    <>
      <div
        className={`w-full whitespace-pre-wrap break-words ${className}`}
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      ></div>
    </>
  );
}

export default MarkdownPreviewer