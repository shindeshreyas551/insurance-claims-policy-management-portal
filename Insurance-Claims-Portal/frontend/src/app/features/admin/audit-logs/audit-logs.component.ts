import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-titles">
          <h1>System Audit Trail & Compliance Log</h1>
          <p>Chronological security and operational audit trail recorded automatically by backend transactions.</p>
        </div>
      </div>

      @if (isLoading) {
        <div class="spinner-container">
          <div class="spinner"></div>
          <p>Retrieving immutable audit logs...</p>
        </div>
      } @else {
        <div class="table-responsive app-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Action Code</th>
                <th>Target Entity</th>
                <th>Entity ID</th>
                <th>Transaction Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs; track log.id) {
                <tr>
                  <td class="text-nowrap">{{ log.createdAt | date:'medium' }}</td>
                  <td>
                    <strong>{{ log.user?.name || 'System Auto' }}</strong>
                    <div class="text-muted text-small">{{ log.user?.role || 'SYSTEM' }}</div>
                  </td>
                  <td><code>{{ log.action }}</code></td>
                  <td><span class="badge">{{ log.entity }}</span></td>
                  <td><code class="text-small">{{ log.entityId ? (log.entityId | slice:0:8) + '...' : '—' }}</code></td>
                  <td>{{ log.details || '—' }}</td>
                  <td><span class="text-muted">{{ log.ipAddress || '127.0.0.1' }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .text-nowrap { white-space: nowrap; }
    .text-small { font-size: 0.75rem; }
    .badge {
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
  `],
})
export class AuditLogsComponent implements OnInit {
  private userService = inject(UserService);

  logs: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.userService.getAuditLogs().subscribe({
      next: (res) => {
        this.logs = res.logs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}

