import concat from './concat';
import distinct from './distinct';
import filter from './filter';
import insert from './insert';
import join from './join';
import replace from './replace';
import reverse from './reverse';
import split from './split';
import substring from './substring';
import take from './take';
import trim from './trim';

export const textFunctions = {
    replace,
    concat,
    insert,
    substring,
    reverse,
    trim
};

export const sequenceFunctions = {
    filter,
    distinct,
    take,
};

export const conversionFunctions = {
    split,
    join,
};