export function getFileName(name) {
    return name.substring(0, name.lastIndexOf("."))
}

export function getExtension(name) {
    return name.substring(name.lastIndexOf(".") + 1)
}
