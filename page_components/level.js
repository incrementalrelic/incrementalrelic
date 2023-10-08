const intial_lvl = 1;
const intial_exp = 5;

function next_level(level, prev_exp, exp){
    const mult = level < 25 ? 1.3 : level < 40 ? 1.1 : 1.2
    if(level == 3){
        prev_exp = Number(prev_exp) + 23
    }
    if(Number(exp) >= Number(prev_exp)){
        return next_level(level+1, Number(prev_exp*mult).toFixed(0), Number(exp-prev_exp).toFixed(0))
    }
    return {level: level, next_level_exp: Number(prev_exp).toFixed(0), current_exp: Number(exp).toFixed(0)}
}

export function get_level_info(exp){
    var actualExp = exp || 0
    return next_level(intial_lvl, intial_exp, actualExp)
}