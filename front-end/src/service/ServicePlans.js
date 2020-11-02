export function ServicePlans(key) {
    var interpreter = [
        { value: 1, label: 'Monthly'},
        { value: 2, label: 'Quarterly'},
        { value: 3, label: 'Yearly'},
    ];

    if (key == -1) {
        return interpreter;
    } else {
        var index = interpreter.findIndex(x => x.value == key)
        return interpreter[index].label;

    }
}