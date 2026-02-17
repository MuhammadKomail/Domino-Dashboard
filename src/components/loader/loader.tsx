// Note: Loader component...!

import React, { memo } from "react";
import { Dots } from "react-activity";
import { customStyles } from "@/styles/styles";

const Loader: React.FC = () => {
    return (
        <Dots
            color={customStyles.colors.black}
            size={customStyles.fontSize.size_12}
        />
    );
};

export default memo(Loader);