var mimir = require('./mimir'),
    bow = mimir.bow,
    dict = mimir.dict;
var similarity = require('compute-cosine-similarity');
var Jaccard = require("jaccard-index");
var jaccard = Jaccard();

export function tokenize(str) {
    return str.toLowerCase().split(/[^A-Za-z0-9]+/);
}

export function getWords(strArr) {
    let voc = dict(strArr);
    return voc
}

export function getBagOfWords(str, words) {
    return bow(str, words)
}

export function getBOWObj(arr, words) {
    let objArr = []
    arr.forEach(element => {
        objArr.push(getBagOfWords(element, words))
    });
    return objArr
}

export function getBOW(arr) {
    let words = getWords(arr)
    return getBOWObj(arr, words)
}

export function addBoolToVectors(vec1, vec2, val1, val2) {
    if (val1 == "Yes")
        vec1.push(1)
    else
        vec1.push(0)
    if (val2 == "Yes")
        vec2.push(1)
    else
        vec2.push(0)
}

export function addNumberToVectors(vec1, vec2, val1, val2) {
    let v1 = val1, v2 = val2
    if (typeof val1 == 'string')
        v1 = parseFloat(val1)
    if (typeof val2 == 'string')
        v2 = parseFloat(val2)
    vec1.push(parseFloat(v1))
    vec2.push(parseFloat(v2))
}

export function getSimilarity(obj1, obj2, category) {
    let obj1Vector = [], obj2Vector = []
    let titleBowArr = getBOW([obj1["Title"], obj2["Title"]])
    let descBowArr = getBOW([obj1["Description"], obj2["Description"]])
    let uidBowArr = getBOW([obj1["uid"], obj2["uid"]])
    let outBowArr = getBOW([obj1["outletID"], obj2["outletID"]])
    obj1Vector = titleBowArr[0].concat(descBowArr[0]).concat(uidBowArr[0]).concat(outBowArr[0])
    obj2Vector = titleBowArr[1].concat(descBowArr[1]).concat(uidBowArr[1]).concat(outBowArr[1])
    addNumberToVectors(obj1Vector, obj2Vector, obj1["Price"], obj2["Price"])
    addNumberToVectors(obj1Vector, obj2Vector, obj1["Location"].latitude, obj2["Location"].latitude)
    addNumberToVectors(obj1Vector, obj2Vector, obj1["Location"].longitude, obj2["Location"].longitude)
    if (category == "Vehicles") {
        let colorBowArr = getBOW([obj1["Color"], obj2["Color"]])
        let transBowArr = getBOW([obj1["Transmission"], obj2["Transmission"]])
        obj1Vector = obj1Vector.concat(colorBowArr[0]).concat(transBowArr[0]);
        obj2Vector = obj2Vector.concat(colorBowArr[1]).concat(transBowArr[1]);
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Air Conditioning"], obj2["Air Conditioning"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Airbags"], obj2["Airbags"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Alloy Rims"], obj2["Alloy Rims"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Central Locking"], obj2["Central Locking"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Media Player"], obj2["Media Player"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Mileage"], obj2["Mileage"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Model Year"], obj2["Model Year"])
    }
    else if (category == 'Houses') {
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Backyard"], obj2["Backyard"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Cable"], obj2["Cable"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Boaring"], obj2["Boaring"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Central Cooling"], obj2["Central Cooling"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Central Heating"], obj2["Central Heating"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Internet"], obj2["Internet"])
        addBoolToVectors(obj1Vector, obj2Vector, obj1["Lawn"], obj2["Lawn"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Bathrooms"], obj2["Bathrooms"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Bedrooms"], obj2["Bedrooms"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Completion Year"], obj2["Completion Year"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Drawing Rooms"], obj2["Drawing Rooms"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Floors"], obj2["Floors"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Kitchens"], obj2["Kitchens"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Lounge Rooms"], obj2["Lounge Rooms"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Marhalas"], obj2["Marhalas"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Parking Spaces"], obj2["Parking Spaces"])
        addNumberToVectors(obj1Vector, obj2Vector, obj1["Store Rooms"], obj2["Store Rooms"])
    }
    else {
        let titles = [], descriptions = []
        if (obj1["Features"].length) {
            obj1["Features"].forEach(ele => {
                titles.push(ele.title.toLowerCase())
                descriptions.push(ele.description.toLowerCase())
            })
        }
        if (obj2["Features"].length) {
            obj2["Features"].forEach(ele => {
                titles.push(ele.title.toLowerCase())
                descriptions.push(ele.description.toLowerCase())
            })
        }
        if (titles.length && descriptions.length) {
            let featuresBowArr = getBOW(titles.concat(descriptions))
            obj1Vector = obj1Vector.concat(featuresBowArr[0]);
            obj2Vector = obj2Vector.concat(featuresBowArr[1]);
        }
        return jaccard.index(obj1Vector, obj2Vector);
    }
    return similarity(obj1Vector, obj2Vector)
}