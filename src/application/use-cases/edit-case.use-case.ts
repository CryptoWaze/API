import { Injectable } from '@nestjs/common';
import type { EditCaseInput } from '../schemas/edit-case.schema';
import { UpdateCaseUseCase } from './update-case.use-case';
import { UpdateFlowWalletUseCase } from './update-flow-wallet.use-case';
import { SoftDeleteFlowUseCase } from './soft-delete-flow.use-case';
import { SoftDeleteFlowTransactionUseCase } from './soft-delete-flow-transaction.use-case';

type EditCaseResult = {
  caseId: string;
  updatedName?: string;
  updatedWalletIds: string[];
  deletedFlowIds: string[];
  deletedTransactionIds: string[];
};

@Injectable()
export class EditCaseUseCase {
  constructor(
    private readonly updateCaseUseCase: UpdateCaseUseCase,
    private readonly updateFlowWalletUseCase: UpdateFlowWalletUseCase,
    private readonly softDeleteFlowUseCase: SoftDeleteFlowUseCase,
    private readonly softDeleteFlowTransactionUseCase: SoftDeleteFlowTransactionUseCase,
  ) {}

  async execute(
    caseId: string,
    userId: string,
    input: EditCaseInput,
  ): Promise<EditCaseResult> {
    const updatedWalletIds: string[] = [];
    const deletedFlowIds: string[] = [];
    const deletedTransactionIds: string[] = [];

    let updatedName: string | undefined;
    if (input.name !== undefined) {
      const updated = await this.updateCaseUseCase.execute(caseId, userId, {
        name: input.name,
      });
      updatedName = updated.name;
    }

    if (input.wallets && input.wallets.length > 0) {
      for (const w of input.wallets) {
        await this.updateFlowWalletUseCase.execute(
          caseId,
          w.walletId,
          userId,
          {
            nickname: w.nickname,
            position: w.position,
          },
        );
        updatedWalletIds.push(w.walletId);
      }
    }

    if (input.softDeleteFlows && input.softDeleteFlows.length > 0) {
      for (const f of input.softDeleteFlows) {
        const res = await this.softDeleteFlowUseCase.execute(
          caseId,
          f.flowId,
          userId,
        );
        deletedFlowIds.push(res.id);
      }
    }

    if (
      input.softDeleteTransactions &&
      input.softDeleteTransactions.length > 0
    ) {
      for (const t of input.softDeleteTransactions) {
        const res = await this.softDeleteFlowTransactionUseCase.execute(
          caseId,
          t.flowId,
          t.transactionId,
          userId,
        );
        deletedTransactionIds.push(res.id);
      }
    }

    return {
      caseId,
      updatedName,
      updatedWalletIds,
      deletedFlowIds,
      deletedTransactionIds,
    };
  }
}

