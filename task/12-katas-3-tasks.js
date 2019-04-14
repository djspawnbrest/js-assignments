'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    function within_puzzle(next){
        if((next[0]>=0)&&(next[1]>=0)&&(next[0]<puzzle.length)&&(next[1]<puzzle[0].length)){
            return true;
        }
        return false;
    }
    function rec(excluded){
        if(searchStr.length===excluded.length){
            return true;
        }
        let curr_pos=excluded[excluded.length-1];
        for(let direction of [[0,1],[1,0],[0,-1],[-1,0]]){
            let next=[curr_pos[0]+direction[0],curr_pos[1]+direction[1]];
            if(within_puzzle(next)&&!excluded.some(item=>(item[0]===next[0])&&(item[1] === next[1]))&&(puzzle[next[0]][next[1]]===searchStr[excluded.length])&&rec(excluded.concat([next]))){
                return true;
            } 
        }
    }
    for(let i=0;i<puzzle.length;i++){
        for(let j=0;j<puzzle[0].length;j++){
            if((puzzle[i][j]===searchStr[0])&&rec([[i,j]])){
                return true;
            }
        }
    }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
        function* generate_string(string){
        if(string.length===chars.length){
            yield string;
        }else{
            for(let i=0;i<chars.length;i++){
                if(string.indexOf(chars[i])<0){               
                    yield* generate_string(string+chars[i]);
                }
            }
        }
    }
    yield* generate_string(''); 
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let profit=0;
    while(quotes.length>0){
        let current_max=Math.max.apply(null,quotes);
        let current_max_pos=quotes.lastIndexOf(current_max);
        if(current_max_pos===0){
            break;
        }
        let items_to_bye=quotes.splice(0,current_max_pos+1);
        let sum_to_bye=items_to_bye.reduce((a,b)=>a+b);
        profit+=items_to_bye.length*current_max-sum_to_bye;
    }
    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url){
        let result='';
        for(let i=0;i<url.length;i+=2){
            let a=url.charCodeAt(i);
            let b=url.charCodeAt(i+1);
            let code=(a<<8)|b;
            result+=String.fromCharCode(code);
        }
        return result;
    },
    decode: function(code){
        let result='';
        for(let i=0;i<code.length;i++){
            let char=parseInt(code.charCodeAt(i),10);
            let b=char&255;
            let a=(char>>8)&255;
            if(b===0){
                result+=String.fromCharCode(a)
            }else{
                result+=String.fromCharCode(a)+String.fromCharCode(b);
            }
        }
        return result;
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
