import concat from './concat';
import distinct from './distinct';
import filter from './filter';
import insert from './insert';
import join from './join';
import replace from './replace';
import reverse from './reverse';
import sort from './sort';
import split from './split';
import substring from './substring';
import take from './take';
import trim from './trim';
import truncate from './truncate';

export const textFunctions = {
    replace,
    concat,
    insert,
    substring,
    trim,
    truncate,
    reverse,
};

export const sequenceFunctions = {
    filter,
    distinct,
    sort,
    take,
};

export const conversionFunctions = {
    split,
    join,
};