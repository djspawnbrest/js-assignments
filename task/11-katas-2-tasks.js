'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
      let result='';
    let source=bankAccount.split('\n');
    let pattern=RegExp(/(.{3})/);
    source=source.map(item=>item.split(pattern));
    for(let i=0;i<source[0].length;i++){
        if(source[0][i]==='   '&&source[1][i]==='  |')result+=1;
        if(source[2][i]==='|_ ')result+=2;
        if(source[1][i]===' _|'&&source[2][i]===' _|')result+=3;
        if(source[0][i]==='   '&&source[1][i]==='|_|')result+=4;
        if(source[1][i]==='|_ '&&source[2][i]===' _|')result+=5;
        if(source[1][i]==='|_ '&&source[2][i]==='|_|')result+=6;
        if(source[0][i]===' _ '&&source[2][i]==='  |')result+=7;
        if(source[1][i]==='|_|'&&source[2][i]==='|_|')result+=8;
        if(source[1][i]==='|_|'&&source[2][i]===' _|')result+=9;
        if(source[1][i]==='| |'&&source[2][i]==='|_|')result+=0;
    }
    return result; 
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let result='';
    if(text.length<=columns){
        return yield text;
    }
    while(text){
        let edge=text.slice(0,columns+1).lastIndexOf(' ');
        if(edge>0){
            result=text.slice(0,edge);
            yield result.trim();
            text=text.slice(edge).trim();
        }else{
            return yield text;
        }
    } 
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let suits='♥♠♦♣',
		digits='A234567891JQK',
		suits_arr=Array.from(suits,()=>0),
        digit_arr=Array.from(digits,()=>0);
    for (let card of hand){
        suits_arr[suits.indexOf(card.slice(-1))]++;
        digit_arr[digits.indexOf(card[0])]++;
    }
    digit_arr.push(digit_arr[0]);
    let suits_string=suits_arr.join(''),
        digit_string=digit_arr.join('');
    return (digit_string.indexOf('11111')!==-1)&&(suits_string.indexOf('5')!==-1)?PokerRank.StraightFlush
        :(digit_string.indexOf('4')!==-1)?PokerRank.FourOfKind
        :(digit_string.indexOf('2')!==-1)&&(digit_string.indexOf('3')!==-1)?PokerRank.FullHouse
        :(suits_string.indexOf('5') !== -1)?PokerRank.Flush
        :(digit_string.indexOf('11111')!==-1)?PokerRank.Straight
        :(digit_string.indexOf('3')!==-1)?PokerRank.ThreeOfKind
        :(digit_string.match(/2.*2.+/))?PokerRank.TwoPairs
        :(digit_string.indexOf('2')!== -1)?PokerRank.OnePair
        :PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let arr=figure.split('\n');
    for (let i=0;i<arr.length;i++){
        for(let j=0;j<arr[i].length;j++){
            if(arr[i][j]==='+'){
                let rect=findRectangle(arr,i,j);
                if(rect!==null){
                    yield drawRectangle(rect.weight,rect.height)
                }
            }
        }
    }
    function drawRectangle(weight,height){
        return '+'+'-'.repeat(weight-2)+'+\n'+
            ('|'+' '.repeat(weight-2)+'|\n').repeat(height-2)+
            '+'+'-'.repeat(weight - 2)+'+\n'
    }  
    function findRectangle(figure,fromRowIndex,fromColumnIndex){
        for (let i=fromRowIndex+1;i<figure.length;i++){
            if(figure[i][fromColumnIndex]==='+'){
                for(let j=fromColumnIndex+1;j<figure[fromRowIndex].length;j++){
                    if(figure[i][j]==="+"){
                        if(figure[fromRowIndex][j]==="+"){
                            let flag=true;
                            for(let k=fromRowIndex+1;k<i;k++){
                                if(!isVertical(figure[k][j])){
                                    flag=false;
                                    break;
                                }
                            }
                            for (let k=fromColumnIndex+1;k<j;k++){
                                if(!isHorizontal(figure[fromRowIndex][k])){
                                    flag=false;
                                    break;
                                }
                            }  
                            if(flag)
                                return{
                                    height:(i-fromRowIndex+1),
                                    weight:(j-fromColumnIndex+1)
                                };
                        }
                    }
                    else if(!isHorizontal(figure[i][j])){
                        break;
                    }
                }
            }
            else if(!isVertical(figure[i][fromColumnIndex])) {
                break;
            }
        }
        return null;
    }
    function isVertical(char){
        if(char==='+'||char==='|'){
            return true;
        }
        return false;
    }
    function isHorizontal(char){
        if(char==='+'||char=== '-'){
            return true;
        }
        return false;
    } 
}

module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
