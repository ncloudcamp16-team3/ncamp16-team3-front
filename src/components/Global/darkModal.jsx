import React, { useEffect } from "react";
import { Modal } from "@mui/material";

const DarkModal = ({
    open,
    onClose,
    children,
    backdropProps = {},
    modalProps = {},
    overlayBrightness = 0.5,
}) => {
    useEffect(() => {
        if (!open) return;

        const styleElement = document.createElement("style");
        styleElement.setAttribute("id", "modal-overlay-styles");

        styleElement.textContent = `
      .header, .footer {
        pointer-events: none !important;
        filter: brightness(${overlayBrightness});
        transition: opacity 0.3s ease, filter 0.3s ease;
      }
    `;

        document.head.appendChild(styleElement);

        return () => {
            const existingStyle = document.getElementById("modal-overlay-styles");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, [open, overlayBrightness]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock={true}
            BackdropProps={{
                style: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    ...backdropProps?.style,
                },
                ...backdropProps,
            }}
            {...modalProps}
        >
            {children}
        </Modal>
    );
};

export default DarkModal;
