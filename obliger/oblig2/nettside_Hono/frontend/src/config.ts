export const API_CONFIG = {
    baseUrl: 'http://127.0.0.1:3000',
    endpoints: {
      projects: '/data',
      projectById: (id: number) => `/data/${id}`,
    }
  };