import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import React from "react";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const MediaPage = async ({ params }: Props) => {
  const { subaccountId } = await params;
  const data = await getMedia(subaccountId);

  return <MediaComponent data={data} subaccountId={subaccountId} />;
};

export default MediaPage;
