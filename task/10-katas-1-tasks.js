'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides=['N','E','S','W'];
    let result=[];
    for(let i=1;i<=sides.length;i++){
        let ch1=sides[i-1],
            ch2,
            chars;
        ch2=(i===sides.length?sides[0]:sides[i]);
        chars=(i%2===0?ch2+ch1:ch1+ch2);
        let quarter=[
            {abbreviation:ch1},
            {abbreviation:ch1+'b'+ch2},
            {abbreviation:ch1+chars},
            {abbreviation:chars+'b'+ch1},
            {abbreviation:chars},
            {abbreviation:chars+'b'+ch2},
            {abbreviation:ch2+chars},
            {abbreviation:ch2+'b'+ch1}
        ];
        result=result.concat(quarter);
    }
    let azimuth=0.00;
    const azimuth_delta=11.25;
    for(let n=0;n<result.length;n++){
        result[n].azimuth=azimuth;
        azimuth+=azimuth_delta;
    }
    return result; 
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str){
        let source=[str],
        result=[];
    while(source.length>0){
        let new_string=source.pop(),
            match_array=new_string.match(/{([^{}]+)}/);
        if (match_array!==null){
            for(let value of match_array[1].split(',')){
                source.push(new_string.replace(match_array[0],value));
            }
        }else if(result.indexOf(new_string)<0){
            result.push(new_string);
            yield new_string;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let result=[];
    for(let x=0;x<n;x++){
        result[x]=[];
    }
    let current=0;
    for(let i=1;i<2*n;i++){
        let direction_up=(i%2===0)?false:true;
        let y,x;
        if(i<=n){
            x=0;
            y=i-1;
        }else{
            x=i-n;
            y=n-1;
        }
        if(direction_up===true){
            let tmp=y;
            y=x;
            x=tmp;
        }
        let diag_length=(i>n)?2*n-i:i;
        for(let j=0;j<diag_length;j++){
            result[x][y]=current;
            if(direction_up){
                x--;
				y++;
            }else{
                x++;
				y--;
            }
            current++;
        }
    }
    return result;  
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let returned_value=false;
    let is_visited=(new Array(dominoes.length)).fill(false);

    function rec(index,value,left){
        if (left===0){
            returned_value=true;
            return;
        }
        is_visited[index]=true;
        for(let i=0;i<dominoes.length;i++){
            if(!is_visited[i]){
                if(dominoes[i].indexOf(value)!==-1){
                    rec(i,dominoes[i][0]===value?dominoes[i][1]:dominoes[i][0],left-1);
                }
            }
        }
        is_visited[index]=false;
    }
    for(let i=0;i<dominoes.length;i++){
        for (let j=0;j<dominoes[i].length;j++){
            rec(i,dominoes[i][j],dominoes.length-1);
            if (returned_value===true){
                return true;
            }
        }      
    }
    return false; 
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result='';
    for(let i=0;i<nums.length;i++){
        let start=i;
        while(nums[++i]===nums[i-1]+1){ }
        i--;
        if(i-start>1){
            result+=nums[start]+'-'+nums[i];
        }else{
            result+=(i-start)===0?nums[i]:nums[start]+','+nums[i];
        }
        result+=',';
    }
    return result.slice(0, -1); 
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
