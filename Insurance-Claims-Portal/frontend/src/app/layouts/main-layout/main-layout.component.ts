import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>
      <div class="layout-body">
        @if (authService.isAuthenticated()) {
          <app-sidebar [isOpen]="sidebarOpen"></app-sidebar>
        }
        <main class="layout-content" [class.no-sidebar]="!authService.isAuthenticated()">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .layout-body {
      display: flex;
      flex: 1;
      position: relative;
    }
    .layout-content {
      flex: 1;
      min-width: 0;
      background: var(--bg-app);
      overflow-y: auto;
      max-height: calc(100vh - 64px);

      &.no-sidebar {
        width: 100%;
      }
    }
  `],
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

