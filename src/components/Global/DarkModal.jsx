import React from "react";
import { Modal, Backdrop } from "@mui/material";

const DarkModal = ({ open, onClose, children, modalProps = {} }) => {
    // open 속성이 명확한 boolean 값인지 확인
    const isOpen = Boolean(open);

    const safeModalProps = modalProps || {};

    // 모달이 닫힐 때 호출할 함수
    const handleClose = onClose || (() => {});

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="dark-modal-title"
            aria-describedby="dark-modal-description"
            closeAfterTransition
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
            {...safeModalProps}
        >
            <div>{children}</div>
        </Modal>
    );
};

export default DarkModal;
