import type { ConciergeProposal } from "@/features/concierge/lib/proposals";
import { notify } from "@/lib/notify";
import { useBoxStore } from "@/stores/use-box-store";

export function applyConciergeProposal(proposal: ConciergeProposal) {
  const store = useBoxStore.getState();
  store.setBoxSize(proposal.size);
  proposal.chocolateIds.forEach((chocolateId, index) => {
    store.setSlotChocolate(index, chocolateId);
  });
  store.updateRibbon({
    color: proposal.ribbonColor,
    style: proposal.ribbonStyle,
  });
  notify.success(`Applied “${proposal.title}” to the configurator.`);
}
