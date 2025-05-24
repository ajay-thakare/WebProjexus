import { getFunnels } from "@/lib/queries";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import FunnelForm from "@/components/forms/funnel-form";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const Funnels = async ({ params }: Props) => {
  const { subaccountId } = await params;
  const funnels = await getFunnels(subaccountId);
  if (!funnels) return null;

  return (
    <FunnelsDataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Funnel
        </>
      }
      modalChildren={<FunnelForm subAccountId={subaccountId}></FunnelForm>}
      filterValue="name"
      columns={columns}
      data={funnels}
    />
  );
};

export default Funnels;
