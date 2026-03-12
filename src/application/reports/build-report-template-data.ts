import type { GetCaseByIdResult } from '../use-cases/get-case-by-id.use-case';
import { addressExplorerUrl, txExplorerUrl } from './explorer-links';
import type {
  ReportFlowDto,
  ReportFlowStepDto,
  ReportSeedDto,
  ReportTemplateData,
} from './report-template.types';

const IMAGE_PLACEHOLDER = '[ --imagem-- ]';

export function buildReportTemplateData(
  caseData: GetCaseByIdResult,
  generatedAt: string,
): ReportTemplateData {
  const seeds: ReportSeedDto[] = caseData.seeds.map((s) => ({
    txHash: s.txHash,
    chainSlug: s.chainSlug,
    chainName: s.chainName,
    tokenSymbol: s.tokenSymbol,
    amountDecimal: s.amountDecimal,
    timestamp: s.timestamp,
    txExplorerUrl: txExplorerUrl(s.chainSlug, s.txHash),
    initialWalletAddresses: s.initialWalletAddresses ?? [],
  }));

  const flows: ReportFlowDto[] = caseData.flows.map((f) => {
    const steps: ReportFlowStepDto[] = f.transactions.map((t) => ({
      fromAddress: t.fromAddress,
      toAddress: t.toAddress,
      tokenSymbol: t.tokenSymbol,
      amountDecimal: t.amountDecimal,
      txHash: t.txHash,
      timestamp: t.timestamp,
      txExplorerUrl: t.txHash
        ? txExplorerUrl(f.chainSlug, t.txHash)
        : null,
      fromExplorerUrl: addressExplorerUrl(f.chainSlug, t.fromAddress),
      toExplorerUrl: addressExplorerUrl(f.chainSlug, t.toAddress),
    }));
    const endpointLabel = f.endpointHotWalletLabel ?? 'Endereço final';
    return {
      chainSlug: f.chainSlug,
      chainName: f.chainName,
      initialWalletAddress: f.initialWalletAddress,
      endpointAddress: f.endpointAddress,
      endpointExchangeName: f.endpointExchangeName,
      endpointLabel,
      steps,
    };
  });

  return {
    caseName: caseData.name,
    generatedAt,
    totalAmountLostDecimal: caseData.totalAmountLostDecimal,
    seeds,
    flows,
    imagePlaceholder: IMAGE_PLACEHOLDER,
  };
}
