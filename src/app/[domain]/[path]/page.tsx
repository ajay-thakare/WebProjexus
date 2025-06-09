import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    domain: string;
    path: string;
  }>;
};

// to access path
const page = async ({ params }: Props) => {
  const { domain, path } = await params;

  const domainData = await getDomainContent(domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === path
  );
  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default page;
