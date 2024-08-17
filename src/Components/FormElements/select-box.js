
/* import package */
import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

import Colors from "../../Styles/color.module.scss";

// value, label

const CustomSelectBox = (props) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    const customStyles = {
        container: (defaultStyles, state) => ({
            ...defaultStyles,
        }),
        placeholder: (defaultStyles) => ({
            ...defaultStyles,
            margin: "0"
        }),
        control: (defaultStyles, state) => ({
            ...defaultStyles,
            minWidth: "86px",
            borderRadius: "12px",
            border: "none",
            background: "transparent",
            boxShadow: "0px 0px 2px 0px #00000033, 0px 0px 2px 0px #00000036, 0px 0px 1px 0px #00000033, 0px 0px 1px 0px #00000033",
            padding: "10px",
            "&:hover": {
                border: "none",
                cursor: 'pointer',
            },
        }),
        valueContainer: (defaultStyles) => ({
            ...defaultStyles,
            padding: "0px",
        }),
        menu: (defaultStyles) => ({
            ...defaultStyles,
            // width: "247px",
            right: "0",
            border: `1px solid ${Colors.athens_gray}`,
            background: Colors.white,
            boxShadow: "5px 3px 10px 0px #0000001A",
            borderRadius: "16px",
            zIndex: 10,
            width: props.width ? "200px" : "100%"
        }),


        menuList: (defaultStyles, state) => ({
            ...defaultStyles,
            padding: 0,
            '& > div:not(:last-child)': {
                borderBottom: `1px solid ${Colors.platinum}`,
            },
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            maxHeight: "15.625rem",
            "&::-webkit-scrollbar": {
                width: "0.125rem"
            },

            "&::-webkit-scrollbar-thumb": {
                backgroundColor: Colors.rebecca_purple,
                borderRadius: "0.25rem"
            },
            '&::-webkit-scrollbar-track': {
                marginTop: "0.313rem",
                marginBottom: "0.313rem"
            },
        }),

        dropdownIndicator: (defaultStyles, state) => ({
            ...defaultStyles,
            padding: "0",
            marginLeft: "4px",
            transition: "transform 0.2s",
            transform: state.selectProps.menuIsOpen === true && "rotate(-180deg)"
        }),

        option: (defaultStyles, state) => ({
            ...defaultStyles,
            padding: '12px 16px',
            fontFamily: "Montserrat-Medium",
            fontSize: "14px",
            fontStyle: " normal",
            fontWeight: "500",
            lineHeight: "24px",
            backgroundColor: state.isSelected ? Colors.light_lavender : Colors.white,
            color: state.isSelected ? Colors.rebecca_purple : Colors.black,
            // borderRadius: "12px",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: Colors.light_lavender,
                color: Colors.rebecca_purple
            },
        }),
    };

    const _onSelectChange = (value) => {
        props.onSelectChange(value)
    }

    return (
        <Fragment>
            <div className={`${props.className} `}>
                <Select value={value}
                    styles={customStyles}
                    isSearchable={false}
                    options={props.options}
                    placeholder={props.placeholder}
                    // menuIsOpen={true}
                    components={{
                        IndicatorSeparator: null,
                    }}
                    onChange={(value) => {
                        _onSelectChange(value)
                    }}
                />
            </div>

        </Fragment>
    );
}

export default CustomSelectBox;