function formatPrice(price){
    price = parseFloat(price);
    let formalizedPrice = formalizeStagePrice(price);
    let parts = formalizedPrice.toFixed(fixPoint(price)).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function formatRelativeRate(rate){
    rate *= 100;
    return `${rate > 0 ? "+" : ""}${rate.toFixed(2)}%`;
}

/*
    최소 단위: 0.01 KRW
    0.01 ~ 9.99: 0.01 KRW 단위
    10.00 ~ 99.90: 0.1 KRW 단위
    100 ~ 999: 1 KRW 단위
    1,000 ~ 9,995: 5 KRW 단위
    10,000 ~ 99,990: 10 KRW 단위
    100,000 ~ 499,950: 50 KRW 단위
    500,000 ~ 999,950: 100 KRW 단위
    1,000,000 ~ 99,999,000: 1000 KRW 단위
    100,000,000 ~ : 10,000 KRW 단위
*/
function formalizeStagePrice(price, avoid = null, defaultAscend = true){
    if(typeof value !== 'number') {price = Number(price);}
    let stage = getPriceUnit(price);

    return formalizeByQuotient(price, stage, avoid, defaultAscend);
}

function getPriceUnit(price){
    let stage = 1;

    if(price >= 100000000){
        stage = 10000;
    }else if(price >= 1000000){
        stage = 1000;
    }else if(price >= 500000){
        stage = 100;
    }else if(price >= 100000){
        stage = 50;
    }else if(price >= 10000){
        stage = 10;
    }else if(price >= 1000){
        stage = 5;
    }else if(price >= 100){
        stage = 1;
    }else if(price >= 10){
        stage = 0.1;
    }else if(price >= 0){
        stage = 0.01;
    }else{
        stage = 0;
    }

    return stage;
}

function getPriceIntervalUnit(price, min, max, recommended){
    let stage = getPriceUnit(price);
    let approximateStageCount = parseInt((max - min) / stage);
    if(recommended >= approximateStageCount) return stage;

    let adjustmentFactor = Math.round(approximateStageCount / recommended);

    return stage * adjustmentFactor;
}

function formalizeByQuotient(value, q, avoid, defaultAscend){
    if(typeof value !== 'number') {
        console.error("not parsable");
    }

    let quotient = roundInt(value / q);
    let result = q * quotient;

    if(avoid !== null && result === avoid){
        return result += (defaultAscend ? 1 : -1) * q;
    }

    return roundFloat(result);
}

function fixPoint(price){
    if(price >= 100) return 0;
    return 2;
}

function roundFloat(value, point = 3){
    return parseFloat(value.toFixed(point));
}

function roundInt(value, point = 3){
    return parseInt(value.toFixed(point));
}

function gaussianRandom() {
    let v1, v2, s;
  
    do {
      v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
      v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
      s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s == 0);
  
    s = Math.sqrt((-2 * Math.log(s))/s);
  
    return v1 * s;
}

function normalDistribution(min, max, skew = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
}