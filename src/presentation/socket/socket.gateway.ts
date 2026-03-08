import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ping')
  handlePing(): { event: string; data: string } {
    return { event: 'pong', data: 'pong' };
  }

  @SubscribeMessage('subscribe-flow-trace')
  handleSubscribeFlowTrace(
    @MessageBody() body: { traceId?: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const traceId = body?.traceId;
    if (traceId && typeof traceId === 'string') {
      void client.join(traceId);
    }
  }

  emit(event: string, data: unknown): void {
    this.server.emit(event, data);
  }
  emitToRoom(room: string, event: string, data: unknown): void {
    this.server.to(room).emit(event, data);
  }
}
