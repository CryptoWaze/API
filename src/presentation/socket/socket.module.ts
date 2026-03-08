import { Module } from '@nestjs/common';
import { FLOW_TRACE_PROGRESS_EMITTER } from '../../application/ports/flow-trace-progress-emitter.port';
import { FlowTraceProgressEmitterService } from './flow-trace-progress-emitter.service';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [
    SocketGateway,
    {
      provide: FLOW_TRACE_PROGRESS_EMITTER,
      useClass: FlowTraceProgressEmitterService,
    },
  ],
  exports: [SocketGateway, FLOW_TRACE_PROGRESS_EMITTER],
})
export class SocketModule {}
