"use client";
import {
  deleteSubAccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter();

  const handleDeleteSubAccount = async () => {
    const response = await getSubaccountDetails(subaccountId);

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a subaccount | ${response?.name}`,
      subaccountId,
    });

    const res = await deleteSubAccount(subaccountId);
    if (!res) {
      toast.error("Failed to delete sub-account. Please try again.");
    } else {
      toast.success("Sub-account deleted successfully.");
      router.refresh();
    }
  };

  return (
    <div className="text-white" onClick={handleDeleteSubAccount}>
      Delete Sub Account
    </div>
  );
};

export default DeleteButton;
