/***** Note: Custom styling of the app *****/

// Note: All custom styling are defined here...!
const customStyles = {
    colors: {
        transparent: "transparent",
        black: "black",
        white: "white",
        whiteSmoke: "whitesmoke",
        lightgray: "#909090",
        silver: "silver",
        _8CD2CA: "#8CD2CA",
        _7DBEB6: "#7DBEB6",
        _8AD1C9: "#8AD1C9",
        _11637D: "#11637D",
        _058882: "#058882",
        _05597B: "#05597B",
        _3FA7A0: "#3FA7A0",
        _B1E0DA: "#B1E0DA",
        _206987: "#206987",
        _F3F3F3: "#F3F3F3",
        _D9D9D9: "#D9D9D9",
        _00867F: "#00867F",
        _296B88: "#296B88",
        _E92137: "#E92137",
        _ED596A: "#ED596A",
        _1976d2: "#1976d2",
        _fff: "#fff",
        _ffffff30: "#ffffff30",
        _09CD87: "#09CD87",
        _ffffffcc: "#ffffffcc",
        _f5f5f5: "#f5f5f5",
        _84E6C3: "#84E6C3",
        _B9C7FB: "#B9C7FB",
        _FFF987: "#FFF987"
    },

    fontFamily: {
        georgia: "georgia",
    },

    fontWeight: {
        normal: "normal",
        bold: "bold",
    },

    fontSize: {
        size_heading: 24,
        size_subheading: 14,
        size_para: 12,
        size_0: 0,
        size_1: 1,
        size_2: 2,
        size_3: 3,
        size_4: 4,
        size_5: 5,
        size_6: 6,
        size_7: 7,
        size_8: 8,
        size_9: 9,
        size_10: 10,
        size_12: 12,
        size_13: 13,
        size_14: 14,
        size_15: 15,
        size_16: 16,
        size_17: 17,
        size_18: 18,
        size_19: 19,
        size_20: 20,
        size_22: 22,
        size_25: 25,
        size_35: 35,
        size_50: 50,
        size_60: 60
    },

    sizeInPercent: {
        size_10: '10%',
        size_50: '50%',
        size_100: '100%'
    },

    vhSize: {
        vh_100: "100vh"
    },

    direction: {
        row: "row",
        column: "column"
    },

    alignment: {
        center: "center",
        left: "left",
        right: "right",
        spaceBetween: "space-between"
    },

    position: {
        relative: 'relative',
        absolute: 'absolute'
    },

    textTransformation: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
        none: "none"
    }
};

const pairsStyling = {
    contentInCenter: {
        display: "flex",
        justifyContent: customStyles.alignment.center,
        alignItems: customStyles.alignment.center
    },
};

export { customStyles, pairsStyling };