// Simple round-robin load balancer for future scaling
class LoadBalancer {
  private static instance: LoadBalancer;
  private currentIndex: number = 0;
  private readonly servers: string[] = [
    'server1',
    'server2',
    'server3'
  ];

  private constructor() {}

  static getInstance(): LoadBalancer {
    if (!LoadBalancer.instance) {
      LoadBalancer.instance = new LoadBalancer();
    }
    return LoadBalancer.instance;
  }

  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }

  addServer(server: string) {
    if (!this.servers.includes(server)) {
      this.servers.push(server);
    }
  }

  removeServer(server: string) {
    const index = this.servers.indexOf(server);
    if (index > -1) {
      this.servers.splice(index, 1);
    }
  }
}

export const loadBalancer = LoadBalancer.getInstance();