import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly register: client.Registry;

  // Métriques personnalisées
  public readonly httpRequestsTotal: client.Counter<string>;
  public readonly httpRequestDuration: client.Histogram<string>;
  public readonly activeConnections: client.Gauge<string>;
  public readonly databaseQueries: client.Counter<string>;
  public readonly databaseQueryDuration: client.Histogram<string>;

  constructor() {
    this.register = new client.Registry();

    // Configuration des métriques par défaut (CPU, mémoire, etc.)
    client.collectDefaultMetrics({
      register: this.register,
      prefix: 'conexa_api_',
    });

    // Métriques HTTP
    this.httpRequestsTotal = new client.Counter({
      name: 'conexa_api_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'conexa_api_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.register],
    });

    // Métriques de connexions
    this.activeConnections = new client.Gauge({
      name: 'conexa_api_active_connections',
      help: 'Number of active connections',
      registers: [this.register],
    });

    // Métriques de base de données
    this.databaseQueries = new client.Counter({
      name: 'conexa_api_database_queries_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'table'],
      registers: [this.register],
    });

    this.databaseQueryDuration = new client.Histogram({
      name: 'conexa_api_database_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
      registers: [this.register],
    });
  }

  onModuleInit() {
    console.log('✅ Métriques Prometheus initialisées');
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  getRegister(): client.Registry {
    return this.register;
  }

  // Méthodes utilitaires pour enregistrer des métriques
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      duration,
    );
  }

  recordDatabaseQuery(operation: string, table: string, duration: number) {
    this.databaseQueries.inc({ operation, table });
    this.databaseQueryDuration.observe({ operation, table }, duration);
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }
}
