export function stringIsBlank(val: string) {
    return typeof val === 'undefined' || val === null || val.trim() === ''
}

export function stringIsNotBlank(val: string) {
    return typeof val !== 'undefined' && val !== null && val.trim() !== ''
}

export function listIsBlank(val: Array<object>) {
    return typeof val === 'undefined' || val === null || val.length === 0
}

export function listIsNotBlanK(val: Array<object>) {
    return typeof val !== 'undefined' && val !== null && val.length !== 0
}

