import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="nf-card app-card">
        <div class="nf-icon">
          <span class="material-icons">sentiment_very_dissatisfied</span>
        </div>
        <h1>404 — Page Not Found</h1>
        <p>The insurance resource or portal route you requested could not be located on the server.</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn btn-primary">
            <span class="material-icons">home</span> Return to Home
          </a>
          <a routerLink="/policies" class="btn btn-secondary">
            <span class="material-icons">explore</span> Browse Policies
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .nf-card {
      max-width: 500px;
      text-align: center;
      padding: 3rem 2rem;
    }
    .nf-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #fef2f2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      .material-icons { font-size: 40px; }
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary-navy);
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    .nf-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  `],
})
export class NotFoundComponent {}

