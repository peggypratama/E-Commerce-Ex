import brain from './brain'

export async function predict(config) {
    if (config.serie.length == 1) {
        let arr = []
        for (let i = 0; i < 7; i++)
            arr.push(config.serie[0])
        return {
            serie: arr,
            prediction: arr.slice(1, arr.length),
            simulation: arr,
            pastAndFuture: arr,
            meanerror: 0,
            trainOutput: []
        }
    }
    if (typeof (brain) != 'undefined') {
        var net = new brain.NeuralNetwork({
            //hiddenLayers: [4,3,2,1],
            learningRate: 0.01
        });
    } else {
        /*
        var the_brain = require("brain");
           var net = new the_brain.NeuralNetwork({
              //hiddenLayers: [4,3,2,1],
              learningRate: 0.01
           });
        */
        var the_brain = require("brain.js");
        var net = new the_brain.NeuralNetwork({
            //hiddenLayers: [4,3,2,1],
            learningRate: 0.01
        });
    }


    // max steps to check
    var checkSteps = config.serie.length - config.step;
    // max steps to predict
    var predictionSteps = config.predictionSteps;
    // steps per pattern
    var step = config.step;
    // serie value
    var serie = config.serie;

    if (step > serie.length) {
        step = serie.length - 1;
    }


    // calc meanValue
    var min = Infinity;
    for (var i = 0; i < serie.length; i++) {
        if (serie[i] < min) min = serie[i];
    }
    // offset only if min < 0
    //if (min > 0) min = 0;
    for (var i = 0; i < serie.length; i++) {
        serie[i] = serie[i] - min;
    }

    // normalize to 1
    var maxValue = 0;
    for (var i = 0; i < serie.length; i++) {
        if (maxValue < serie[i]) maxValue = serie[i];
    }

    var training = [];
    for (var i = 0; i < serie.length - step; i = i + 1) {
        var input = [];
        for (var ii = 0; ii < step; ii++) {
            var value = serie[ii + i] / maxValue;
            input.push(value);
        }

        var trainingObj = {
            input: input,
            output: [serie[i + step] / maxValue]
        }
        training.push(trainingObj);
    }
    if (training.length == 0) {
        return {};
    }

    var trainOutput = net.train(training, {
        errorThresh: 0.001,  // error threshold to reach
        iterations: 40000,   // maximum training iterations
        log: false,           // console.log() progress periodically
        logPeriod: 10        // number of iterations between logging
    });

    if (config.debug) console.log(trainOutput);

    var pastAndFuture = [];
    var totError = 0;
    var iter = 0;
    for (var i = 0; i < serie.length - step; i = i + 1) {
        iter++;
        var input = [];
        if (config.debug) var visualInput = [];
        for (var ii = 0; ii < step; ii++) {
            var value = serie[ii + i] / maxValue;
            input.push(value);
            if (config.debug) visualInput.push(serie[ii + i]);
        }
        var expectedoutput = serie[i + step];
        var output = net.run(input);
        var prediction = output[0] * maxValue;
        pastAndFuture.push(prediction);
        var error = Math.abs((prediction - expectedoutput)) / expectedoutput;
        if (expectedoutput === 0) error = 0;
        totError += error;
        if (config.debug) console.log(visualInput);
        if (config.debug) console.log("ExpectedOuput: " + expectedoutput);
        if (config.debug) console.log("Prediction: " + prediction);
        if (config.debug) console.log("Error: " + error + "\n");
    }

    var simulation = [];
    for (var i = 0; i < serie.length; i++) {
        simulation.push(serie[i]);
    }

    for (var i = 0; i < simulation.length - step; i = i + 1) {
        var input = [];
        if (config.debug) var visualInput = [];
        for (var ii = 0; ii < step; ii++) {
            var value = simulation[ii + i] / maxValue;
            input.push(value);
            if (config.debug) visualInput.push(simulation[ii + i]);
        }
        var output = net.run(input);
        var prediction = output[0] * maxValue;
        simulation[i + step] = prediction;
        if (config.debug) console.log(visualInput);
        if (config.debug) console.log("Prediction: " + prediction);
        if (config.debug) console.log("Error: " + error + "\n");
    }



    var start = serie.length - step;
    var maxStep = serie.length + predictionSteps - step;
    var predictionSerie = [];
    for (var i = start; i < maxStep; i = i + 1) {
        var input = [];
        //var visualInput = [] ;
        for (var ii = 0; ii < step; ii++) {
            var value = serie[ii + i] / maxValue;
            input.push(value);
            //visualInput.push(serie[ii+i]) ;
        }
        var output = net.run(input);
        var prediction = output[0] * maxValue;
        //console.log(visualInput) ;
        //console.log("Prediction: " + prediction + "\n") ;
        serie.push(prediction);
        predictionSerie.push(prediction);
        pastAndFuture.push(prediction);
    }

    for (var i = 0; i < serie.length; i++) {
        serie[i] = serie[i] + min;
    }

    for (var i = 0; i < prediction.length; i++) {
        prediction[i] = prediction[i] + min;
    }

    for (var i = 0; i < pastAndFuture.length; i++) {
        pastAndFuture[i] = pastAndFuture[i] + min;
    }

    for (var i = 0; i < simulation.length; i++) {
        simulation[i] = simulation[i] + min;
    }

    return {
        serie: serie,
        prediction: predictionSerie,
        simulation: simulation,
        pastAndFuture: pastAndFuture,
        meanerror: totError / iter,
        trainOutput: trainOutput
    }

}

export async function getRefinedOrders(orderObj) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let profits = [], dateIndexes = {}, dateIndex = -1, newOrderObj = [], dateDifference = 0
    for (let i = 0; i < orderObj.list.length; i++) { //creates dateIndexes and profit subarrays
        let o = orderObj.list[i]
        let dateStr = months[o.docData.timestamp.getMonth()] + ', ' + o.docData.timestamp.getFullYear()
        if (!isDatePresent(dateIndexes, dateStr)) {
            dateIndex++
            dateIndexes[dateIndex] = { month: o.docData.timestamp.getMonth(), year: o.docData.timestamp.getFullYear(), str: dateStr }
            profits.push([])
        }
        profits[dateIndex].push(o.docData.profit)
    }

    for (let i = 0; i <= dateIndex; i++) { // groups profit according to month, year
        let temp = { date: dateIndexes[i.toString()], profit: 0 }
        for (let j = 0; j < profits[i].length; j++)
            temp.profit += profits[i][j]
        newOrderObj.push(temp)

    }

    if (newOrderObj.length > 1) { // calculate average month difference
        let totalDiff = 0, total = 0;
        for (total = 0; total + 1 < newOrderObj.length; total++)
            totalDiff += getDateDifference(newOrderObj[total].date, newOrderObj[total + 1].date)
        dateDifference = totalDiff / total
    }
    else
        dateDifference = 1

    newOrderObj = {
        list: getProfits(newOrderObj),
        labels: getLabels(newOrderObj, dateDifference),
        profit: orderObj.profit,
        orders: orderObj.orders,
        steps: 7 - newOrderObj.length
    }

    return newOrderObj
}

function isDatePresent(dateObj, dateStr) {
    for (var i in dateObj) {
        if (dateObj[i].str == dateStr)
            return true
    }
    return false
}

function getDateDifference(date1, date2) {
    let monthDiff = Math.abs(date1.month - date2.month)
    let yearDiff = Math.abs(date1.year - date2.year)
    if (yearDiff > 0)
        return monthDiff + yearDiff * 12
    return monthDiff
}

function getLabels(orderObj, dateDiff) {
    let lbl = [], lastDate = orderObj[orderObj.length - 1].date
    for (var i = 0; i < orderObj.length; i++)
        lbl.push(orderObj[i].date.str)
    for (; i < 7; i++) {
        let nextDate = getNextDate(lastDate, dateDiff)
        lbl.push(nextDate.str)
        lastDate = nextDate
    }
    lbl.slice(Math.max(lbl.length - 7, 0))
    return lbl
}

function getNextDate(lastDate, dateDiff) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let nextMonth = lastDate.month, yearCount = 0
    for (let i = 0; i < dateDiff; i++) {
        if (nextMonth == 12) {
            yearCount++
            nextMonth = 0
        }
        nextMonth++
    }
    let d = new Date(lastDate.year + yearCount, nextMonth, 1)
    return { month: d.getMonth(), year: d.getFullYear(), str: months[d.getMonth()] + ", " + d.getFullYear() }
}

function getProfits(orderObj) {
    if (orderObj.length > 4)
        orderObj.slice(Math.max(orderObj.length - 4, 0))
    let profits = []
    for (let i = 0; i < orderObj.length; i++)
        profits.push(orderObj[i].profit)
    return profits
}

export function getDefaultLabels() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let now = new Date(), lbl = [];
    let currMonth = now.getMonth(), currYear = now.getFullYear()
    for (let i = 0; i < 10; i++) {
        let d = new Date(currYear, currMonth, 1)
        lbl.push(months[d.getMonth()] + ', ' + d.getFullYear())
        currMonth++
        if (currMonth == 12) {
            currMonth = 0
            currYear++
        }
    }
    return lbl
}

export function getDefaultData() {
    let data = []
    for (let i = 0; i < 6; i++)
        data.push(0)
    return data
}