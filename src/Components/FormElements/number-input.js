// NumberInput.js
import React from 'react';
import style from "../../Styles/Components/number-input.module.scss"

function NumberInput(props) {
    const _handleChange = (e) => {
        const inputValue = e.target.value;

        // Regular expression to match a number with up to 1 decimal place
        const regex = /^\d*\.?\d{0,1}$/;

        if (regex.test(inputValue)) {
            props.onChange(inputValue);
        }
    };

    return (
        <input type="text"
            className={`w-100 p-2 ${style.number_input}`}
            value={props.value}
            onChange={_handleChange}
            placeholder={props.placeholder}
        />
    );
}

export default NumberInput;
