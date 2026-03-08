import { Injectable } from '@nestjs/common';
import type {
  IFlowTraceProgressEmitter,
  FlowTraceProgressPayload,
} from '../../application/ports/flow-trace-progress-emitter.port';
import { SocketGateway } from './socket.gateway';

const FLOW_TRACE_PROGRESS_EVENT = 'flow-trace-progress';

@Injectable()
export class FlowTraceProgressEmitterService implements IFlowTraceProgressEmitter {
  constructor(private readonly gateway: SocketGateway) {}

  emit(traceId: string, payload: FlowTraceProgressPayload): void {
    this.gateway.emitToRoom(traceId, FLOW_TRACE_PROGRESS_EVENT, payload);
  }
}
