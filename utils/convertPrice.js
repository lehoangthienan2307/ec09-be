import config from '../config/constants.js'

const convert = (to, from = 'vnd') => {
    switch (to) {
        case ('usd'): return (1 / 23000);
        case ('vnd'): return (1 / 1);
    }
}

export { convert }