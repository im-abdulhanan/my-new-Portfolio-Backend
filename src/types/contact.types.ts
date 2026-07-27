export interface ContactRequestBody {
  fullName: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  projectDetails?: string;
  details?: string;
  website?: string;
  loadedAt?: number;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  requestId: string;
  timestamp: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  requestId: string;
  timestamp: string;
  errorDetails?: string;
  errors?: Record<string, string[]>;
}

export interface HealthResponse {
  status: string;
  version: string;
  uptime: number;
  nodeVersion: string;
  environment: string;
  timestamp: string;
}
