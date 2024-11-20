import { Dispatch, SetStateAction } from "react";

export type DialogProps = {
    dialog: JSX.Element;
};

export type DialogContextType = {
    dialog: DialogProps,
    setDialog: Dispatch<SetStateAction<DialogProps>>;
};