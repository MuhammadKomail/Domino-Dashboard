import React from 'react';
import Modal from 'react-modal';
import { RxCross1 } from "react-icons/rx";
import styles from "../../app/products/products.module.css";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DeleteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        boxShadow: '0 0px 25px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '0',
        width: '500px',
        borderRadius: '8px',
    },
};

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onRequestClose, onConfirm, itemName }) => {

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;


    const truncateWords = (text: string, wordLimit: number = 5): string => {
        const words = text.trim().split(/\s+/);
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + " ...";
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel={t("Delete Confirmation Modal")}
            ariaHideApp={false}
        >
            <div className="relative w-full p-6 flex flex-col gap-6">
                {/* Close Button */}
                <div className={`absolute top-5 flex justify-end ${currentLang === "ar" ? "left-5" : "right-5"}`}>
                    <button
                        onClick={onRequestClose}
                        className="border border-gray-300 rounded-md p-2 text-gray-500 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label={t("Close")}
                    >
                        <RxCross1 size={20} />
                    </button>
                </div>

                {/* Message */}
                <div>
                    <p className="w-[90%] text-lg font-semibold text-black">
                        {t('Are you sure you want to delete')}{" "}
                        <span className="font-bold">{truncateWords(itemName)}</span>?
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-4 mt-2">
                    <Button
                        variant="outline"
                        className="border border-red-500 text-red-600 hover:bg-red-50 font-semibold w-full"
                        onClick={() => {
                            onConfirm();
                            onRequestClose();
                        }}
                        aria-label={t("Delete")}
                    >
                        {t('Delete')} {truncateWords(itemName)}
                    </Button>
                    <Button
                        variant="outline"
                        className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold w-full"
                        onClick={onRequestClose}
                        aria-label={t("Cancel")}
                    >
                        {t('Cancel')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;
