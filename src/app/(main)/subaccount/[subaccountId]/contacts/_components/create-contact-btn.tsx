"use client";

import { ContactUserForm } from "@/components/forms/contact-user-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";

type Props = {
  subaccountId: string;
};

const CreateContactBtn = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create New Contact"
        subheading="Add a new contact to your database"
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    );
  };

  return (
    <Button onClick={handleCreateContact} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Create Contact
    </Button>
  );
};

export default CreateContactBtn;
