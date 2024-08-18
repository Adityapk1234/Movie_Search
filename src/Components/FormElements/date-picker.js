
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import { useClickOutside } from '../../Helper/helper';
import style from "../../Styles/Components/date-picker.module.scss"


const CustomDatePicker = React.memo((props) => {
    // state when date is a range
    const [range, setRange] = useState(props.start === "DD-MM-YYYY" ?
        { from: null, to: null }
        :
        {
            from: new Date(parseDate(props.start)),
            to: new Date(parseDate(props.end))
        });
    // drop down open
    const [show, setShow] = useState(false);
    const calendarRef = useRef(null);

    useClickOutside(calendarRef, () => {
        setShow(false);
    });

    useEffect(() => {
        props.menuOpen(show);

        //eslint-disable-next-line
    }, [show])

    useEffect(() => {
        if (range && range.from && range.to) {
            setShow(false);
            props.selectDate(range);
        }
        //eslint-disable-next-line
    }, [range]);

    function handleCalendar() {
        setShow(true);
    }

    // default date function when date is not passed
    function parseDate(dateString) {
        const parts = dateString.split('-');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    return (
        <Fragment>
            {props.label && <label className={`mb-1`}>
                {props.label}
            </label>}
            <div className='position-relative' ref={calendarRef} >
                <div className={`${props.className} d-flex align-items-center justify-content-between  bg-white border-1px  p-2 border-radius-8px cursor-pointer mb-0 ${style.label_date}`}
                    onClick={handleCalendar}>
                    {props.start} - {props.end}
                    <img src={require("../../Assets/Images/schedule.png")}
                        alt="Calender"
                        width={24}
                        height={24}
                        draggable={false} />
                </div>

                {show && (
                    <div className={`position-absolute z-index-1 top-56px ${props.popupClass}`}>
                        <DayPicker
                            id="test"
                            disabled={props.disabledDays}
                            mode="range"
                            defaultMonth={props.defaultMonth}
                            captionLayout="dropdown"
                            fromYear={1947}
                            toYear={props.toYear}
                            selected={range}
                            onSelect={setRange}
                        />
                    </div>
                )}
            </div>
        </Fragment>
    );
});

CustomDatePicker.defaultProps = {
    start: "DD-MM-YYYY",
    end: "DD-MM-YYYY",
    menuOpen: () => { },
    toYear: new Date().getFullYear()
};

export default CustomDatePicker;
