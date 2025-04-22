import '@testing-library/jest-dom';

// Polyfill para Request global (não disponível no Node.js)
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map();
    
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        this.headers.set(key.toLowerCase(), options.headers[key]);
      });
    }
    
    this.body = options.body;
  }
  
  // Mock do método necessário para o Next.js
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
  
  // Mock do getter para headers usado no código
  get(headerName) {
    return this.headers.get(headerName.toLowerCase());
  }
};

// Mock para o console.error e console.log para evitar ruído nos testes
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
};

// Mock para o objeto NextResponse do Next.js
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((data, options) => {
        return {
          data,
          options,
        };
      }),
    },
  };
}); 