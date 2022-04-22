export function objAeEq(obj1, obj2) {
    let data1 = JSON.stringify(obj1)
    let data2 = JSON.stringify(obj2)
    return data1 === data2
}
