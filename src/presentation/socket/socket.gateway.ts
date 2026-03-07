import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('ping')
  handlePing(@MessageBody() _payload: unknown): {
    event: string;
    data: string;
  } {
    return { event: 'pong', data: 'pong' };
  }
  emit(event: string, data: unknown): void {
    this.server.emit(event, data);
  }
  emitToRoom(room: string, event: string, data: unknown): void {
    this.server.to(room).emit(event, data);
  }
}
