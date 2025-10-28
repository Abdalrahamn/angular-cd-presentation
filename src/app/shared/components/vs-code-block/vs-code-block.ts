import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CodeExample {
  language: string;
  title?: string;
  code: string;
  explanation?: string;
}

@Component({
  selector: 'app-vs-code-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vs-code-container">
      <!-- VS Code Header -->
      <div class="vs-code-header">
        <div class="window-controls">
          <div class="control close"></div>
          <div class="control minimize"></div>
          <div class="control maximize"></div>
        </div>
        <div class="tab">
          <div class="tab-icon">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path fill="#007ACC" d="M1.5 1.5v13h13v-13h-13zm12 12h-11v-11h11v11z" />
              <path fill="#007ACC" d="M3 3h8v1H3zm0 2h8v1H3zm0 2h5v1H3z" />
            </svg>
          </div>
          <span class="tab-name">{{ getFileName() }}</span>
          <div class="tab-close">×</div>
        </div>
      </div>

      <!-- VS Code Editor -->
      <div class="vs-code-editor">
        <div class="line-numbers">
          @for (line of getLineNumbers(); track $index) {
          <div class="line-number">{{ line }}</div>
          }
        </div>

        <div class="code-content">
          <pre><code [innerHTML]="getHighlightedCode()"></code></pre>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="vs-code-status">
        <div class="status-left">
          <span class="status-item">{{ codeExample().language }}</span>
          <span class="status-item">UTF-8</span>
          <span class="status-item">LF</span>
        </div>
        <div class="status-right">
          <span class="status-item">Ln {{ getLineNumbers().length }}, Col 1</span>
          <span class="status-item">Spaces: 2</span>
        </div>
      </div>

      <!-- Explanation -->
      @if (codeExample().explanation) {
      <div class="code-explanation">
        <div class="explanation-icon">💡</div>
        <p>{{ codeExample().explanation }}</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .vs-code-container {
        background: #1e1e1e;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        margin: 1.5rem 0;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      }

      /* VS Code Header */
      .vs-code-header {
        background: #2d2d30;
        height: 35px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px solid #3e3e42;
      }

      .window-controls {
        display: flex;
        gap: 8px;
        margin-right: 15px;
      }

      .control {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
      }

      .control.close {
        background: #ff5f57;
      }

      .control.minimize {
        background: #ffbd2e;
      }

      .control.maximize {
        background: #28ca42;
      }

      .tab {
        display: flex;
        align-items: center;
        background: #1e1e1e;
        padding: 8px 12px;
        border-radius: 4px 4px 0 0;
        gap: 8px;
        color: #cccccc;
        font-size: 13px;
      }

      .tab-icon svg {
        width: 16px;
        height: 16px;
      }

      .tab-name {
        font-weight: 500;
      }

      .tab-close {
        color: #858585;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
      }

      .tab-close:hover {
        color: #cccccc;
      }

      /* VS Code Editor */
      .vs-code-editor {
        display: flex;
        background: #1e1e1e;
        min-height: 150px;
        max-height: 600px;
        overflow: hidden;
      }

      .line-numbers {
        background: #1e1e1e;
        color: #858585;
        font-size: 14px;
        line-height: 1.5;
        padding: 15px 10px;
        text-align: right;
        user-select: none;
        border-right: 1px solid #3e3e42;
        min-width: 50px;
        overflow: hidden;
      }

      .line-number {
        height: 21px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .code-content {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .code-content pre {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1.5;
        color: #d4d4d4;
      }

      .code-content code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        display: block;
      }

      /* Syntax Highlighting */
      :global(.keyword) {
        color: #569cd6;
        font-weight: bold;
      }

      :global(.string) {
        color: #ce9178;
      }

      :global(.comment) {
        color: #6a9955;
        font-style: italic;
      }

      :global(.function) {
        color: #dcdcaa;
      }

      :global(.property) {
        color: #9cdcfe;
      }

      :global(.decorator) {
        color: #4ec9b0;
      }

      :global(.type) {
        color: #4ec9b0;
      }

      :global(.number) {
        color: #b5cea8;
      }

      :global(.operator) {
        color: #d4d4d4;
      }

      :global(.punctuation) {
        color: #d4d4d4;
      }

      :global(.template-string) {
        color: #ce9178;
      }

      :global(.html-tag) {
        color: #569cd6;
      }

      :global(.html-attribute) {
        color: #9cdcfe;
      }

      :global(.html-value) {
        color: #ce9178;
      }

      :global(.angular-method) {
        color: #ffcc02;
        font-weight: bold;
      }

      :global(.boolean) {
        color: #c586c0;
        font-weight: bold;
      }

      /* Status Bar */
      .vs-code-status {
        background: #007acc;
        height: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        font-size: 12px;
        color: white;
      }

      .status-left,
      .status-right {
        display: flex;
        gap: 15px;
      }

      .status-item {
        cursor: pointer;
      }

      .status-item:hover {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 4px;
        border-radius: 2px;
      }

      /* Explanation */
      .code-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        border-top: 1px solid #3e3e42;
      }

      .explanation-icon {
        font-size: 1.2rem;
        margin-top: 0.2rem;
      }

      .code-explanation p {
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      /* Scrollbar Styling - Only for code content */
      .code-content::-webkit-scrollbar {
        width: 14px;
      }

      .code-content::-webkit-scrollbar-track {
        background: #1e1e1e;
      }

      .code-content::-webkit-scrollbar-thumb {
        background: #424242;
        border-radius: 7px;
      }

      .code-content::-webkit-scrollbar-thumb:hover {
        background: #555555;
      }
    `,
  ],
})
export class VsCodeBlockComponent {
  codeExample = input.required<CodeExample>();

  constructor(private sanitizer: DomSanitizer) {}

  getFileName = computed(() => {
    const lang = this.codeExample().language;
    const title = this.codeExample().title;

    if (title) {
      // If we have a title, use it as the filename
      const extensions: Record<string, string> = {
        typescript: '.ts',
        javascript: '.js',
        html: '.html',
        css: '.css',
        scss: '.scss',
        json: '.json',
        bash: '.sh',
        shell: '.sh',
      };
      return title.toLowerCase().replace(/\s+/g, '-') + (extensions[lang] || '.txt');
    }

    // Fallback to generic filename
    const extensions: Record<string, string> = {
      typescript: '.ts',
      javascript: '.js',
      html: '.html',
      css: '.css',
      scss: '.scss',
      json: '.json',
      bash: '.sh',
      shell: '.sh',
    };
    return `example${extensions[lang] || '.txt'}`;
  });

  getLineNumbers = computed(() => {
    const lines = this.codeExample().code.split('\n');
    return Array.from({ length: lines.length }, (_, i) => i + 1);
  });

  getHighlightedCode = computed((): SafeHtml => {
    const code = this.codeExample().code;
    const language = this.codeExample().language;

    const highlightedHtml = this.highlightSyntax(code, language);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedHtml);
  });

  private highlightSyntax(code: string, language: string): string {
    // Return plain code without syntax highlighting
    // Escape HTML to prevent XSS but don't add any highlighting markup
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
