"use client";

import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    classes?: string;
    maxWidth?: string;
    type?: "large" | "small";
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    classes,
    maxWidth = "sm:max-w-[660px]",
    type = "large",
}) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative !z-[1112]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-800"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className={cn(
                            "fixed inset-0 transition-opacity",
                            type === "large"
                                ? "bg-[rgba(0,0,0,0.4)]"
                                : "bg-[rgba(0,0,0,0.4)]"
                        )}
                    />
                </Transition.Child>

                <div
                    className={`modal-p-wrap fixed inset-0 z-10 flex w-screen justify-center`}
                >
                    <div
                        className={cn(
                            "flex h-full min-h-full items-center text-center",
                            type === "small" ? "flex-col justify-end px-0" : ""
                        )}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-800"
                            enterFrom="opacity-0 translate-y-10 sm:translate-y-4 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-10 sm:translate-y-4 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={cn(
                                    "com-m-parent relative mx-2.5 w-full transform overflow-hidden p-0 text-left shadow-[0px_15px_32px_rgba(0,0,0,0.1),0px_58px_58px_rgba(0,0,0,0.09),0px_131px_78px_rgba(0,0,0,0.05),0px_233px_93px_rgba(0,0,0,0.01),0px_363px_102px_transparent] transition-all sm:w-full",
                                    maxWidth,
                                    classes ?? "bg-white",
                                    type === "small"
                                        ? "rounded-t-4xl"
                                        : "rounded-4xl"
                                )}
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default Modal;
