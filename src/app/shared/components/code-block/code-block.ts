import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CodeExample } from '../../../models/slide.interface';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlockComponent {
  codeExample = input.required<CodeExample>();

  constructor(private sanitizer: DomSanitizer) {}

  // Computed property for syntax-highlighted code
  highlightedCode = computed((): SafeHtml => {
    const highlightedHtml = this.highlightSyntax(
      this.codeExample().code,
      this.codeExample().language
    );
    return this.sanitizer.bypassSecurityTrustHtml(highlightedHtml);
  });

  copyCode() {
    navigator.clipboard.writeText(this.codeExample().code).then(() => {
      // Could add a toast notification here
      console.log('Code copied to clipboard');
    });
  }

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
