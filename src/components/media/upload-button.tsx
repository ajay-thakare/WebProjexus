"use client";
import { useModal } from "@/providers/modal-provider";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { setOpen, setClose } = useModal();

  const uploadHandler = useCallback(() => {
    setOpen(
      <CustomModal
        title="Upload Media"
        subheading="Upload a file to your media bucket"
      >
        <UploadMediaForm
          subaccountId={subaccountId}
          onUploadSuccess={setClose}
        />
      </CustomModal>
    );
  }, [subaccountId, setOpen]);

  return <Button onClick={uploadHandler}>Upload</Button>;
};

export default MediaUploadButton;
