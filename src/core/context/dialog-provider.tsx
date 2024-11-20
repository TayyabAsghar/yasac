'use client';

import { ReactNode, useState } from "react";
import { DialogProps } from "../types/hooks";
import { DialogContext } from "../hooks/useDialog";

const DialogProvider = ({ children }: { children: ReactNode; }) => {
    const [dialog, setDialog] = useState<DialogProps>({ dialog: <></> });

    return (
        <DialogContext.Provider value={{ dialog, setDialog }}>
            {children}
        </DialogContext.Provider>
    );
};

export default DialogProvider;