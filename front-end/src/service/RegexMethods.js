export const REGULAR_EXPRESSION_FOR_NUMBERS  = /^(\+|)?(\d*\.?\d*)$/;
export const REGULAR_EXPRESSION_FOR_AMOUNT  = /^\d*\.?(\d{0,2})$/;

export const onlyAmount = (e, old_data) => {
    if (e != undefined && REGULAR_EXPRESSION_FOR_AMOUNT) {
        const re = eval(REGULAR_EXPRESSION_FOR_AMOUNT);
        if (e.target.value != "" && !re.test(e.target.value)) {
            return old_data;
        }
    }

    return e.target.value;
}

export const onlyNumber = (e, old_data) => {
    if (e != undefined && REGULAR_EXPRESSION_FOR_NUMBERS) {
        const re = eval(REGULAR_EXPRESSION_FOR_NUMBERS);
        if (e.target.value != "" && !re.test(e.target.value)) {
            return old_data;
        }
    }

    return e.target.value;
}