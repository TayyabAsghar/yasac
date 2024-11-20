// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { DialogFooter } from "@/components/ui/dialog";
// import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

// type props = {
//     open: boolean;
// };

// const LinkDialog = ({ open }: props) => {
//     return (
//         <div className="absolute" >
//             <Dialog open={open}>
//                 <DialogContent className="sm:max-w-[425px]" aria-describedby="kk" >
//                     <DialogTitle className="hidden" > Set or Update Links </DialogTitle>
//                     < DialogDescription className="hidden" >
//                         Set or Update links for post.
//                     </DialogDescription>
//                     < div className="py-4" >
//                         <Input id="link" className="text-blue" defaultValue="Pedro Duarte" />
//                     </div>
//                     < DialogFooter >
//                         <Button type="submit" > Save changes </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog >
//         </div >
//     );
// };

// export default LinkDialog;

'use client';

import { createContext, useContext } from 'react';
import type { DialogContextType } from '../types/hooks';

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
    const dialog = useContext(DialogContext);
    if (!dialog) throw new Error('useDialog must be used with a DialogProvider');
    return dialog;
};

export default useDialog;
